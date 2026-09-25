import { Routes } from '@angular/router';
import { authGuard, adminRoleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'landing'
  },
  {
    path: 'landing',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'projects',
    canActivate: [authGuard],
    loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'waste',
    canActivate: [authGuard],
    loadComponent: () => import('./features/waste/waste.component').then(m => m.WasteComponent)
  },
  {
    path: 'marketplace',
    canActivate: [authGuard],
    loadComponent: () => import('./features/marketplace/marketplace.component').then(m => m.MarketplaceComponent)
  },
  {
    path: 'seller',
    canActivate: [authGuard],
    loadComponent: () => import('./features/seller/seller.component').then(m => m.SellerComponent)
  },
  {
    path: 'buyer',
    canActivate: [authGuard],
    loadComponent: () => import('./features/buyer/buyer.component').then(m => m.BuyerComponent)
  },
  {
    path: 'machines',
    canActivate: [authGuard],
    loadComponent: () => import('./features/machines/machines.component').then(m => m.MachinesComponent)
  },
  {
    path: 'labour',
    canActivate: [authGuard],
    loadComponent: () => import('./features/labour/labour.component').then(m => m.LabourComponent)
  },
  {
    path: 'impact',
    canActivate: [authGuard],
    loadComponent: () => import('./features/impact/impact.component').then(m => m.ImpactComponent)
  },
  {
    path: 'ai-analytics',
    canActivate: [authGuard],
    loadComponent: () => import('./features/ai-analytics/ai-analytics.component').then(m => m.AiAnalyticsComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminRoleGuard],
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: '**',
    redirectTo: 'landing'
  }
];
