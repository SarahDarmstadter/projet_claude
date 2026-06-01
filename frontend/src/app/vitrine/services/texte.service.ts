import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export type TexteMap = Record<string, string>;

@Injectable({ providedIn: 'root' })
export class TexteService {

  private readonly url = environment.apiUrl;
  private cache = new BehaviorSubject<TexteMap>({});

  textes$ = this.cache.asObservable();

  constructor(private http: HttpClient) {}

  load(): Observable<TexteMap> {
    return this.http.get<TexteMap>(`${this.url}/public/textes`).pipe(
      tap(t => this.cache.next(t)),
      catchError(() => of({}))
    );
  }

  get(cle: string, fallback = ''): string {
    return this.cache.value[cle] ?? fallback;
  }

  saveAll(updates: TexteMap): Observable<TexteMap> {
    return this.http.put<TexteMap>(`${this.url}/admin/textes`, updates).pipe(
      tap(t => this.cache.next({ ...this.cache.value, ...t }))
    );
  }

  uploadPhoto(file: File): Observable<{ url: string }> {
    const fd = new FormData();
    fd.append('image', file);
    return this.http.post<{ url: string }>(`${this.url}/admin/photo-artiste`, fd).pipe(
      tap(res => this.cache.next({ ...this.cache.value, 'site.artiste.photo': res.url }))
    );
  }
}
