import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  isAuthenticated = signal(false);
  user = signal<{ id: number; full_name: string; email: string } | null>(null);

  constructor() {
    this.checkAuth();
  }

  private checkAuth() {
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr && userStr !== 'undefined' && userStr !== 'null') {
      try {
        this.isAuthenticated.set(true);
        this.user.set(JSON.parse(userStr));
      } catch (error) {
        console.error('Erro ao fazer parse do usuário:', error);
        this.clearAuth();
      }
    }
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  setAuth(token: string, user: { id: number; full_name: string; email: string }) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.isAuthenticated.set(true);
    this.user.set(user);
  }

  clearAuth() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.isAuthenticated.set(false);
    this.user.set(null);
  }

  logout() {
    this.clearAuth();
    this.router.navigate(['/auth']);
  }
}