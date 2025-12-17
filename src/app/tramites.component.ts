import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { TramiteService } from './services/tramite.service';

@Component({
  selector: 'app-tramites',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  template: `
    <mat-card>
      <h2>Crear Trámite</h2>

      <mat-form-field appearance="fill" style="width:100%">
        <mat-label>Tipo de trámite</mat-label>
        <mat-select [(ngModel)]="tipoTramiteId">
          <mat-option *ngFor="let t of tiposTramite" [value]="t.id">
            {{ t.nombre }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="fill" style="width:100%">
        <mat-label>Comentario</mat-label>
        <input matInput [(ngModel)]="comentario">
      </mat-form-field>

      <h4>Adjuntos</h4>
      <div *ngFor="let d of tiposDocumento">
        <strong>{{ d.nombre }}</strong>
        <input type="file" (change)="onFile($event, d.id)">
      </div>

      <br>
      <button mat-raised-button color="primary" (click)="submit()">
        Radicar trámite
      </button>
    </mat-card>
  `
})
export class TramitesComponent implements OnInit {

  tiposTramite: any[] = [];
  tiposDocumento: any[] = [];

  tipoTramiteId!: number;
  comentario = '';

  files: Record<number, File> = {};

  constructor(private tramiteSvc: TramiteService) {}

  ngOnInit(): void {
    this.tramiteSvc.getTiposTramite().subscribe(res => this.tiposTramite = res);
    this.tramiteSvc.getTiposDocumento().subscribe(res => this.tiposDocumento = res);
  }

  onFile(event: Event, tipoDocumentoId: number) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.files[tipoDocumentoId] = input.files[0];
    }
  }

  submit() {
    const adjuntos = Object.entries(this.files).map(([id, file]) => ({
      tipoDocumentoId: Number(id),
      nombreArchivo: file.name,
      url: `https://storage.ejemplo.com/tramites/${file.name}`
    }));

    const payload = {
      tipoTramiteId: this.tipoTramiteId,
      comentario: this.comentario,
      adjuntos
    };

    this.tramiteSvc.createTramite(payload).subscribe({
      next: () => alert('Trámite creado correctamente'),
      error: () => alert('Error creando trámite')
    });
  }
}
