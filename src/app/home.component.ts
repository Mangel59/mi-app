import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card>
      <h2>Bienvenido</h2>
      <p>Seleccione una acción:</p>

      <div style="display:flex;flex-direction:column;gap:1rem;max-width:400px">
        <!-- Todos los usuarios logueados -->
        <button
          mat-raised-button
          color="primary"
          routerLink="/tramites"
          *ngIf="canRadicar()"
        >
          Radicar trámites
        </button>

        <!-- Solo ADMIN -->
        <button
          mat-raised-button
          color="accent"
          routerLink="/manage-tramites"
          *ngIf="canGestionarTramites()"
        >
          Gestionar trámites
        </button>

        <!-- Solo ADMIN -->
        <button
          mat-raised-button
          color="warn"
          routerLink="/manage-usuarios"
          *ngIf="canGestionarUsuarios()"
        >
          Gestionar usuarios
        </button>
      </div>
    </mat-card>
  `
})
export class HomeComponent {
  constructor(private auth: AuthService) {}

  canRadicar(): boolean {
    // cualquier usuario autenticado
    return this.auth.isLoggedIn();
  }

  canGestionarTramites(): boolean {
    // solo administradores
    return this.auth.isAdmin();
  }

  canGestionarUsuarios(): boolean {
    // solo administradores
    return this.auth.isAdmin();
  }
}
