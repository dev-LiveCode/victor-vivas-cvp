/* 
  Componente FormComponent que va a contener el codigo y la logica del formulario de
  registro y actualización de datos.
  Versión 0.1
  Autor: Victor Vivas
*/

/* Imports necesarios */
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { User } from 'src/app/interfaces/user'; // interface para la estructura de los datos
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'; // Angular Material


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() datos: User[] = []; // Parametro de entrada de tipo Array User para almacenar los registros y poder recorrerlos
  columns: string[] = []; // Array de Strings para almacenar las columnas de la tabla

  @Output() idEvent = new EventEmitter<any>(); // Decorador de salida para ejecutar una función en el componente padre

   // Paginacion
   dataSize: number = 0;
   pageSize: number = 5; // cantidad de registros a mostrar
   desde: number = 0; // desde que registro mostrar
   hasta: number = 5; // hasta que registro mostrar
   @ViewChild(MatPaginatorModule) paginator: MatPaginatorModule | null = null;

  constructor() {}

  ngOnInit(): void {
    if(this.datos.length > 0){
      let claves: any = Object.keys(this.datos[0]); // de nuestro parametro @Input seleccionamos el primer objeto para extraer la cadena de caracteres de la llave que componen los atributops del objeto
      this.columns = claves; // el nombre de las claves se asignan a nuestro array de columnas
      this.dataSize = this.datos.length; // cantidad de datos para paginador
    }
  }
  
 /* 
    Funcion para navegar entre los registros de la tabla
    Versión 0.1
    Autor: Victor Vivas
  */
  cambiarPagina(e: PageEvent) {
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

  /* 
    Funcion para emitir un evento y así enviar un objeto al componente padre
    Versión 0.1
    Autor: Victor Vivas
  */
  selectId(id: number, functionS: string){
    let object = {
      id: id,
      functionS: functionS 
    }
    this.idEvent.emit(object);
  }

}
