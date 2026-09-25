import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarketplaceService } from '../../core/services/marketplace.service';
import { WasteService } from '../../core/services/waste.service';
import { ToastService } from '../../core/services/toast.service';
import { MarketplaceListing, MaterialCategory, MaterialCondition, BuyerRequest, WasteRecord } from '../../core/models/all.models';
import { StatCardComponent } from '../../shared/components/stat-card.component';

@Component({
  selector: 'app-seller',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCardComponent],
  template: `
    <div class="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-[#1C1917]">
      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DBD1]">
        <div>
          <div class="flex items-center gap-2 text-xs font-mono text-[#D97706] font-bold mb-1">
            <span class="w-2 h-2 rounded-full bg-[#D97706] animate-pulse"></span>
            MATERIAL RECOVERY FACILITY & SALVAGE YARD CONSOLE
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight">Seller & Recycler Operations</h1>
          <p class="text-xs sm:text-sm text-[#78716C] mt-0.5">End-to-end circular workflow: Raw Waste Intake → Processing & Grading → B2B Sales → Order Dispatch.</p>
        </div>

        <div class="flex items-center gap-3">
          <button (click)="openCreateModal()" class="rb-btn-primary text-xs shadow cursor-pointer">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Publish Processed Inventory
          </button>
        </div>
      </div>

      <!-- SELLER 4-STEP WORKING PROCESS PIPELINE BAR -->
      <div class="rb-card p-6 border border-[#E5DFD7] bg-white">
        <div class="text-[10px] font-mono text-[#D97706] uppercase font-bold tracking-wider mb-2">
          🔄 RECYCLER OPERATIONAL PROCESS FLOW
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <!-- Step 1 -->
          <div class="p-3.5 rounded-2xl bg-[#F9F7F4] border border-[#E5DFD7] space-y-1.5 relative">
            <div class="flex items-center justify-between">
              <span class="font-mono text-[#16A34A] font-bold text-[10px]">STEP 01</span>
              <span class="w-2 h-2 rounded-full bg-[#16A34A]"></span>
            </div>
            <div class="font-bold text-[#1C1917] text-sm">Raw Intake</div>
            <p class="text-[#78716C] text-[11px] leading-relaxed">Contractors log on-site demolition rubble and dispatch to your yard.</p>
          </div>

          <!-- Step 2 -->
          <div class="p-3.5 rounded-2xl bg-[#F9F7F4] border border-[#E5DFD7] space-y-1.5 relative">
            <div class="flex items-center justify-between">
              <span class="font-mono text-[#2563EB] font-bold text-[10px]">STEP 02</span>
              <span class="w-2 h-2 rounded-full bg-[#2563EB]"></span>
            </div>
            <div class="font-bold text-[#1C1917] text-sm">Processing & Grading</div>
            <p class="text-[#78716C] text-[11px] leading-relaxed">Crush concrete into aggregate, clean bricks, bundle structural steel.</p>
          </div>

          <!-- Step 3 -->
          <div class="p-3.5 rounded-2xl bg-[#F9F7F4] border border-[#E5DFD7] space-y-1.5 relative">
            <div class="flex items-center justify-between">
              <span class="font-mono text-[#D97706] font-bold text-[10px]">STEP 03</span>
              <span class="w-2 h-2 rounded-full bg-[#D97706]"></span>
            </div>
            <div class="font-bold text-[#1C1917] text-sm">Marketplace Listing</div>
            <p class="text-[#78716C] text-[11px] leading-relaxed">Set commercial pricing (₹/kg) and publish to local procurement buyers.</p>
          </div>

          <!-- Step 4 -->
          <div class="p-3.5 rounded-2xl bg-[#F9F7F4] border border-[#E5DFD7] space-y-1.5 relative">
            <div class="flex items-center justify-between">
              <span class="font-mono text-[#7C3AED] font-bold text-[10px]">STEP 04</span>
              <span class="w-2 h-2 rounded-full bg-[#7C3AED]"></span>
            </div>
            <div class="font-bold text-[#1C1917] text-sm">Order Fulfillment</div>
            <p class="text-[#78716C] text-[11px] leading-relaxed">Accept orders, dispatch delivery trucks, and collect digital payouts.</p>
          </div>
        </div>
      </div>

      <!-- SELLER METRICS STRIP -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-stat-card
          label="ACTIVE YARD LISTINGS"
          [value]="marketplaceService.totalActiveListings()"
          unit="lots"
          subtitle="Available for purchase"
          variant="emerald"
        ></app-stat-card>

        <app-stat-card
          label="INCOMING ORDERS"
          [value]="marketplaceService.requests().length"
          unit="requests"
          subtitle="Pending buyer dispatches"
          variant="amber"
        ></app-stat-card>

        <app-stat-card
          label="PROCESSED TONNAGE"
          [value]="wasteService.totalWasteLoggedKg() | number"
          unit="kg"
          subtitle="Total secondary materials"
          variant="blue"
        ></app-stat-card>

        <app-stat-card
          label="RECOVERED REVENUE"
          [value]="'₹' + (marketplaceService.totalValueListed() | number)"
          subtitle="Realized inventory value"
          variant="emerald"
        ></app-stat-card>
      </div>

      <!-- SECTION 1: INCOMING BUYER ORDERS & DISPATCH WORKFLOW -->
      <div class="rb-card p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
          <div>
            <h3 class="text-base font-bold text-[#1C1917]">Live Buyer Order Requests & Dispatch Workflow</h3>
            <p class="text-xs text-[#78716C]">Manage order states: Accept → Dispatch → Complete Transaction.</p>
          </div>
          <span class="px-2.5 py-1 rounded-xl bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] text-xs font-mono font-bold">
            {{ pendingOrdersCount }} Pending Actions
          </span>
        </div>

        <div *ngIf="marketplaceService.requests().length === 0" class="py-8 text-center text-[#78716C] text-xs font-mono">
          No buyer requests pending right now. New requests will appear here in real time.
        </div>

        <div class="divide-y divide-[#E5DFD7]">
          <div *ngFor="let req of marketplaceService.requests()" class="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="space-y-1.5 text-xs">
              <div class="flex items-center gap-2">
                <span class="font-bold text-[#1C1917] text-sm">{{ req.listingTitle }}</span>
                <span [ngClass]="getStatusBadgeClass(req.status)">{{ req.status }}</span>
              </div>
              <div class="text-[#78716C]">
                Procuring Buyer: <span class="font-bold text-[#1C1917]">{{ req.buyerName }}</span> • Company: <span class="text-[#16A34A] font-semibold">{{ req.buyerCompany }}</span>
              </div>
              <div class="text-[#78716C] font-mono text-[11px] flex flex-wrap items-center gap-3">
                <span>Requested: <strong class="text-[#1C1917]">{{ req.quantityRequestedKg }} kg</strong></span>
                <span>Offer Total: <strong class="text-[#16A34A]">₹{{ req.offerPriceTotal | number }}</strong></span>
                <span>Haulage Distance: <strong class="text-[#1C1917]">{{ req.distanceKm }} km</strong></span>
                <span>Delivery: <strong class="text-[#1C1917]">{{ req.deliveryOption }}</strong></span>
              </div>
            </div>

            <!-- ACTION BUTTONS ACCORDING TO WORKING STATUS -->
            <div class="flex items-center gap-2 shrink-0">
              <button
                *ngIf="req.status === 'PENDING'"
                (click)="updateStatus(req.id, 'ACCEPTED')"
                class="rb-btn-primary text-xs py-2 px-3.5 shadow-sm cursor-pointer"
              >
                ✓ Accept Order
              </button>
              <button
                *ngIf="req.status === 'ACCEPTED'"
                (click)="updateStatus(req.id, 'DISPATCHED')"
                class="rb-btn-secondary text-xs py-2 px-3.5 text-sky-600 border-[#E2DDD5] font-bold cursor-pointer"
              >
                🚚 Mark Dispatched
              </button>
              <button
                *ngIf="req.status === 'DISPATCHED'"
                (click)="updateStatus(req.id, 'COMPLETED')"
                class="rb-btn-secondary text-xs py-2 px-3.5 text-[#16A34A] border-[#E2DDD5] font-bold cursor-pointer"
              >
                💰 Complete & Collect Payment
              </button>
              <span *ngIf="req.status === 'COMPLETED'" class="text-xs font-mono text-[#16A34A] font-bold flex items-center gap-1">
                ✓ Order Completed
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 2: RAW WASTE INTAKE FROM CONTRACTORS (CLAIM & PROCESS) -->
      <div class="rb-card p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
          <div>
            <h3 class="text-base font-bold text-[#1C1917]">Contractor Site Demolition Feeds (Intake Pipeline)</h3>
            <p class="text-xs text-[#78716C]">Raw materials logged on jobsites available to receive and process at your salvage yard.</p>
          </div>
          <span class="text-xs font-mono text-[#16A34A] font-bold">Live Intake Queue</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-[#E5DFD7] text-[#78716C] font-mono uppercase text-[10px]">
                <th class="pb-3 font-semibold">Material</th>
                <th class="pb-3 font-semibold">Origin Site</th>
                <th class="pb-3 font-semibold">Raw Quantity</th>
                <th class="pb-3 font-semibold">Condition</th>
                <th class="pb-3 font-semibold">Logged By</th>
                <th class="pb-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E5DFD7]">
              <tr *ngFor="let waste of wasteService.records()" class="hover:bg-[#F9F7F4]">
                <td class="py-3 font-bold text-[#1C1917] flex items-center gap-2.5">
                  <img [src]="waste.imageUrl" (error)="onImgError($event, waste.material)" class="w-8 h-8 rounded-xl object-cover border border-[#E5DFD7]" />
                  <span>{{ waste.material }}</span>
                </td>
                <td class="py-3 text-[#1C1917]">{{ waste.projectName }}</td>
                <td class="py-3 font-mono font-bold text-[#1C1917]">{{ waste.quantityKg | number }} kg</td>
                <td class="py-3">
                  <span class="badge-green">{{ waste.condition }}</span>
                </td>
                <td class="py-3 font-mono text-[#78716C]">{{ waste.loggedBy }}</td>
                <td class="py-3">
                  <button
                    (click)="processContractorIntake(waste)"
                    class="px-2.5 py-1 rounded-xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#B45309] border border-[#FDE68A] text-[11px] font-bold cursor-pointer transition-colors"
                  >
                    ⚡ Process for Inventory
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- SECTION 3: PUBLISHED YARD INVENTORY -->
      <div class="rb-card p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
          <div>
            <h3 class="text-base font-bold text-[#1C1917]">Your Published Material Inventory Catalog</h3>
            <p class="text-xs text-[#78716C]">Processed secondary materials available on the circular B2B marketplace.</p>
          </div>
          <span class="text-xs font-mono text-[#78716C]">{{ marketplaceService.listings().length }} Total Lots</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-[#E5DFD7] text-[#78716C] font-mono uppercase text-[10px]">
                <th class="pb-3 font-semibold">Material</th>
                <th class="pb-3 font-semibold">Available Stock</th>
                <th class="pb-3 font-semibold">Grading</th>
                <th class="pb-3 font-semibold">Selling Price</th>
                <th class="pb-3 font-semibold">Views</th>
                <th class="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E5DFD7]">
              <tr *ngFor="let item of marketplaceService.listings()" class="hover:bg-[#F9F7F4]">
                <td class="py-3 font-semibold text-[#1C1917] flex items-center gap-2.5">
                  <img [src]="item.imageUrl" (error)="onImgError($event, item.material)" class="w-8 h-8 rounded-xl object-cover border border-[#E5DFD7]" />
                  <span>{{ item.title }}</span>
                </td>
                <td class="py-3 font-mono font-bold text-[#1C1917]">{{ item.quantityKg | number }} kg</td>
                <td class="py-3">
                  <span class="badge-green">{{ item.condition }}</span>
                </td>
                <td class="py-3 font-mono text-[#16A34A] font-bold">
                  {{ item.isFree ? 'FREE' : '₹' + item.pricePerKg + '/kg' }}
                </td>
                <td class="py-3 font-mono text-[#78716C]">{{ item.viewsCount }}</td>
                <td class="py-3">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF7EE] text-[#1E7E34] border border-[#DCFCE7]">
                    {{ item.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- PUBLISH INVENTORY MODAL -->
      <div *ngIf="isCreateModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div class="w-full max-w-lg bg-white border border-[#E5DFD7] rounded-3xl p-6 shadow-2xl space-y-4 text-[#1C1917]">
          <div class="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
            <h3 class="text-base font-bold text-[#1C1917]">Publish Processed Material to Marketplace</h3>
            <button (click)="isCreateModalOpen = false" class="text-[#78716C] hover:text-[#1C1917]">✕</button>
          </div>

          <form (submit)="createListingSubmit($event)" class="space-y-3 text-xs">
            <div>
              <label class="font-bold text-[#1C1917] block mb-1">Listing Title</label>
              <input type="text" [(ngModel)]="newTitle" name="title" required placeholder="e.g. Sieved 20mm Crushed Concrete Aggregate" class="w-full px-3 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-[#1C1917]" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="font-bold text-[#1C1917] block mb-1">Material Category</label>
                <select [(ngModel)]="newMaterial" name="mat" class="w-full px-3 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-[#1C1917]">
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
              </div>

              <div>
                <label class="font-bold text-[#1C1917] block mb-1">Condition / Grading</label>
                <select [(ngModel)]="newCondition" name="cond" class="w-full px-3 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-[#1C1917]">
                  <option value="Reusable">Reusable (Commercial Grade)</option>
                  <option value="Recyclable">Recyclable (Secondary Crush)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="font-bold text-[#1C1917] block mb-1">Stock Quantity (kg)</label>
                <input type="number" [(ngModel)]="newQuantity" name="qty" required class="w-full px-3 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-[#1C1917] font-mono" />
              </div>

              <div>
                <label class="font-bold text-[#1C1917] block mb-1">Price per kg (₹0 for Free)</label>
                <input type="number" [(ngModel)]="newPrice" name="price" required class="w-full px-3 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-[#1C1917] font-mono" />
              </div>
            </div>

            <div>
              <label class="font-bold text-[#1C1917] block mb-1">Yard Location</label>
              <input type="text" [(ngModel)]="newLocation" name="loc" required placeholder="e.g. GreenReclaim Yard 1, Whitefield" class="w-full px-3 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-[#1C1917]" />
            </div>

            <div>
              <label class="font-bold text-[#1C1917] block mb-1">Grading & Quality Notes</label>
              <textarea [(ngModel)]="newDescription" name="desc" rows="3" placeholder="Sieved, cleaned, bundled, or certified specifications..." class="w-full px-3 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-[#1C1917]"></textarea>
            </div>

            <div class="pt-4 flex justify-end gap-2">
              <button type="button" (click)="isCreateModalOpen = false" class="rb-btn-ghost text-xs cursor-pointer">Cancel</button>
              <button type="submit" class="rb-btn-primary text-xs cursor-pointer">Publish to Marketplace</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class SellerComponent implements OnInit {
  isCreateModalOpen: boolean = false;

  newTitle: string = '';
  newMaterial: MaterialCategory = 'Concrete';
  newCondition: MaterialCondition = 'Reusable';
  newQuantity: number = 2500;
  newPrice: number = 3.5;
  newLocation: string = 'GreenReclaim Salvage Yard, Whitefield, Bangalore';
  newDescription: string = 'Sieved 20mm crushed concrete aggregate. Cleaned and ready for road sub-base.';

  constructor(
    public marketplaceService: MarketplaceService,
    public wasteService: WasteService,
    private toast: ToastService
  ) {}

  ngOnInit() {}

  get pendingOrdersCount(): number {
    return this.marketplaceService.requests().filter(r => r.status === 'PENDING' || r.status === 'ACCEPTED').length;
  }

  getStatusBadgeClass(status: string): string {
    if (status === 'PENDING') return 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20';
    if (status === 'ACCEPTED') return 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20';
    if (status === 'DISPATCHED') return 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20';
    return 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  }

  updateStatus(requestId: string, status: any) {
    this.marketplaceService.updateRequestStatus(requestId, status);
    if (status === 'ACCEPTED') {
      this.toast.success('Order Accepted', 'Buyer notified. Material prepared for dispatch.');
    } else if (status === 'DISPATCHED') {
      this.toast.info('Dispatch Logged', 'Haulage vehicle marked in transit.');
    } else if (status === 'COMPLETED') {
      this.toast.success('Transaction Completed', 'Secondary material delivered & revenue collected.');
    }
  }

  openCreateModal() {
    this.newTitle = 'Sieved 20mm Crushed Concrete Aggregate';
    this.newMaterial = 'Concrete';
    this.newQuantity = 2500;
    this.newPrice = 3.5;
    this.newDescription = 'Sieved 20mm crushed aggregate from site intake. Certified sub-base grade.';
    this.isCreateModalOpen = true;
  }

  processContractorIntake(waste: WasteRecord) {
    this.newMaterial = waste.material;
    this.newQuantity = waste.quantityKg;
    this.newTitle = `Processed ${waste.material} (From ${waste.projectName})`;
    this.newPrice = waste.material === 'Metal' ? 34 : (waste.material === 'Brick' ? 8 : 3.5);
    this.newDescription = `Cleaned and graded ${waste.material} recovered from ${waste.projectName}. Certified reusable quality.`;
    this.isCreateModalOpen = true;
    this.toast.info('Intake Loaded', `Pre-filled ${waste.quantityKg} kg of ${waste.material} for processing.`);
  }

  onImgError(event: any, material: string) {
    const mat = (material || 'brick').toLowerCase();
    event.target.src = `/assets/materials/${mat}.jpg`;
  }

  createListingSubmit(event: Event) {
    event.preventDefault();
    this.marketplaceService.createListing({
      title: this.newTitle,
      material: this.newMaterial,
      quantityKg: this.newQuantity,
      condition: this.newCondition,
      pricePerKg: this.newPrice,
      isFree: this.newPrice === 0,
      sellerId: 'usr-rajesh-seller',
      sellerName: 'Rajesh Kumar',
      sellerCompany: 'GreenReclaim Material Yard',
      sellerPhone: '+91 98451 98765',
      sellerEmail: 'rajesh@greenreclaim.in',
      locationName: this.newLocation,
      coordinates: [12.9698, 77.7499],
      imageUrl: `/assets/materials/${this.newMaterial.toLowerCase()}.jpg`,
      description: this.newDescription,
      status: 'AVAILABLE'
    });

    this.isCreateModalOpen = false;
    this.toast.success('Listing Published', `${this.newTitle} is now live on the B2B Circular Marketplace.`);
    this.newTitle = '';
  }
}
