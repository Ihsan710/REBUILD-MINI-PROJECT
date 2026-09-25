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

const USER_BUYER_COORDS: [number, number] = [12.9352, 77.6245];

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  private listingsSignal = signal<MarketplaceListing[]>([]);
  private requestsSignal = signal<BuyerRequest[]>([]);
  readonly isLoading = signal<boolean>(false);

  readonly listings = this.listingsSignal.asReadonly();
  readonly requests = this.requestsSignal.asReadonly();
  readonly buyerLocation: [number, number] = USER_BUYER_COORDS;

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
    this.loadMarketplaceData();
  }

  loadMarketplaceData() {
    this.isLoading.set(true);
    this.http.get<MarketplaceListing[]>(`${API_BASE}/marketplace/listings`).subscribe({
      next: (data) => {
        this.listingsSignal.set(data || []);
      },
      error: () => {
        const saved = localStorage.getItem('rebuild_marketplace_listings');
        if (saved) {
          try {
            this.listingsSignal.set(JSON.parse(saved));
          } catch (e) {}
        }
      }
    });

    this.http.get<BuyerRequest[]>(`${API_BASE}/marketplace/requests`).subscribe({
      next: (data) => {
        this.requestsSignal.set(data || []);
        this.isLoading.set(false);
      },
      error: () => {
        const saved = localStorage.getItem('rebuild_marketplace_requests');
        if (saved) {
          try {
            this.requestsSignal.set(JSON.parse(saved));
          } catch (e) {}
        }
        this.isLoading.set(false);
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
