import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    const publicUrls = ['/auth/login', '/auth/register', '/public'];
  
    const isInternalUrl = req.url.startsWith(environment.apiUrl) || req.url.startsWith('/');
  
    const isPublicUrl = publicUrls.some(url => req.url.includes(url));

    if (!isInternalUrl || isPublicUrl) {
        return next(req);
    }

    if (token) {
        const clonedRequest = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
        });
        return next(clonedRequest);
    }

    return next(req);
};