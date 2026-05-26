import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TypeDto {
  id: number;
  nom: string;
}

export interface TableauResponse {
  id: number;
  imageUrl: string;
  titre: string;
  largeur: number;
  hauteur: number;
  type: TypeDto | null;
  periode: string;
  prix: number | null;
  description: string | null;
  statut: string;
  visible: boolean;
  ordre: number;
}

export interface TableauFormData {
  titre: string;
  largeur: number;
  hauteur: number;
  typeId: number | null;
  periode: string;
  prix: number | null;
  description: string | null;
  statut: string;
  visible: boolean;
  ordre: number;
}

@Injectable({ providedIn: 'root' })
export class TableauService {
  private readonly api = `${environment.apiUrl}/admin/tableaux`;
  private readonly typesApi = `${environment.apiUrl}/admin/types`;
  readonly imageBase = '';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TableauResponse[]> {
    return this.http.get<TableauResponse[]>(this.api);
  }

  getById(id: number): Observable<TableauResponse> {
    return this.http.get<TableauResponse>(`${this.api}/${id}`);
  }

  create(image: File, data: TableauFormData): Observable<TableauResponse> {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('data', JSON.stringify(data));
    return this.http.post<TableauResponse>(this.api, formData);
  }

  update(id: number, data: TableauFormData, image?: File): Observable<TableauResponse> {
    const formData = new FormData();
    if (image) formData.append('image', image);
    formData.append('data', JSON.stringify(data));
    return this.http.put<TableauResponse>(`${this.api}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  updateOrder(items: { id: number; ordre: number }[]): Observable<void> {
    return this.http.patch<void>(`${this.api}/order`, items);
  }

  // Types
  getTypes(): Observable<TypeDto[]> {
    return this.http.get<TypeDto[]>(this.typesApi);
  }

  createType(nom: string): Observable<TypeDto> {
    return this.http.post<TypeDto>(this.typesApi, { nom });
  }

  updateType(id: number, nom: string): Observable<TypeDto> {
    return this.http.put<TypeDto>(`${this.typesApi}/${id}`, { nom });
  }

  deleteType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.typesApi}/${id}`);
  }
}
