import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ComboItem {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class TramitesService {

  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  /* =====================
     COMBOS
  ====================== */
  getTiposTramite(): Observable<ComboItem[]> {
    return this.http.get<ComboItem[]>(
      `${this.baseUrl}/tipos-tramite/activos/combo`
    );
  }

  getTiposDocumento(): Observable<ComboItem[]> {
    return this.http.get<ComboItem[]>(
      `${this.baseUrl}/tipos-documento/activos/combo`
    );
  }

  /* =====================
     TRÁMITES
  ====================== */
  crearTramite(payload: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/tramites`,
      payload
    );
  }
}
