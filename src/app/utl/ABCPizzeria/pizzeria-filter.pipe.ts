import { Pipe, PipeTransform } from '@angular/core';
import { IPedido } from './pizzeria.model';

@Pipe({
  name: 'pizzeriaFilter',
  standalone: true,
})
export class PizzeriaFilterPipe implements PipeTransform {
  transform(value: IPedido[], args: string): IPedido[] {
    let filter = args ? args.trim().toLowerCase() : '';
    if (!filter) return value;
    
    return value.filter((pedido: IPedido) => {
      if (!pedido.fecha) return false;
      return pedido.fecha.toLowerCase().includes(filter);
    });
  }
}