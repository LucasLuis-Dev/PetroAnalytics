import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../../shared/models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private http = inject(HttpService);

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/auth/login', credentials);
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/auth/register', data);
  }
}