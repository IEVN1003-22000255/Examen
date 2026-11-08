import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IPizzaDetalle, IPedido } from '../pizzeria.model';
import { PizzeriaApiService } from '../pizzeria-api.service';
import { PizzeriaFilterPipe } from '../pizzeria-filter.pipe';

@Component({
  selector: 'app-agregar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PizzeriaFilterPipe],
  templateUrl: './agregar.html',
})
export class AgregarComponent implements OnInit {
  formulario!: FormGroup;
  listaDetalle: IPizzaDetalle[] = [];
  totalGeneral = 0;
  mensaje = '';
  
  pedidosDelDia: IPedido[] = [];
  filtroFecha: string = '';

  constructor(
    private router: Router,
    private pizzeriaApi: PizzeriaApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.formulario = new FormGroup({
      nombre: new FormControl('', Validators.required),
      direccion: new FormControl('', Validators.required),
      telefono: new FormControl('', Validators.required),
      fecha: new FormControl('', Validators.required),
      tamano: new FormControl('Chica', Validators.required),
      ingredientes: new FormGroup({
        jamon: new FormControl(false),
        pina: new FormControl(false),
        champinones: new FormControl(false),
      }),
      numPizzas: new FormControl(1, [Validators.required, Validators.min(1)]),
    });

    this.cargarVentas();
  }

  agregarPizza(): void {
    const val = this.formulario.value;
    const tamano = val.tamano;
    const numPizzas = Number(val.numPizzas);

    const ingredientesArr: string[] = [];
    if (val.ingredientes.jamon) ingredientesArr.push('Jamón');
    if (val.ingredientes.pina) ingredientesArr.push('Piña');
    if (val.ingredientes.champinones) ingredientesArr.push('Champiñones');

    let precioBase = 40;
    if (tamano === 'Mediana') precioBase = 80;
    if (tamano === 'Grande') precioBase = 120;

    const subtotal = (precioBase + (ingredientesArr.length * 10)) * numPizzas;

    this.listaDetalle.push({ tamano, ingredientes: ingredientesArr, numPizzas, subtotal });
    this.calcularTotalGeneral();
    this.cdr.markForCheck();
  }

  quitarPizza(index: number): void {
    this.listaDetalle.splice(index, 1);
    this.calcularTotalGeneral();
    this.cdr.markForCheck();
  }

  calcularTotalGeneral(): void {
    this.totalGeneral = this.listaDetalle.reduce((acc, item) => acc + (item.subtotal || 0), 0);
  }

  terminarPedido(): void {
    this.mensaje = '';
    const val = this.formulario.value;

    if (!val.nombre || !val.direccion || !val.telefono || !val.fecha || this.listaDetalle.length === 0) {
      alert('Por favor complete todos los datos del cliente, la fecha y agregue al menos una pizza.');
      return;
    }

    const datosPedido = {
      nombre: val.nombre,
      direccion: val.direccion,
      telefono: val.telefono,
      fecha: val.fecha,
      detalles: this.listaDetalle
    };

    this.pizzeriaApi.registrarPedido(datosPedido).subscribe({
      next: (res) => {
        alert(`¡Pedido guardado con éxito! Importe total a pagar: $${res.total}`);
        this.listaDetalle = [];
        this.totalGeneral = 0;
        this.formulario.reset({ tamano: 'Chica', numPizzas: 1 });
        this.cargarVentas();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrar el pedido en la base de datos.');
      }
    });
  }

  cargarVentas(): void {
    this.pizzeriaApi.getPedidos().subscribe({
      next: (res) => {
        this.pedidosDelDia = res.pedidos;
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err)
    });
  }

  calcularTotalFiltrado(pedidosFiltrados: IPedido[]): number {
    return pedidosFiltrados.reduce((acc, item) => acc + (item.total || 0), 0);
  }
}