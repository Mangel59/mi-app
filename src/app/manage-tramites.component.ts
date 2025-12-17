import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TramiteService } from './services/tramite.service';

@Component({
  standalone: true,
  selector: 'app-manage-tramites',
  imports: [
    CommonModule,
    FormsModule,              // ✅ OBLIGATORIO PARA ngModel
    MatCardModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <mat-card *ngFor="let t of tramites" style="margin-bottom:1rem">
      <strong>Radicado #{{ t.numeroRadicado }}</strong>
      <p><b>Tipo:</b> {{ t.tipoTramiteNombre }}</p>
      <p><b>Estado actual:</b> {{ t.estado }}</p>

      <mat-select [(ngModel)]="t.estado" style="width:200px">
        <mat-option *ngFor="let e of estados" [value]="e">
          {{ e }}
        </mat-option>
      </mat-select>

      <div style="margin-top:1rem">
        <button mat-raised-button color="primary" (click)="actualizarEstado(t)">
          Actualizar estado
        </button>
      </div>
    </mat-card>
  `
})
export class ManageTramitesComponent implements OnInit {

  tramites: any[] = [];
  estados: string[] = [];

  constructor(private tramiteSvc: TramiteService) {}

  ngOnInit(): void {
    // Funcionario de prueba (igual que Postman)
    this.tramiteSvc.findTramitesByFuncionario(1).subscribe({
      next: (data: any[]) => this.tramites = data,
      error: (e: any) => console.error('Error cargando trámites', e)
    });

    this.tramiteSvc.getEstadosTramite().subscribe({
      next: (data: string[]) => this.estados = data,
      error: (e: any) => console.error('Error cargando estados', e)
    });
  }

  actualizarEstado(t: any) {
    this.tramiteSvc.actualizarEstado(t.id, t.estado).subscribe({
      next: () => alert('Estado actualizado'),
      error: (e: any) => console.error('Error actualizando estado', e)
    });
  }
}
