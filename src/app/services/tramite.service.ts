import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TramiteService {
  private api = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // combos
  getTiposTramite(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/tipos-tramite/activos/combo`);
  }

  getTiposDocumento(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/tipos-documento/activos/combo`);
  }

  getEstadosTramite(): Observable<string[]> {
    return this.http.get<string[]>(`${this.api}/estados-tramite`);
  }

  getUsuariosAdministrativos(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.api}/usuarios/administrativos/activos/combo`
    );
  }

  // trámites
  createTramite(payload: any): Observable<any> {
    return this.http.post(`${this.api}/tramites`, payload);
  }

  findTramitesByFuncionario(funcionarioId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.api}/tramites/funcionario/${funcionarioId}`
    );
  }

  actualizarEstado(id: number, estadoTramite: string): Observable<any> {
    return this.http.put(
      `${this.api}/tramites/${id}/estado`,
      { estadoTramite }
    );
  }

  asignarFuncionario(id: number, funcionarioId: number): Observable<any> {
    return this.http.put(
      `${this.api}/tramites/${id}/asignar`,
      { funcionarioId }
    );
  }
}
