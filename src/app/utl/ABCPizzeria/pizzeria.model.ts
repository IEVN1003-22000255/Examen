export interface IPizzaDetalle {
  tamano: string;
  ingredientes: string[];
  numPizzas: number;
  subtotal?: number;
}

export interface IPedido {
  id?: number;
  nombre: string;
  direccion: string;
  telefono: string;
  fecha?: string;
  detalles: IPizzaDetalle[];
  total?: number;
}