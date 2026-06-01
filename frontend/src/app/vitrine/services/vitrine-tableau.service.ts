import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface VitrineTableau {
  id: number;
  imageUrl: string;
  titre: string;
  largeur: number | null;
  hauteur: number | null;
  type: { id: number; nom: string } | null;
  periode: string;
  prix: number | null;
  description: string | null;
  statut: string;
  visible: boolean;
  ordre: number;
}

@Injectable({ providedIn: 'root' })
export class VitrineTableauService {
  private readonly api = `${environment.apiUrl}/public/tableaux`;

  constructor(private http: HttpClient) {}

  getVisible(): Observable<VitrineTableau[]> {
    return this.http.get<VitrineTableau[]>(this.api);
  }
}
