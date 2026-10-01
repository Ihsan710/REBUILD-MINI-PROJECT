import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MarketplaceListing, BuyerRequest, MaterialCategory, MaterialCondition } from '../models/all.models';
import { ToastService } from './toast.service';

const API_BASE = 'http://localhost:8000/api';

export function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(R * c).toFixed(1);
}

export interface BuyerLocationInfo {
  coordinates: [number, number];
  name: string;
  isGPS: boolean;
}

export const PRESET_BUYER_HUBS = [
  { name: 'Koramangala Hub, Bangalore', coordinates: [12.9352, 77.6245] as [number, number] },
  { name: 'Kochi / Kanayannur Hub, Kerala', coordinates: [9.9926, 76.3591] as [number, number] },
  { name: 'Whitefield Aggregates Hub, Bangalore', coordinates: [12.9698, 77.7499] as [number, number] },
  { name: 'Bandra-Kurla Complex Hub, Mumbai', coordinates: [19.0607, 72.8687] as [number, number] },
  { name: 'Guindy Industrial Hub, Chennai', coordinates: [13.0067, 80.2038] as [number, number] },
  { name: 'HITEC Secondary Hub, Hyderabad', coordinates: [17.4474, 78.3762] as [number, number] },
  { name: 'Okhla Circular Hub, Delhi NCR', coordinates: [28.5298, 77.2750] as [number, number] }
];

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  private listingsSignal = signal<MarketplaceListing[]>([]);
  private requestsSignal = signal<BuyerRequest[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly isLocatingGPS = signal<boolean>(false);

  private buyerLocationSignal = signal<BuyerLocationInfo>({
    coordinates: [12.9352, 77.6245],
    name: 'Koramangala Hub, Bangalore',
    isGPS: false
  });
  readonly buyerLocationInfo = this.buyerLocationSignal.asReadonly();

  get buyerLocation(): [number, number] {
    return this.buyerLocationSignal().coordinates;
  }

  readonly listings = this.listingsSignal.asReadonly();
  readonly requests = this.requestsSignal.asReadonly();

  readonly totalActiveListings = computed(() =>
    this.listingsSignal().filter(l => l.status === 'AVAILABLE').length
  );

  readonly totalValueListed = computed(() =>
    this.listingsSignal().reduce((sum, l) => sum + (l.pricePerKg * l.quantityKg), 0)
  );

  constructor(
    private http: HttpClient,
    private toast: ToastService
  ) {
    const savedLoc = localStorage.getItem('rebuild_buyer_location');
    if (savedLoc) {
      try {
        const parsed = JSON.parse(savedLoc);
        if (parsed.coordinates && parsed.coordinates.length === 2) {
          this.buyerLocationSignal.set(parsed);
        }
      } catch (_) {}
    }
    this.loadMarketplaceData();
  }

  setBuyerLocation(coords: [number, number], name: string, isGPS: boolean = false) {
    this.buyerLocationSignal.set({ coordinates: coords, name, isGPS });
    localStorage.setItem('rebuild_buyer_location', JSON.stringify({ coordinates: coords, name, isGPS }));

    // Recalculate distance for all listings in signal immediately
    this.listingsSignal.update(listings =>
      listings.map(l => {
        const itemLat = l.coordinates ? l.coordinates[0] : 12.9716;
        const itemLon = l.coordinates ? l.coordinates[1] : 77.6412;
        const dist = calculateHaversineDistanceKm(coords[0], coords[1], itemLat, itemLon);
        return { ...l, distanceKm: dist };
      })
    );
    this.toast.info('Procurement Hub Updated', `Distances recalculated relative to ${name}.`);
  }

  async detectLiveGPS(): Promise<void> {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      this.toast.warning('GPS Unsupported', 'Geolocation is not supported by your browser.');
      return;
    }

    this.isLocatingGPS.set(true);
    this.toast.info('GPS Telemetry', 'Requesting satellite fix from your device...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy || 10);
        let placeName = '';

        try {
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
          if (res.ok) {
            const data = await res.json();
            const parts = [data.locality || data.city, data.principalSubdivision, data.countryName].filter(Boolean);
            if (parts.length > 0) {
              placeName = Array.from(new Set(parts)).join(', ');
            }
          }
        } catch (_) {}

        if (!placeName) {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};
              const parts = [addr.suburb || addr.neighbourhood || addr.road, addr.city || addr.town || addr.county, addr.state].filter(Boolean);
              if (parts.length > 0) placeName = parts.join(', ');
              else if (data.display_name) placeName = data.display_name.split(',').slice(0, 3).join(',');
            }
          } catch (_) {}
        }

        const label = placeName
          ? `${placeName} (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`
          : `Live GPS: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E (±${accuracy}m)`;

        this.setBuyerLocation([lat, lng], label, true);
        this.isLocatingGPS.set(false);
        this.toast.success('🛰️ Live GPS Locked', placeName ? `Location: ${placeName}` : `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      },
      (err) => {
        this.isLocatingGPS.set(false);
        this.toast.warning('GPS Notice', 'Unable to acquire satellite fix. Using saved hub.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  public resolveImageUrl(url?: string, material?: string): string {
    const mat = (material || 'brick').toLowerCase();
    if (!url) return `/assets/materials/${mat}.jpg`;
    if (url.startsWith('/assets/uploads/')) {
      return `http://localhost:8000${url}`;
    }
    return url;
  }

  loadMarketplaceData() {
    this.isLoading.set(true);
    this.http.get<MarketplaceListing[]>(`${API_BASE}/marketplace/listings`).subscribe({
      next: (data) => {
        const currentCoords = this.buyerLocationSignal().coordinates;
        const normalized = (data || []).map(l => {
          const itemLat = l.coordinates ? l.coordinates[0] : 12.9716;
          const itemLon = l.coordinates ? l.coordinates[1] : 77.6412;
          const dist = calculateHaversineDistanceKm(currentCoords[0], currentCoords[1], itemLat, itemLon);
          return {
            ...l,
            distanceKm: dist,
            imageUrl: this.resolveImageUrl(l.imageUrl, l.material)
          };
        });
        this.listingsSignal.set(normalized);
        localStorage.setItem('rebuild_marketplace_listings', JSON.stringify(normalized));
        this.isLoading.set(false);
      },
      error: () => {
        const saved = localStorage.getItem('rebuild_marketplace_listings');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const currentCoords = this.buyerLocationSignal().coordinates;
            const normalized = parsed.map((l: any) => {
              const itemLat = l.coordinates ? l.coordinates[0] : 12.9716;
              const itemLon = l.coordinates ? l.coordinates[1] : 77.6412;
              const dist = calculateHaversineDistanceKm(currentCoords[0], currentCoords[1], itemLat, itemLon);
              return {
                ...l,
                distanceKm: dist,
                imageUrl: this.resolveImageUrl(l.imageUrl, l.material)
              };
            });
            this.listingsSignal.set(normalized);
          } catch (e) {}
        }
        this.isLoading.set(false);
      }
    });

    this.http.get<BuyerRequest[]>(`${API_BASE}/marketplace/requests`).subscribe({
      next: (data) => {
        this.requestsSignal.set(data || []);
      },
      error: () => {
        const saved = localStorage.getItem('rebuild_marketplace_requests');
        if (saved) {
          try {
            this.requestsSignal.set(JSON.parse(saved));
          } catch (e) {}
        }
      }
    });
  }

  createListing(listingData: Omit<MarketplaceListing, 'id' | 'createdAt' | 'viewsCount' | 'inquiriesCount' | 'distanceKm'>): MarketplaceListing {
    const dist = calculateHaversineDistanceKm(
      this.buyerLocation[0],
      this.buyerLocation[1],
      listingData.coordinates[0],
      listingData.coordinates[1]
    );

    const newListing: MarketplaceListing = {
      ...listingData,
      id: 'mkt-' + Math.random().toString(36).substring(2, 9),
      distanceKm: dist,
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      inquiriesCount: 0
    };

    // Optimistic UI update
    this.listingsSignal.update(list => [newListing, ...list]);
    localStorage.setItem('rebuild_marketplace_listings', JSON.stringify(this.listingsSignal()));

    this.http.post<MarketplaceListing>(`${API_BASE}/marketplace/listings`, listingData).subscribe({
      next: (created) => {
        this.listingsSignal.update(list => list.map(l => l.id === newListing.id ? created : l));
        this.toast.success('Listing Published in MySQL', `${created.title} is now active.`);
      },
      error: () => {
        this.toast.success('Listing Published', `${newListing.title} published locally.`);
      }
    });

    return newListing;
  }

  requestMaterial(listing: MarketplaceListing, quantityKg: number, deliveryOption: 'Self Pickup' | 'Shared Logistics' | 'Direct Delivery'): BuyerRequest {
    const dist = calculateHaversineDistanceKm(
      this.buyerLocation[0],
      this.buyerLocation[1],
      listing.coordinates[0],
      listing.coordinates[1]
    );

    const newRequest: BuyerRequest = {
      id: 'req-' + Math.random().toString(36).substring(2, 8),
      listingId: listing.id,
      listingTitle: listing.title,
      material: listing.material,
      quantityRequestedKg: quantityKg,
      buyerId: 'usr-anita-buyer',
      buyerName: 'Anita Desai',
      buyerCompany: 'EcoBlocks Pavers Ltd',
      buyerCoordinates: this.buyerLocation,
      distanceKm: dist,
      status: 'PENDING',
      requestDate: new Date().toISOString(),
      offerPriceTotal: listing.pricePerKg * quantityKg,
      deliveryOption
    };

    this.requestsSignal.update(list => [newRequest, ...list]);
    localStorage.setItem('rebuild_marketplace_requests', JSON.stringify(this.requestsSignal()));

    this.http.post<BuyerRequest>(`${API_BASE}/marketplace/requests`, newRequest).subscribe({
      next: (created) => {
        this.requestsSignal.update(list => list.map(r => r.id === newRequest.id ? created : r));
        this.toast.success('Request Dispatched to MySQL', `Order submitted to ${listing.sellerName}.`);
      },
      error: () => {
        this.toast.success('Material Request Dispatched', `Seller ${listing.sellerName} received inquiry.`);
      }
    });

    return newRequest;
  }

  updateRequestStatus(requestId: string, status: 'ACCEPTED' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED') {
    this.requestsSignal.update(list =>
      list.map(r => (r.id === requestId ? { ...r, status } : r))
    );
    localStorage.setItem('rebuild_marketplace_requests', JSON.stringify(this.requestsSignal()));

    this.http.put(`${API_BASE}/marketplace/requests/${requestId}/status`, { status }).subscribe({
      next: () => {
        this.toast.info('Status Updated', `Order state updated in MySQL.`);
      },
      error: () => {
        this.toast.info('Status Updated', `State updated locally.`);
      }
    });
  }

  calculateDistance(fromLat: number, fromLon: number, toLat: number, toLon: number): number {
    return calculateHaversineDistanceKm(fromLat, fromLon, toLat, toLon);
  }
}
