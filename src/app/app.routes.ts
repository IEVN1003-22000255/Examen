import { Routes } from '@angular/router';

// Es un arreglo, vamos a agregar propiedades a los objetos
export const routes: Routes = [
    {
        path:'utl',
        children:[
                {
                path: 'pizzeria-agregar',
                loadComponent: () => import('./utl/ABCPizzeria/agregar/agregar').then(m => m.AgregarComponent)
                },
                {
                    path: 'pizzeria-listar',
                    loadComponent: () => import('./utl/ABCPizzeria/listar/listar').then(m => m.ListarComponent)
                },
                {
                    path: 'pizzeria-editar',
                    loadComponent: () => import('./utl/ABCPizzeria/editar/editar').then(m => m.EditarComponent)
                },
        ],
    },
    
    { path: '', redirectTo: 'admin', pathMatch: 'full' },
    { path: '**', redirectTo: 'admin' },
];