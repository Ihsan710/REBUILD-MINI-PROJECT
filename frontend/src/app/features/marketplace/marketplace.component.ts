import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { MarketplaceService, calculateHaversineDistanceKm } from '../../core/services/marketplace.service';
import { ToastService } from '../../core/services/toast.service';
import { MarketplaceListing, MaterialCategory, MaterialCondition } from '../../core/models/all.models';
import { BadgeComponent } from '../../shared/components/badge.component';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-[#1C1917]">
      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DBD1]">
        <div>
          <div class="flex items-center gap-2 text-xs font-mono text-[#16A34A] font-bold mb-1">
            <span class="w-2 h-2 rounded-full bg-[#16A34A]"></span>
            B2B CIRCULAR RESOURCE EXCHANGE
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight">Give materials their next life.</h1>
          <p class="text-xs sm:text-sm text-[#78716C] mt-0.5">High-volume secondary aggregates, structural steel, reclaimed brick & timber.</p>
        </div>

        <!-- LIST / MAP VIEW TOGGLE -->
        <div class="flex items-center p-1.5 rounded-2xl bg-[#F6F3EF] border border-[#E2DDD5]">
          <button
            (click)="setViewMode('list')"
            [ngClass]="viewMode === 'list' ? 'bg-white text-[#1C1917] shadow-sm font-bold' : 'text-[#78716C] hover:text-[#1C1917]'"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            List View
          </button>
          <button
            (click)="setViewMode('map')"
            [ngClass]="viewMode === 'map' ? 'bg-white text-[#1C1917] shadow-sm font-bold' : 'text-[#78716C] hover:text-[#1C1917]'"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Interactive Map
          </button>
        </div>
      </div>

      <!-- SEARCH & MULTI-FILTER STRIP -->
      <div class="rb-card p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <!-- Search Input -->
        <div class="flex-1 relative">
          <svg class="w-4 h-4 text-[#78716C] absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="What material are you looking for? (e.g. Bricks, Rebar, Concrete...)"
            class="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#C5B7A5]"
          />
        </div>

        <!-- Material Category Filter -->
        <select
          [(ngModel)]="selectedCategory"
          class="px-3 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs text-[#1C1917]"
        >
          <option value="ALL">All 12 Materials</option>
          <option value="Brick">🧱 Brick & Terracotta</option>
          <option value="Concrete">🪨 Concrete & Rubble</option>
          <option value="Metal">🔩 Metal, Rebar & Pipes</option>
          <option value="Wood">🪵 Wood & Timber</option>
          <option value="Drywall">📦 Gypsum Drywall</option>
          <option value="Ceramic">🏺 Ceramic & Vitrified</option>
          <option value="Asphalt">🛣️ Asphalt Pavement</option>
          <option value="Glass">🪟 Architectural Glass</option>
          <option value="Plastic">🚰 PVC & HDPE Plastic</option>
          <option value="Cabling">⚡ Electrical Cabling</option>
          <option value="Roofing">🛡️ Metal Roofing</option>
          <option value="Stone">🏛️ Natural Stone & Granite</option>
        </select>

        <!-- Condition Filter -->
        <select
          [(ngModel)]="selectedCondition"
          class="px-3 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs text-[#1C1917]"
        >
          <option value="ALL">All Conditions</option>
          <option value="Reusable">Reusable</option>
          <option value="Recyclable">Recyclable</option>
        </select>

        <!-- Max Distance Radius (Haversine Filter) -->
        <select
          [(ngModel)]="maxDistanceKm"
          class="px-3 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs text-[#1C1917] font-mono"
        >
          <option [value]="50">Radius: Within 50 km</option>
          <option [value]="20">Radius: Within 20 km</option>
          <option [value]="10">Radius: Within 10 km</option>
          <option [value]="5">Radius: Within 5 km</option>
        </select>
      </div>

      <!-- MAP VIEW CONTAINER -->
      <div [ngClass]="{ 'hidden': viewMode !== 'map' }" class="rb-card p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-xs font-mono font-bold text-[#16A34A]">HAVERSINE GEOSPATIAL RADIAL ROUTING</span>
            <span class="text-xs text-[#78716C]">• Distance calculated mathematically via backend Haversine algorithm</span>
          </div>
          <div class="flex items-center gap-3 text-xs font-mono">
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Buyer (You)</span>
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-[#16A34A]"></span> Verified Seller Yard</span>
          </div>
        </div>

        <div #mapContainer class="w-full h-[500px] rounded-2xl overflow-hidden border border-[#E5DFD7]"></div>
      </div>

      <!-- LISTING CARDS GRID -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          *ngFor="let listing of filteredListings"
          (click)="openMaterialDetail(listing)"
          class="rb-card p-5 cursor-pointer hover:border-[#C5B7A5] transition-all duration-200 group flex flex-col justify-between"
        >
          <div>
            <!-- Image & Badges -->
            <div class="relative h-44 rounded-xl overflow-hidden mb-4 border border-[#E5DFD7] bg-black">
              <img [src]="listing.imageUrl" (error)="onImgError($event, listing.material)" [alt]="listing.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div class="absolute top-2.5 left-2.5">
                <span [ngClass]="listing.condition === 'Reusable' ? 'badge-green' : 'badge-blue'">
                  {{ listing.condition }}
                </span>
              </div>
              <div class="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold text-white border border-white/20">
                {{ listing.isFree ? 'FREE' : '₹' + listing.pricePerKg + '/kg' }}
              </div>
            </div>

            <!-- Material Title & Quantity -->
            <div class="flex items-start justify-between gap-2 mb-1">
              <h3 class="text-base font-bold text-[#1C1917] group-hover:text-[#D4A373] transition-colors uppercase tracking-tight">
                {{ listing.title }}
              </h3>
            </div>
            <div class="text-xs font-mono text-[#78716C] font-semibold mb-3">
              {{ listing.quantityKg | number }} kg available
            </div>
            <p class="text-xs text-[#78716C] line-clamp-2 leading-relaxed mb-4">
              {{ listing.description }}
            </p>
          </div>

          <!-- Bottom Footer: Seller & Haversine Distance -->
          <div class="pt-3 border-t border-[#E5DFD7] flex items-center justify-between text-xs">
            <div class="flex flex-col">
              <span class="text-[#1C1917] font-semibold">{{ listing.sellerCompany }}</span>
              <span class="text-[10px] text-[#78716C]">{{ listing.locationName }}</span>
            </div>

            <div class="text-right">
              <span class="text-[#16A34A] font-mono font-bold">{{ listing.distanceKm }} km away</span>
              <div class="text-[10px] text-[#78716C] font-mono">Haversine route</div>
            </div>
          </div>
        </div>
      </div>

      <!-- MATERIAL DETAIL MODAL -->
      <div *ngIf="selectedMaterial" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" (click)="selectedMaterial = null">
        <div class="w-full max-w-2xl bg-white border border-[#E5DFD7] rounded-3xl shadow-2xl overflow-hidden text-[#1C1917]" (click)="$event.stopPropagation()">
          <div class="p-6 border-b border-[#E5DFD7] flex items-start justify-between bg-[#F9F7F4]">
            <div>
              <div class="flex items-center gap-2">
                <span class="badge-green">{{ selectedMaterial.condition }}</span>
                <span class="text-xs font-mono text-[#78716C]">{{ selectedMaterial.material }} Category</span>
              </div>
              <h2 class="text-xl font-bold text-[#1C1917] mt-1 uppercase">{{ selectedMaterial.title }}</h2>
              <p class="text-xs text-[#78716C]">Seller: {{ selectedMaterial.sellerName }} ({{ selectedMaterial.sellerCompany }})</p>
            </div>
            <button (click)="selectedMaterial = null" class="p-2 text-[#78716C] hover:text-[#1C1917] rounded-lg">✕</button>
          </div>

          <div class="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            <div class="h-56 rounded-2xl overflow-hidden border border-[#E5DFD7]">
              <img [src]="selectedMaterial.imageUrl" (error)="onImgError($event, selectedMaterial.material)" class="w-full h-full object-cover" />
            </div>

            <div class="grid grid-cols-3 gap-3 text-center text-xs font-mono">
              <div class="p-3 rounded-xl bg-[#F9F7F4] border border-[#E5DFD7]">
                <div class="text-[#78716C] text-[10px]">TOTAL QUANTITY</div>
                <div class="text-base font-bold text-[#1C1917] mt-0.5">{{ selectedMaterial.quantityKg | number }} kg</div>
              </div>
              <div class="p-3 rounded-xl bg-[#F9F7F4] border border-[#E5DFD7]">
                <div class="text-[#78716C] text-[10px]">UNIT PRICE</div>
                <div class="text-base font-bold text-[#16A34A] mt-0.5">{{ selectedMaterial.isFree ? 'FREE' : '₹' + selectedMaterial.pricePerKg + '/kg' }}</div>
              </div>
              <div class="p-3 rounded-xl bg-[#F9F7F4] border border-[#E5DFD7]">
                <div class="text-[#78716C] text-[10px]">HAVERSINE DISTANCE</div>
                <div class="text-base font-bold text-[#D97706] mt-0.5">{{ selectedMaterial.distanceKm }} km</div>
              </div>
            </div>

            <div>
              <h4 class="text-xs font-bold text-[#1C1917] mb-1">Description & Quality Assessment</h4>
              <p class="text-xs text-[#78716C] leading-relaxed">{{ selectedMaterial.description }}</p>
            </div>

            <div class="p-4 rounded-2xl bg-[#EBF7EE] border border-[#DCFCE7] text-xs flex items-center justify-between">
              <div>
                <div class="font-bold text-[#1E7E34]">Estimated Total Order Value</div>
                <div class="text-[11px] text-[#78716C]">Calculated for full lot procurement</div>
              </div>
              <div class="text-xl font-mono font-bold text-[#1E7E34]">
                ₹{{ (selectedMaterial.quantityKg * selectedMaterial.pricePerKg) | number }}
              </div>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <button (click)="requestMaterialSubmit('Self Pickup')" class="flex-1 rb-btn-secondary text-xs py-2.5">
                Dispatch Self-Pickup
              </button>
              <button (click)="requestMaterialSubmit('Shared Logistics')" class="flex-1 rb-btn-primary text-xs py-2.5 shadow cursor-pointer">
                Request Material Dispatch
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MarketplaceComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  viewMode: 'list' | 'map' = 'list';
  searchQuery: string = '';
  selectedCategory: string = 'ALL';
  selectedCondition: string = 'ALL';
  maxDistanceKm: number = 50;
  selectedMaterial: MarketplaceListing | null = null;

  map: L.Map | null = null;
  markers: L.Marker[] = [];
  polyline: L.Polyline | null = null;

  constructor(
    public marketplaceService: MarketplaceService,
    private toast: ToastService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.viewMode === 'map') {
      this.initLeafletMap();
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  get filteredListings(): MarketplaceListing[] {
    return this.marketplaceService.listings().filter(l => {
      if (this.selectedCategory !== 'ALL' && l.material !== this.selectedCategory) return false;
      if (this.selectedCondition !== 'ALL' && l.condition !== this.selectedCondition) return false;
      if (l.distanceKm && l.distanceKm > this.maxDistanceKm) return false;
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        return l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.material.toLowerCase().includes(q);
      }
      return true;
    });
  }

  setViewMode(mode: 'list' | 'map') {
    this.viewMode = mode;
    if (mode === 'map') {
      setTimeout(() => {
        if (!this.map) {
          this.initLeafletMap();
        } else {
          this.map.invalidateSize();
        }
      }, 100);
    }
  }

  private initLeafletMap() {
    if (!this.mapContainer) return;

    const buyerCoords = this.marketplaceService.buyerLocation;

    this.map = L.map(this.mapContainer.nativeElement).setView(buyerCoords, 12);

    // Dark Mapbox/CartoDB Carto dark tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);

    // Buyer Pin (Amber)
    const buyerIcon = L.divIcon({
      className: 'custom-buyer-icon',
      html: `<div style="background-color:#F59E0B; width:16px; height:16px; border-radius:50%; border:3px solid #FFFFFF; box-shadow:0 0 10px #F59E0B;"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    const buyerMarker = L.marker(buyerCoords, { icon: buyerIcon }).addTo(this.map);
    buyerMarker.bindPopup(`<b>Your Pickup Location (Buyer)</b><br>Koramangala Hub`).openPopup();

    // Seller Pins (Emerald) & Haversine Connection Lines
    this.marketplaceService.listings().forEach(listing => {
      const sellerIcon = L.divIcon({
        className: 'custom-seller-icon',
        html: `<div style="background-color:#10B981; width:14px; height:14px; border-radius:50%; border:2px solid #FFFFFF; box-shadow:0 0 8px #10B981;"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const marker = L.marker(listing.coordinates, { icon: sellerIcon }).addTo(this.map!);
      marker.bindPopup(`
        <div style="font-size:12px; font-family:sans-serif;">
          <b style="color:#10B981;">${listing.title}</b><br/>
          <span>${listing.quantityKg} kg • ${listing.isFree ? 'FREE' : '₹' + listing.pricePerKg + '/kg'}</span><br/>
          <span style="color:#F59E0B; font-weight:bold;">${listing.distanceKm} km away</span> (Haversine)<br/>
          <small>${listing.sellerCompany}</small>
        </div>
      `);

      marker.on('click', () => {
        this.drawHaversineLine(buyerCoords, listing.coordinates);
      });

      this.markers.push(marker);
    });

    // Default connection line to nearest seller
    const firstListing = this.marketplaceService.listings()[0];
    if (firstListing) {
      this.drawHaversineLine(buyerCoords, firstListing.coordinates);
    }
  }

  private drawHaversineLine(from: [number, number], to: [number, number]) {
    if (!this.map) return;
    if (this.polyline) {
      this.polyline.remove();
    }

    const dist = calculateHaversineDistanceKm(from[0], from[1], to[0], to[1]);

    this.polyline = L.polyline([from, to], {
      color: '#10B981',
      weight: 2,
      dashArray: '6, 6',
      opacity: 0.8
    }).addTo(this.map);

    this.toast.info('Haversine Route Selected', `Distance: ${dist} km to site.`);
  }

  openMaterialDetail(listing: MarketplaceListing) {
    this.selectedMaterial = listing;
  }

  onImgError(event: any, material: string) {
    const mat = (material || 'concrete').toLowerCase();
    event.target.src = `/assets/materials/${mat}.jpg`;
  }

  requestMaterialSubmit(delivery: 'Self Pickup' | 'Shared Logistics') {
    if (!this.selectedMaterial) return;
    this.marketplaceService.requestMaterial(this.selectedMaterial, this.selectedMaterial.quantityKg, delivery);
    this.selectedMaterial = null;
  }
}
