import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MarketplaceService } from '../../core/services/marketplace.service';
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

        <a routerLink="/marketplace" class="rb-btn-primary text-xs shadow">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Open Geospatial Map
        </a>
      </div>

      <!-- BUYER KPIS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-stat-card
          label="AVAILABLE IN RADIUS"
          [value]="marketplaceService.listings().length"
          unit="lots"
          subtitle="Within 20 km zone"
          variant="sky"
        ></app-stat-card>

        <app-stat-card
          label="ACTIVE PROCUREMENT ORDERS"
          [value]="marketplaceService.requests().length"
          unit="orders"
          subtitle="In transit / processing"
          variant="emerald"
        ></app-stat-card>

        <app-stat-card
          label="AVERAGE RADIUS"
          value="8.4"
          unit="km"
          subtitle="Haversine transit distance"
          variant="amber"
        ></app-stat-card>

        <app-stat-card
          label="COST SAVINGS"
          value="45"
          unit="%"
          subtitle="Vs virgin raw materials"
          trend="Calculated"
          [trendPositive]="true"
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
        <h3 class="text-base font-bold text-[#1C1917]">Recommended Materials for Pavers & Secondary Infrastructure</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            *ngFor="let item of marketplaceService.listings()"
            class="rb-card p-5 hover:border-[#C5B7A5] transition-all flex flex-col justify-between"
          >
            <div>
              <img [src]="item.imageUrl" (error)="onImgError($event, item.material)" [alt]="item.title" class="w-full h-40 object-cover rounded-xl mb-4 border border-[#E5DFD7]" />
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
              <span class="text-xs text-[#78716C] font-mono font-medium">{{ item.distanceKm }} km away</span>
              <button (click)="openRequestModal(item)" class="rb-btn-primary text-xs py-1.5 px-3 cursor-pointer">
                Request Material
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- MATERIAL DISPATCH MODAL -->
      <div *ngIf="selectedListing" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div class="w-full max-w-md bg-white border border-[#E5DFD7] rounded-3xl shadow-2xl p-6 space-y-4 text-[#1C1917]">
          <div class="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
            <h3 class="text-lg font-bold text-[#1C1917]">Request Material Lot</h3>
            <button (click)="selectedListing = null" class="text-[#78716C] hover:text-[#1C1917]">✕</button>
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
              <button (click)="selectedListing = null" class="rb-btn-ghost text-xs">Cancel</button>
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

  constructor(
    public marketplaceService: MarketplaceService,
    private toast: ToastService
  ) {}

  ngOnInit() {}

  openRequestModal(listing: MarketplaceListing) {
    this.selectedListing = listing;
    this.requestQuantity = listing.quantityKg;
  }

  onImgError(event: any, material: string) {
    const mat = (material || 'concrete').toLowerCase();
    event.target.src = `/assets/materials/${mat}.jpg`;
  }

  submitRequest() {
    if (!this.selectedListing) return;
    this.marketplaceService.requestMaterial(this.selectedListing, this.requestQuantity, this.deliveryOption);
    this.selectedListing = null;
  }
}
