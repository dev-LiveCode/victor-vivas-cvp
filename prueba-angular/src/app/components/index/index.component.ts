/* 
  Componente IndexComponent que va a contener la estructura base de la pagina ademas de logica y operaciones.
  Versión 0.1
  Autor: Victor Vivas
*/

/* Imports necesarios */
import { Component, OnInit } from '@angular/core';
import { IndexService } from 'src/app/services/index.service'; // servicio para peticiones HTTP
import { User } from 'src/app/interfaces/user'; // interface para la estructura de los datos
import Swal from 'sweetalert2'; // libreria SweetAlert para alertas dinamicas

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {

  datos: User[] = []; // Propiedad de tipo User array para almacenar una lista de objetos recuparada por una peticion HTTP
  user: User | null = null; // Propiedad de tipo User para almacenar un objeto recuparado por una peticion HTTP o por la lista de datos
  action: string = 'save'; // Propiedad para saber que funcion o accion se está ejecutando y así permitir validaciones

  constructor(
    private service: IndexService // objeto de tipo IndexService para utilizar funciones HTTP del servicio
  ) {
  }
  
  ngOnInit(): void { 
    this.getUsers(); 
  }

  /* 
    Funcion para utilizar las funciones HTTP que permite el servicio IndexService
    Versión 0.1
    Autor: Victor Vivas
  */
  getUsers(){
    this.service.getUsers().subscribe(res =>{
      this.datos = res; // La respuesta se almacena en nuestro array
    }, err =>{
      console.error(err);
      Swal.fire({
        title: '¡Error!',
        text: 'Ocurrio un fallo interno del servidor, no se pudo recuperar los registro.',
        icon: 'error',
      })
    });
  }

  /* 
    Funcion para utilizar las funciones para traer un registro o confirmar la eliminación de un registro 
    Versión 0.1
    Autor: Victor Vivas
  */
 selectId(object: any){
   if(object.functionS == 'edit') this.getUser(object.id), this.action = 'edit'
   else if (object.functionS == 'delete') this.confirmacionDel(object.id)
  }

  /* 
    Funcion que ejecuta un EventEmmiter para cancelar la edición del registro
    Versión 0.1
    Autor: Victor Vivas
  */
  cancelEdit($event: boolean){
    this.user = null;
    this.action = 'save'
  }

  /* 
    Funcion que recupera un registro mediante un id
    Versión 0.1
    Autor: Victor Vivas
  */
  getUser(id: number){
    this.service.getUser(id).subscribe(res => {
      this.user = res;
    }, err => {
      console.error(err);
      Swal.fire({
        title: '¡Error!',
        text: 'Ocurrio un fallo interno del servidor, no se pudo recuperar el registro.',
        icon: 'error',
      })
    })
  }
  
  /* 
    Funcion de confirmacion para eliminar un registro y sí es así eliminarlo
    Versión 0.1
    Autor: Victor Vivas
  */
  confirmacionDel(id: number){
    Swal.fire({
      // template: '#template-alert'
      title: '¿Estás seguro?',
      text: 'Estás a punto de eliminar un registro, ¿Estás seguro?',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: 'Seguro',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.service.delUser(id).subscribe(res=>{
          Swal.fire(
            'Solicitud procesada!',
            'Su registro fue eliminado correctamente.',
            'success'
          )
          this.getUsers();
        }, err =>{
          Swal.fire({
            title: '¡Error!',
            text: 'Ocurrio un fallo interno del servidor, no se pudo eliminar el registro',
            icon: 'error',
          })
        })
      }
    })

  }

}
