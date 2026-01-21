import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApi } from '../api/auth.api';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LoginRequest, RegisterRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
    private api = inject(AuthApi);
    private router = inject(Router);
    private authService = inject(AuthService);

    loading = signal(false);
    errorMessage = signal<string | null>(null);

    isAuthenticated() {
        return this.authService.isAuthenticated();
    }

    getUser() {
        return this.authService.user();
    }

    login(credentials: LoginRequest) {
        this.loading.set(true);
        this.errorMessage.set(null);

        this.api.login(credentials).subscribe({
        next: (response) => {
            this.authService.setAuth(response.access_token, response.user);
            this.router.navigate(['/dashboard']);
        },
        error: (error) => {
            const message = error.error?.message || 'Erro ao fazer login. Verifique suas credenciais.';
            this.errorMessage.set(message);
            this.loading.set(false);
        },
        complete: () => {
            this.loading.set(false);
        }
        });
    }

    register(data: RegisterRequest) {
        this.loading.set(true);
        this.errorMessage.set(null);

        this.api.register(data).subscribe({
        next: (response) => {
            window.location.reload();
        },
        error: (error) => {
            const message = error.error?.message || 'Erro ao criar conta. Tente novamente.';
            this.errorMessage.set(message);
            this.loading.set(false);
        },
        complete: () => {
            this.loading.set(false);
        }
        });
    }

    logout() {
        this.authService.logout();
        this.clearError();
    }

    clearError() {
        this.errorMessage.set(null);
    }
}