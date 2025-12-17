import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';
  private tokenKey = 'accessToken';
  private adminKey = 'isAdmin';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((res) => {
        if (res.accessToken) {
          localStorage.setItem(this.tokenKey, res.accessToken);
          localStorage.setItem(this.adminKey, res.isAdmin ? 'true' : 'false');
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.adminKey);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isAdmin(): boolean {
    return localStorage.getItem(this.adminKey) === 'true';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
