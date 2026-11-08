import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IPedido } from '../pizzeria.model';
import { PizzeriaApiService } from '../pizzeria-api.service';

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar.html',
})
export class ListarComponent implements OnInit {
  pedidos: IPedido[] = [];

  constructor(
    private router: Router,
    private pizzeriaApi: PizzeriaApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.pizzeriaApi.getPedidos().subscribe({
      next: (res) => {
        this.pedidos = res.pedidos;
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err)
    });
  }

  irEditar(pedido: IPedido): void {
    this.router.navigate(['/escuela/pizzeria-editar'], { state: { pedido } });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar pedido?')) return;
    this.pizzeriaApi.eliminarPedido(id).subscribe({
      next: () => this.cargarPedidos(),
      error: () => alert('No se pudo eliminar')
    });
  }

  volver(): void {
    this.router.navigate(['/escuela/pizzeria-agregar']);
  }
}