import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';

export interface PersonaDTO {
  id?: number;
  nombre: string;
  segundoNombre?: string;
  apellido: string;
  segundoApellido?: string;
  correo?: string;
  numeroIdentificacion: string;
  tipoIdentificacionId: number;
}

@Injectable({ providedIn: 'root' })
export class PersonaService {
  // Use relative base so the dev proxy or same-origin works; avoids hard-coded ports
  private base = '/api';

  constructor(private http: HttpClient) {}

  getTipoIdentificaciones(): Observable<any[]> {
    // request a reasonably large page so we get all items
    const url = `${this.base}/tipoIdentificacion?page=0&size=200`;

    return this.http
      .get<any>(url, { observe: 'response' as const })
      .pipe(
        map((resp) => {
          const body = resp.body as any;
          // If backend returns a Page, use content array; otherwise assume body is the list
          if (body == null) return [];
          return body.content || body || [];
        }),
        catchError((err) => {
          const isParseError = err && typeof err.message === 'string' && err.message.includes('Http failure during parsing');
          if (isParseError) {
            // Dev server returned index.html for /api — try direct backend host as a fallback
            const fallback = 'http://localhost:8080/api/tipoIdentificacion?page=0&size=200';
            return this.http.get<any>(fallback, { observe: 'response' as const }).pipe(
              map((resp) => {
                const body = resp.body as any;
                if (body == null) return [];
                return body.content || body || [];
              }),
              catchError((e) => throwError(() => e))
            );
          }
          return throwError(() => err);
        })
      );
  }

  createPersona(dto: PersonaDTO): Observable<number> {
    const url = `${this.base}/persona`;

    return this.http.post(url, dto, { observe: 'response' as const }).pipe(
      map((resp) => {
        // Try Location header first (standard), then fall back to response body if present
        const loc = resp.headers.get('Location') || resp.headers.get('location');
        if (loc) {
          const parts = loc.split('/');
          const id = parseInt(parts.at(-1) || parts[parts.length - 1], 10);
          if (!isNaN(id)) return id;
        }

        // Some servers (or proxies/CORS) might not expose Location — try body.id
        const body = resp.body as unknown as PersonaDTO | null;
        if (body && (body as any).id) {
          return (body as any).id as number;
        }

        throw new Error('Location header not found and response body has no id');
      }),
      catchError((err) => {
        // If dev server returned 404 (no proxy) or other network/parsing error, retry direct backend
        const fallback = 'http://localhost:8080/api/persona';
        return this.http.post(fallback, dto, { observe: 'response' as const }).pipe(
          map((resp) => {
            const loc = resp.headers.get('Location') || resp.headers.get('location');
            if (loc) {
              const parts = loc.split('/');
              const id = parseInt(parts.at(-1) || parts[parts.length - 1], 10);
              if (!isNaN(id)) return id;
            }
            const body = resp.body as unknown as PersonaDTO | null;
            if (body && (body as any).id) return (body as any).id as number;
            throw err;
          }),
          catchError((e) => throwError(() => e))
        );
      })
    );
  }
}
