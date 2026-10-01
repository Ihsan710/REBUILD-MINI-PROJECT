import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MarketplaceService, PRESET_BUYER_HUBS } from '../../core/services/marketplace.service';
import { ToastService } from '../../core/services/toast.service';
import { MarketplaceListing, BuyerRequest } from '../../core/models/all.models';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { BadgeComponent } from '../../shared/components/badge.component';

@Component({
  selector: 'app-buyer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, StatCardComponent],
  template: `
    <div class="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-[#1C1917]">
      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DBD1]">
        <div>
          <div class="flex items-center gap-2 text-xs font-mono text-sky-600 font-bold mb-1">
            <span class="w-2 h-2 rounded-full bg-sky-600"></span>
            SECONDARY PROCUREMENT HUB
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight">Buyer Marketplace Feed</h1>
          <p class="text-xs sm:text-sm text-[#78716C] mt-0.5">Procure verified reusable bricks, timber, rebar, and secondary aggregates within your geographic radius.</p>
        </div>

        <a routerLink="/marketplace" class="rb-btn-primary text-xs shadow cursor-pointer">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Open Geospatial Map
        </a>
      </div>

      <!-- BUYER LOCATION & PROXIMITY HUB CONTROL CARD -->
      <div class="rb-card p-5 sm:p-6 space-y-4 border border-[#E5DFD7] shadow-sm">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E5DFD7]">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full flex items-center justify-center"
                    [ngClass]="marketplaceService.buyerLocationInfo().isGPS ? 'bg-emerald-500 ring-4 ring-emerald-100 animate-pulse' : 'bg-amber-500 ring-4 ring-amber-100'">
              </span>
              <span class="text-xs font-mono font-bold tracking-wider uppercase text-[#1C1917]">
                {{ marketplaceService.buyerLocationInfo().isGPS ? '🛰️ LIVE SATELLITE GPS ACQUIRED' : '📍 CONFIGURED PROCUREMENT HUB' }}
              </span>
            </div>
            <h2 class="text-base sm:text-lg font-extrabold text-[#1C1917] mt-1 flex flex-wrap items-center gap-2">
              <span>Current Site Location:</span>
              <span class="text-emerald-700 font-semibold">{{ marketplaceService.buyerLocationInfo().name }}</span>
            </h2>
            <p class="text-xs text-[#78716C] mt-0.5">
              Haversine geodesic distances are recalculated in real-time to discover secondary resources nearest to your construction site.
            </p>
          </div>

          <!-- ACTION BUTTONS: LIVE GPS OR CHANGE HUB -->
          <div class="flex flex-wrap items-center gap-2">
            <button
              (click)="detectLiveGPS()"
              [disabled]="marketplaceService.isLocatingGPS()"
              class="rb-btn-primary text-xs py-2 px-3.5 flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <svg *ngIf="!marketplaceService.isLocatingGPS()" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <svg *ngIf="marketplaceService.isLocatingGPS()" class="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>{{ marketplaceService.isLocatingGPS() ? 'Locking GPS Fix...' : 'Detect My Live Location' }}</span>
            </button>

            <div class="relative inline-block text-xs">
              <select
                [(ngModel)]="selectedHubName"
                (ngModelChange)="onHubChange($event)"
                class="px-3.5 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#C5B7A5] cursor-pointer"
              >
                <option value="" disabled>Select Procurement Hub...</option>
                <option *ngFor="let hub of presetHubs" [value]="hub.name">{{ hub.name }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- DISCOVERY FILTERS & RADIUS CONTROLS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          <!-- Radius Filter -->
          <div>
            <label class="block text-[11px] font-bold text-[#78716C] uppercase font-mono mb-1">Procurement Radius</label>
            <select
              [(ngModel)]="selectedRadiusKm"
              class="w-full px-3 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs font-semibold text-[#1C1917]"
            >
              <option [ngValue]="10">Within 10 km (Ultra-local)</option>
              <option [ngValue]="25">Within 25 km (Local Metro)</option>
              <option [ngValue]="50">Within 50 km (Suburban Ring)</option>
              <option [ngValue]="100">Within 100 km (Regional Hub)</option>
              <option [ngValue]="500">Within 500 km (Inter-State)</option>
              <option [ngValue]="5000">Pan-India (All Distances)</option>
            </select>
          </div>

          <!-- Sort Order -->
          <div>
            <label class="block text-[11px] font-bold text-[#78716C] uppercase font-mono mb-1">Sort Priority</label>
            <select
              [(ngModel)]="selectedSort"
              class="w-full px-3 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs font-semibold text-[#1C1917]"
            >
              <option value="nearest">⚡ Nearest Distance First</option>
              <option value="price_asc">💰 Price: Low to High</option>
              <option value="price_desc">💎 Price: High to Low</option>
              <option value="quantity">⚖️ Quantity: Largest First</option>
            </select>
          </div>

          <!-- Material Filter -->
          <div>
            <label class="block text-[11px] font-bold text-[#78716C] uppercase font-mono mb-1">Material Type</label>
            <select
              [(ngModel)]="selectedCategory"
              class="w-full px-3 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs font-semibold text-[#1C1917]"
            >
              <option value="ALL">All Materials</option>
              <option value="Brick">🧱 Brick & Terracotta</option>
              <option value="Concrete">🪨 Concrete & Rubble</option>
              <option value="Metal">🔩 Metal, Rebar & Steel</option>
              <option value="Wood">🪵 Wood & Timber</option>
              <option value="Drywall">📦 Gypsum Drywall</option>
              <option value="Ceramic">🏺 Ceramic Tiles</option>
            </select>
          </div>

          <!-- Search Text -->
          <div>
            <label class="block text-[11px] font-bold text-[#78716C] uppercase font-mono mb-1">Search Keywords</label>
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                placeholder="Filter title, seller, city..."
                class="w-full pl-8 pr-3 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs text-[#1C1917] placeholder-[#A8A29E]"
              />
              <svg class="w-3.5 h-3.5 text-[#78716C] absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- BUYER KPIS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-stat-card
          label="AVAILABLE IN RADIUS"
          [value]="filteredAndSortedListings.length"
          unit="lots"
          [subtitle]="selectedRadiusKm >= 5000 ? 'Pan-India coverage' : 'Within ' + selectedRadiusKm + ' km radius'"
          variant="sky"
        ></app-stat-card>

        <app-stat-card
          label="CLOSEST MATERIAL LOT"
          [value]="nearestDistanceInRadius"
          subtitle="Direct Haversine transit"
          variant="emerald"
        ></app-stat-card>

        <app-stat-card
          label="AVERAGE RADIUS"
          [value]="averageDistanceInRadius"
          unit="km"
          subtitle="Active search radius"
          variant="amber"
        ></app-stat-card>

        <app-stat-card
          label="ACTIVE PROCUREMENT ORDERS"
          [value]="marketplaceService.requests().length"
          unit="orders"
          subtitle="In transit / processing"
          variant="emerald"
        ></app-stat-card>
      </div>

      <!-- MY ACTIVE ORDERS TRACKING -->
      <div class="rb-card p-6 space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-[#E5DFD7]">
          <div>
            <h3 class="text-base font-bold text-[#1C1917]">Your Material Purchase Dispatches</h3>
            <p class="text-xs text-[#78716C]">Track pickup readiness and transport logistics.</p>
          </div>
          <span class="badge-blue">Live Telemetry</span>
        </div>

        <div class="divide-y divide-[#E5DFD7]">
          <div *ngFor="let req of marketplaceService.requests()" class="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-[#1C1917] text-sm">{{ req.listingTitle }}</span>
                <span class="badge-green">{{ req.status }}</span>
              </div>
              <div class="text-[#78716C] mt-1 font-mono">
                Qty: {{ req.quantityRequestedKg }} kg • Est Total: ₹{{ req.offerPriceTotal | number }} • Distance: {{ req.distanceKm }} km ({{ req.deliveryOption }})
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-[11px] text-[#78716C] font-mono">{{ req.requestDate | date:'mediumDate' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- RECOMMENDED MATERIALS FEED -->
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 class="text-base font-bold text-[#1C1917]">Materials Near Your Procurement Site</h3>
            <p class="text-xs text-[#78716C]">Showing {{ filteredAndSortedListings.length }} verified lots relative to {{ marketplaceService.buyerLocationInfo().name }}</p>
          </div>
          <span class="text-xs font-mono font-semibold text-[#16A34A] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto">
            ⚡ Ranked by Haversine Proximity
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            *ngFor="let item of filteredAndSortedListings"
            class="rb-card p-5 hover:border-[#C5B7A5] transition-all flex flex-col justify-between"
          >
            <div>
              <img [src]="resolveImageUrl(item.imageUrl, item.material)" (error)="onImgError($event, item.material)" [alt]="item.title" class="w-full h-40 object-cover rounded-xl mb-4 border border-[#E5DFD7]" />
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-bold text-[#1C1917] uppercase">{{ item.title }}</span>
                <span [ngClass]="item.condition === 'Reusable' ? 'badge-green' : 'badge-blue'">{{ item.condition }}</span>
              </div>
              <div class="text-xs font-mono text-[#16A34A] font-bold mb-2">
                {{ item.isFree ? 'FREE' : '₹' + item.pricePerKg + '/kg' }} • {{ item.quantityKg }} kg
              </div>
              <p class="text-xs text-[#78716C] line-clamp-2 leading-relaxed mb-4">{{ item.description }}</p>
            </div>

            <div class="pt-3 border-t border-[#E5DFD7] flex items-center justify-between">
              <div class="flex flex-col">
                <span *ngIf="item.distanceKm != null && item.distanceKm <= 15" class="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] font-mono">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
                  {{ item.distanceKm }} km away (LOCAL)
                </span>
                <span *ngIf="item.distanceKm != null && item.distanceKm > 15 && item.distanceKm <= 50" class="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 font-mono">
                  <span class="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                  {{ item.distanceKm }} km away (NEARBY)
                </span>
                <span *ngIf="item.distanceKm != null && item.distanceKm > 50" class="text-[11px] text-[#78716C] font-mono font-medium">
                  {{ item.distanceKm }} km away
                </span>
                <span class="text-[10px] text-[#A8A29E] truncate max-w-[150px]">{{ item.locationName }}</span>
              </div>

              <button (click)="openRequestModal(item)" class="rb-btn-primary text-xs py-1.5 px-3 cursor-pointer">
                Request Material
              </button>
            </div>
          </div>

          <!-- EMPTY STATE WHEN RADIUS HAS NO MATCHES -->
          <div *ngIf="filteredAndSortedListings.length === 0" class="rb-card p-12 text-center space-y-3 col-span-full">
            <div class="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
              📍
            </div>
            <h4 class="text-base font-bold text-[#1C1917]">No Materials Found Within {{ selectedRadiusKm }} km</h4>
            <p class="text-xs text-[#78716C] max-w-md mx-auto">
              There are currently no listed lots within {{ selectedRadiusKm }} km of {{ marketplaceService.buyerLocationInfo().name }}. Expand your radius or choose another procurement hub.
            </p>
            <button (click)="selectedRadiusKm = 5000" class="rb-btn-secondary text-xs px-4 py-2 cursor-pointer mx-auto">
              Expand to Pan-India
            </button>
          </div>
        </div>
      </div>

      <!-- MATERIAL DISPATCH MODAL -->
      <div *ngIf="selectedListing" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div class="w-full max-w-md bg-white border border-[#E5DFD7] rounded-3xl shadow-2xl p-6 space-y-4 text-[#1C1917]">
          <div class="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
            <h3 class="text-lg font-bold text-[#1C1917]">Request Material Lot</h3>
            <button (click)="selectedListing = null" class="text-[#78716C] hover:text-[#1C1917] cursor-pointer">✕</button>
          </div>

          <div class="space-y-3 text-xs">
            <div class="font-bold text-[#1C1917] text-sm">{{ selectedListing.title }}</div>
            <div class="text-[#78716C] font-mono">Seller: {{ selectedListing.sellerCompany }} ({{ selectedListing.locationName }})</div>
            <div class="text-[#16A34A] font-mono font-bold">Haversine Distance: {{ selectedListing.distanceKm }} km</div>

            <div>
              <label class="font-semibold text-[#1C1917] block mb-1">Requested Quantity (kg)</label>
              <input type="number" [(ngModel)]="requestQuantity" class="w-full px-3 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-[#1C1917] font-mono" />
            </div>

            <div>
              <label class="font-semibold text-[#1C1917] block mb-1">Logistics Preference</label>
              <select [(ngModel)]="deliveryOption" class="w-full px-3 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-[#1C1917]">
                <option value="Self Pickup">Self Pickup with Site Truck</option>
                <option value="Shared Logistics">Shared Circular Carrier</option>
                <option value="Direct Delivery">Direct Seller Delivery</option>
              </select>
            </div>

            <div class="pt-4 flex justify-end gap-2">
              <button (click)="selectedListing = null" class="rb-btn-ghost text-xs cursor-pointer">Cancel</button>
              <button (click)="submitRequest()" class="rb-btn-primary text-xs cursor-pointer">Confirm & Dispatch Inquiry</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BuyerComponent implements OnInit {
  selectedListing: MarketplaceListing | null = null;
  requestQuantity: number = 500;
  deliveryOption: 'Self Pickup' | 'Shared Logistics' | 'Direct Delivery' = 'Self Pickup';

  presetHubs = PRESET_BUYER_HUBS;
  selectedHubName: string = '';
  selectedRadiusKm: number = 5000;
  selectedSort: 'nearest' | 'price_asc' | 'price_desc' | 'quantity' = 'nearest';
  searchQuery: string = '';
  selectedCategory: string = 'ALL';

  constructor(
    public marketplaceService: MarketplaceService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.marketplaceService.loadMarketplaceData();
    this.selectedHubName = this.marketplaceService.buyerLocationInfo().name;
  }

  onHubChange(hubName: string) {
    const hub = this.presetHubs.find(h => h.name === hubName);
    if (hub) {
      this.selectedHubName = hub.name;
      this.marketplaceService.setBuyerLocation(hub.coordinates, hub.name, false);
    }
  }

  detectLiveGPS() {
    this.marketplaceService.detectLiveGPS().then(() => {
      this.selectedHubName = this.marketplaceService.buyerLocationInfo().name;
    });
  }

  get filteredAndSortedListings(): MarketplaceListing[] {
    let list = this.marketplaceService.listings().filter(item => {
      // Radius filter
      if (this.selectedRadiusKm < 5000 && item.distanceKm && item.distanceKm > this.selectedRadiusKm) {
        return false;
      }
      // Category filter
      if (this.selectedCategory !== 'ALL' && item.material !== this.selectedCategory) {
        return false;
      }
      // Search query
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchLoc = item.locationName?.toLowerCase().includes(q);
        const matchMat = item.material?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchLoc && !matchMat) return false;
      }
      return true;
    });

    // Sorting
    return list.sort((a, b) => {
      if (this.selectedSort === 'nearest') {
        return (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999);
      } else if (this.selectedSort === 'price_asc') {
        return a.pricePerKg - b.pricePerKg;
      } else if (this.selectedSort === 'price_desc') {
        return b.pricePerKg - a.pricePerKg;
      } else if (this.selectedSort === 'quantity') {
        return b.quantityKg - a.quantityKg;
      }
      return 0;
    });
  }

  get averageDistanceInRadius(): string {
    const list = this.filteredAndSortedListings;
    if (list.length === 0) return '0.0';
    const sum = list.reduce((acc, curr) => acc + (curr.distanceKm || 0), 0);
    return (sum / list.length).toFixed(1);
  }

  get nearestDistanceInRadius(): string {
    const list = this.filteredAndSortedListings;
    if (list.length === 0) return '—';
    const min = Math.min(...list.map(l => l.distanceKm ?? 9999));
    return min === 9999 ? '—' : `${min} km`;
  }

  resolveImageUrl(url?: string, material?: string): string {
    const mat = (material || 'brick').toLowerCase();
    if (!url) return `/assets/materials/${mat}.jpg`;
    if (url.startsWith('/assets/uploads/')) {
      return `http://localhost:8000${url}`;
    }
    return url;
  }

  openRequestModal(listing: MarketplaceListing) {
    this.selectedListing = listing;
    this.requestQuantity = listing.quantityKg;
  }

  onImgError(event: any, material: string) {
    const mat = (material || 'brick').toLowerCase();
    const target = event.target as HTMLImageElement;
    const fallback = `/assets/materials/${mat}.jpg`;
    if (target.src !== fallback && !target.src.endsWith(fallback)) {
      target.src = fallback;
    }
  }

  submitRequest() {
    if (!this.selectedListing) return;
    this.marketplaceService.requestMaterial(this.selectedListing, this.requestQuantity, this.deliveryOption);
    this.selectedListing = null;
  }
}
