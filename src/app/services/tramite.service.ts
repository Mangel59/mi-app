import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TramiteService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Combos
  getTiposTramite() {
    return this.http.get(`${this.baseUrl}/tipos-tramite/activos/combo`);
  }

  getTiposDocumento() {
    return this.http.get(`${this.baseUrl}/tipos-documento/activos/combo`);
  }

  getUsuariosAdministrativos() {
    return this.http.get(`${this.baseUrl}/usuarios/administrativos/activos/combo`);
  }

  getEstadosTramite() {
    return this.http.get(`${this.baseUrl}/estados-tramite`);
  }

  // Tramites
  createTramite(data: any) {
    return this.http.post(`${this.baseUrl}/tramites`, data);
  }

  asignarFuncionario(id: number, funcionarioId: number) {
    return this.http.put(`${this.baseUrl}/tramites/${id}/asignar`, { funcionarioId });
  }

  actualizarEstado(id: number, estadoTramite: string) {
    return this.http.put(`${this.baseUrl}/tramites/${id}/estado`, { estadoTramite });
  }

  agregarComentario(id: number, comentario: string) {
    return this.http.put(`${this.baseUrl}/tramites/${id}/comentario`, { comentario });
  }

  findTramiteByFuncionarioId(id: number) {
    return this.http.get(`${this.baseUrl}/tramites/funcionario/${id}`);
  }

  findSeguimientoByTramiteId(id: number) {
    return this.http.get(`${this.baseUrl}/tramites/${id}/seguimiento`);
  }
}
