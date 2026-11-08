import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IPedido } from '../pizzeria.model';
import { PizzeriaApiService } from '../pizzeria-api.service';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar.html',
})
export class EditarComponent implements OnInit {
  formulario!: FormGroup;
  pedidoActual!: IPedido;

  constructor(
    private router: Router,
    private pizzeriaApi: PizzeriaApiService,
    private cdr: ChangeDetectorRef
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state?.['pedido']) {
      this.pedidoActual = nav.extras.state['pedido'];
    }
  }

  ngOnInit(): void {
    if (!this.pedidoActual) {
      this.router.navigate(['/escuela/pizzeria-listar']);
      return;
    }

    this.formulario = new FormGroup({
      nombre: new FormControl(this.pedidoActual.nombre, Validators.required),
      direccion: new FormControl(this.pedidoActual.direccion, Validators.required),
      telefono: new FormControl(this.pedidoActual.telefono, Validators.required),
    });
  }

  guardarCambios(): void {
    if (this.formulario.invalid) return;
    const val = this.formulario.value;

    const datosActualizados = {
      nombre: val.nombre,
      direccion: val.direccion,
      telefono: val.telefono,
      detalles: this.pedidoActual.detalles
    };

    this.pizzeriaApi.modificarPedido(this.pedidoActual.id!, datosActualizados).subscribe({
      next: () => {
        alert('Pedido modificado con éxito');
        this.router.navigate(['/escuela/pizzeria-listar']);
      },
      error: () => alert('Error al modificar')
    });
  }

  cancelar(): void {
    this.router.navigate(['/escuela/pizzeria-listar']);
  }
}