import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './shared/components/navbar.component';
import { SidebarComponent } from './shared/components/sidebar.component';
import { ToastContainerComponent } from './shared/components/toast-container.component';
import { SearchPaletteComponent } from './shared/components/search-palette.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    ToastContainerComponent,
    SearchPaletteComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  isSidebarOpen: boolean = false;
  isSidebarPinned: boolean = false;
  isSidebarExpanded: boolean = true;
  isMobileSidebarOpen: boolean = false;
  isSearchPaletteOpen: boolean = false;
  isPublicRoute: boolean = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.isPublicRoute = url.startsWith('/landing') || url.startsWith('/auth') || url === '/';
      // Automatically close slide-out pop-up menu on route navigation if not pinned
      if (!this.isSidebarPinned) {
        this.isSidebarOpen = false;
        this.isMobileSidebarOpen = false;
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.isMobileSidebarOpen = this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
    this.isMobileSidebarOpen = false;
  }

  toggleSidebarPinned() {
    this.isSidebarPinned = !this.isSidebarPinned;
    if (this.isSidebarPinned) {
      this.isSidebarOpen = true;
    }
  }

  toggleSidebarExpanded() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  closeMobileSidebar() {
    this.closeSidebar();
  }

  openSearchPalette() {
    this.isSearchPaletteOpen = true;
  }

  closeSearchPalette() {
    this.isSearchPaletteOpen = false;
  }
}
