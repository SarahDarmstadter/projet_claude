import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, lastValueFrom, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // JWT stocké en mémoire uniquement (pas localStorage — protection XSS)
  private accessToken: string | null = null;
  private authenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  get isAuthenticated$(): Observable<boolean> {
    return this.authenticated$.asObservable();
  }

  get isAuthenticated(): boolean {
    return this.authenticated$.value;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  login(email: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/login`, { email, password });
  }

  verifyTwoFactor(email: string, code: string): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      `${this.apiUrl}/verify-2fa`,
      { email, code },
      { withCredentials: true }
    ).pipe(
      tap(res => {
        this.accessToken = res.accessToken;
        this.authenticated$.next(true);
      })
    );
  }

  refreshToken(): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      `${this.apiUrl}/refresh`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(res => {
        this.accessToken = res.accessToken;
        this.authenticated$.next(true);
      })
    );
  }

  // Appelé au démarrage de l'app pour restaurer la session depuis le cookie refresh
  init(): Promise<void> {
    return lastValueFrom(
      this.refreshToken().pipe(catchError(() => of(null)))
    ).then(() => {});
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.accessToken = null;
        this.authenticated$.next(false);
        this.router.navigate(['/login']);
      })
    );
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, { token, newPassword });
  }
}
