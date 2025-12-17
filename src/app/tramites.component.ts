import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tramites',
  templateUrl: './tramites.component.html',
})
export class TramitesComponent implements OnInit {

  form!: FormGroup;

  tiposTramite: any[] = [];
  tiposDocumento: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      tipoTramiteId: [null, Validators.required],
      comentario: [''],
      adjuntos: this.fb.array([])
    });

    this.cargarCombos();
  }

  /* =========================
     GETTERS
  ========================== */
  get adjuntos(): FormArray {
    return this.form.get('adjuntos') as FormArray;
  }

  /* =========================
     COMBOS
  ========================== */
  cargarCombos(): void {
    this.http.get<any[]>('/api/tipos-tramite/activos/combo')
      .subscribe(data => this.tiposTramite = data);

    this.http.get<any[]>('/api/tipos-documento/activos/combo')
      .subscribe(data => this.tiposDocumento = data);
  }

  /* =========================
     ADJUNTOS
  ========================== */
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

  /* =========================
     SUBMIT
  ========================== */
  crearTramite(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      tipoTramiteId: this.form.value.tipoTramiteId,
      comentario: this.form.value.comentario,
      adjuntos: this.form.value.adjuntos
    };

    console.log('PAYLOAD FINAL', payload);

    this.http.post('/api/tramites', payload).subscribe({
      next: () => alert('Trámite creado correctamente'),
      error: err => console.error('Error creando trámite', err)
    });
  }
}
