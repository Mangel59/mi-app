import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TramiteService } from './services/tramite.service';

@Component({
  selector: 'app-manage-tramites',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <mat-card>
      <h2>Gestión de trámites</h2>

      <div *ngIf="tramites.length; else noTramites">
        <div
          *ngFor="let t of tramites"
          style="border:1px solid #eee;padding:0.75rem;margin-bottom:0.75rem"
        >
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <strong>#{{ t.id }}</strong> — {{ t.tipoTramiteNombre || '' }}
              <div style="font-size:0.85rem;color:rgba(0,0,0,0.6)">
                Estado: {{ t.estado || 'N/A' }}
              </div>
            </div>

            <div style="display:flex;gap:0.5rem">
              <button mat-button (click)="openAssign(t)">Asignar</button>
              <button mat-button (click)="openComment(t)">Comentar</button>
              <button mat-button (click)="openChangeEstado(t)">Cambiar estado</button>
            </div>
          </div>

          <!-- ASIGNAR FUNCIONARIO -->
          <div *ngIf="activeAssignFor === t.id" style="margin-top:0.75rem">
            <mat-form-field appearance="fill">
              <mat-label>Funcionario</mat-label>
              <mat-select [(value)]="selectedFuncionarioId">
                <mat-option *ngFor="let u of funcionarios" [value]="u.id">
                  {{ u.email }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" (click)="assign(t)">
              Confirmar
            </button>
            <button mat-button (click)="cancelAssign()">Cancelar</button>
          </div>

          <!-- AGREGAR COMENTARIO -->
          <div *ngIf="activeCommentFor === t.id" style="margin-top:0.75rem">
            <mat-form-field appearance="fill" style="width:60%">
              <mat-label>Comentario</mat-label>
              <input matInput [(ngModel)]="commentText" />
            </mat-form-field>

            <button mat-raised-button color="primary" (click)="addComment(t)">
              Agregar
            </button>
            <button mat-button (click)="cancelComment()">Cancelar</button>
          </div>

          <!-- CAMBIAR ESTADO -->
          <div *ngIf="activeEstadoFor === t.id" style="margin-top:0.75rem">
            <mat-form-field appearance="fill">
              <mat-label>Estado</mat-label>
              <mat-select [(value)]="selectedEstado">
                <mat-option *ngFor="let e of estados" [value]="e">
                  {{ e }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" (click)="changeEstado(t)">
              Cambiar
            </button>
            <button mat-button (click)="cancelEstado()">Cancelar</button>
          </div>
        </div>
      </div>

      <ng-template #noTramites>
        <p>No hay trámites.</p>
      </ng-template>
    </mat-card>
  `
})
export class ManageTramitesComponent implements OnInit {
  tramites: any[] = [];
  funcionarios: any[] = [];
  estados: string[] = [];

  // UI state
  activeAssignFor: number | null = null;
  selectedFuncionarioId: number | null = null;

  activeCommentFor: number | null = null;
  commentText = '';

  activeEstadoFor: number | null = null;
  selectedEstado: string | null = null;

  constructor(private tramiteSvc: TramiteService) {}

  ngOnInit(): void {
    this.loadTramites();
    this.loadEstados();
  }

  loadTramites() {
    // ⚠️ Usa un ID real de funcionario (ejemplo fijo: 1)
    this.tramiteSvc.findTramiteByFuncionarioId(1).subscribe({
      next: (list: any) => (this.tramites = list || []),
      error: (e) => console.error('Error cargando trámites', e)
    });
  }

  loadEstados() {
    this.tramiteSvc.getEstadosTramite().subscribe({
      next: (list: any) => (this.estados = list || []),
      error: (e) => console.error('Error cargando estados', e)
    });
  }

  /* ---------- ASIGNAR ---------- */
  openAssign(t: any) {
    this.activeAssignFor = t.id;
    this.selectedFuncionarioId = null;

    this.tramiteSvc.getUsuariosAdministrativos().subscribe({
      next: (list: any) => (this.funcionarios = list || []),
      error: (e) => console.error('Error cargando funcionarios', e)
    });
  }

  assign(t: any) {
    if (!this.selectedFuncionarioId) {
      alert('Seleccione un funcionario');
      return;
    }

    this.tramiteSvc
      .asignarFuncionario(t.id, this.selectedFuncionarioId)
      .subscribe({
        next: () => {
          alert('Funcionario asignado');
          this.cancelAssign();
          this.loadTramites();
        },
        error: () => alert('Error al asignar funcionario')
      });
  }

  cancelAssign() {
    this.activeAssignFor = null;
    this.selectedFuncionarioId = null;
  }

  /* ---------- COMENTAR ---------- */
  openComment(t: any) {
    this.activeCommentFor = t.id;
    this.commentText = '';
  }

  addComment(t: any) {
    if (!this.commentText.trim()) {
      alert('Comentario vacío');
      return;
    }

    this.tramiteSvc.agregarComentario(t.id, this.commentText).subscribe({
      next: () => {
        alert('Comentario agregado');
        this.cancelComment();
      },
      error: () => alert('Error agregando comentario')
    });
  }

  cancelComment() {
    this.activeCommentFor = null;
    this.commentText = '';
  }

  /* ---------- ESTADO ---------- */
  openChangeEstado(t: any) {
    this.activeEstadoFor = t.id;
    this.selectedEstado = null;
  }

  changeEstado(t: any) {
    if (!this.selectedEstado) {
      alert('Seleccione un estado');
      return;
    }

    this.tramiteSvc.actualizarEstado(t.id, this.selectedEstado).subscribe({
      next: () => {
        alert('Estado actualizado');
        this.cancelEstado();
        this.loadTramites();
      },
      error: () => alert('Error actualizando estado')
    });
  }

  cancelEstado() {
    this.activeEstadoFor = null;
    this.selectedEstado = null;
  }
}
