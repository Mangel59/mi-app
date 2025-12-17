import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TramiteService } from './services/tramite.service';

@Component({
  selector: 'app-tramites',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <mat-card>
      <h2>Crear Trámite</h2>

      <!-- TIPO TRÁMITE -->
      <mat-form-field appearance="fill" style="width:100%">
        <mat-label>Tipo de trámite</mat-label>
        <mat-select [(value)]="selectedTipoId">
          <mat-option *ngFor="let t of tipoOptions" [value]="t.id">
            {{ t.nombre }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <!-- COMENTARIO -->
      <mat-form-field appearance="fill" style="width:100%">
        <mat-label>Comentario</mat-label>
        <input matInput [(ngModel)]="comentario" />
      </mat-form-field>

      <!-- ADJUNTOS -->
      <h4>Adjuntos</h4>
      <div *ngFor="let d of documentos; let i = index" style="margin-bottom:0.5rem">
        <div style="display:flex;align-items:center;gap:1rem">
          <strong>{{ d.nombre }}</strong>
          <input type="file" (change)="onFileSelected($event, d.id)" />
        </div>
      </div>

      <div style="margin-top:1rem">
        <button mat-raised-button color="primary" (click)="submit()">
          Radicar trámite
        </button>
      </div>
    </mat-card>
  `
})
export class TramitesComponent implements OnInit {
  tipoOptions: any[] = [];
  documentos: any[] = [];

  selectedTipoId: number | null = null;
  comentario = '';

  // tipoDocumentoId -> File
  files: Record<number, File> = {};

  constructor(private tramiteSvc: TramiteService) {}

  ngOnInit(): void {
    this.loadTiposTramite();
    this.loadTiposDocumento();
  }

  loadTiposTramite() {
    this.tramiteSvc.getTiposTramite().subscribe({
      next: (list: any) => this.tipoOptions = list || [],
      error: (e) => console.error('Error tipos trámite', e)
    });
  }

  loadTiposDocumento() {
    this.tramiteSvc.getTiposDocumento().subscribe({
      next: (list: any) => this.documentos = list || [],
      error: (e) => console.error('Error tipos documento', e)
    });
  }

  onFileSelected(event: Event, tipoDocumentoId: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.files[tipoDocumentoId] = input.files[0];
    }
  }

  submit() {
    if (!this.selectedTipoId) {
      alert('Seleccione tipo de trámite');
      return;
    }

    const adjuntos = Object.entries(this.files).map(([tipoDocumentoId, file]) => ({
      tipoDocumentoId: Number(tipoDocumentoId),
      nombreArchivo: file.name,
      url: `https://storage.ejemplo.com/${file.name}`
    }));

    const payload = {
      tipoTramiteId: this.selectedTipoId,
      comentario: this.comentario,
      adjuntos
    };

    this.tramiteSvc.createTramite(payload).subscribe({
      next: () => {
        alert('Trámite creado correctamente');
        this.comentario = '';
        this.files = {};
      },
      error: (e) => {
        console.error(e);
        alert('Error creando trámite');
      }
    });
  }
}
