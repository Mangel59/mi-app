import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule
} from '@angular/forms';

/* Angular Material */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tramites',
  standalone: true,
  templateUrl: './tramites.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class TramitesComponent implements OnInit {

  form!: FormGroup;

  tiposTramite: any[] = [];
  tiposDocumento: any[] = [];

  loading = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.cargarCombosMock(); // luego lo conectas al backend
  }

  /* =====================
     FORM
  ====================== */
  private buildForm(): void {
    this.form = this.fb.group({
      tipoTramiteId: [null, Validators.required],
      comentario: [''],
      adjuntos: this.fb.array([])
    });
  }

  get adjuntos(): FormArray {
    return this.form.get('adjuntos') as FormArray;
  }

  /* =====================
     MOCK COMBOS (para que compile)
     Luego los conectas a /api
  ====================== */
  private cargarCombosMock(): void {
    this.tiposTramite = [
      { id: 1, nombre: 'Homologación' },
      { id: 2, nombre: 'Cancelación de semestre' }
    ];

    this.tiposDocumento = [
      { id: 2, nombre: 'Documento de identidad' },
      { id: 3, nombre: 'Certificado académico' }
    ];
  }

  /* =====================
     ADJUNTOS
  ====================== */
  agregarAdjunto(): void {
    this.adjuntos.push(
      this.fb.group({
        tipoDocumentoId: [null, Validators.required],
        nombreArchivo: ['', Validators.required],
        url: ['', Validators.required]
      })
    );
  }

  eliminarAdjunto(index: number): void {
    this.adjuntos.removeAt(index);
  }

  /* =====================
     SUBMIT
  ====================== */
  crearTramite(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value;
    console.log('Payload trámite', payload);

    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      alert('Trámite creado (mock)');
      this.form.reset();
      this.adjuntos.clear();
    }, 1000);
  }
}
