import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User, UserRole } from '../models/all.models';
import { ToastService } from './toast.service';

const API_BASE = 'http://localhost:8000/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly currentRole = computed(() => this.currentUserSignal()?.role || 'contractor');

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastService
  ) {
    const saved = localStorage.getItem('rebuild_user');
    const token = localStorage.getItem('rebuild_token');
    if (saved && token) {
      try {
        this.currentUserSignal.set(JSON.parse(saved));
      } catch (e) {
        this.currentUserSignal.set(null);
      }
    } else {
      // Default to null if no valid token exists, or provide initial session
      this.currentUserSignal.set(null);
    }
  }

  // Secure Server-Verified Login: Sends credentials, server verifies Bcrypt hash & reads database role
  login(email: string, password: string = 'password123') {
    this.http.post<{ token: string; user: User }>(`${API_BASE}/auth/login`, {
      email: email.trim(),
      password
    }).subscribe({
      next: (res) => {
        this.currentUserSignal.set(res.user);
        localStorage.setItem('rebuild_user', JSON.stringify(res.user));
        localStorage.setItem('rebuild_token', res.token);
        this.toast.success(
          'Authenticated',
          `Verified as ${res.user.name} (${res.user.role.toUpperCase()})`
        );
        this.redirectRole(res.user.role);
      },
      error: (err) => {
        const message = err?.error?.error || 'Invalid email or password.';
        this.toast.error('Authentication Denied', message);
      }
    });
  }

  // Secure Registration: Password hashed on server with Bcrypt (12 rounds)
  register(userData: Partial<User>, role: UserRole, password: string = 'password123') {
    if (role === 'admin') {
      this.toast.error('Security Restricted', 'Admin accounts cannot be registered publicly.');
      return;
    }

    this.http.post<{ token: string; user: User }>(`${API_BASE}/auth/register`, {
      name: userData.name,
      email: userData.email?.trim(),
      password,
      role,
      companyName: userData.companyName,
      location: userData.location,
      phone: userData.phone
    }).subscribe({
      next: (res) => {
        this.currentUserSignal.set(res.user);
        localStorage.setItem('rebuild_user', JSON.stringify(res.user));
        localStorage.setItem('rebuild_token', res.token);
        this.toast.success('Account Created', `Welcome to ReBuild, ${res.user.name}`);
        this.redirectRole(res.user.role);
      },
      error: (err) => {
        const message = err?.error?.error || 'Registration failed.';
        this.toast.error('Registration Error', message);
      }
    });
  }

  logout() {
    this.currentUserSignal.set(null);
    localStorage.removeItem('rebuild_user');
    localStorage.removeItem('rebuild_token');
    this.toast.info('Signed Out', 'Session terminated safely.');
    this.router.navigate(['/auth/login'], { replaceUrl: true });
  }

  private redirectRole(role: UserRole) {
    if (role === 'contractor') this.router.navigate(['/dashboard']);
    else if (role === 'buyer') this.router.navigate(['/buyer']);
    else if (role === 'admin') this.router.navigate(['/admin']);
  }
}
