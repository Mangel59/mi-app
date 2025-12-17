import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-manage-usuarios',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card>
      <h2>Gestión de usuarios</h2>
      <p>Página de gestión de usuarios (placeholder).</p>
    </mat-card>
  `
})
export class ManageUsuariosComponent {}
