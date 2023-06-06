/* 
  Componente FormComponent que va a contener el codigo y la logica del formulario de
  registro y actualización de datos.
  Versión 0.1
  Autor: Victor Vivas
*/

/* Imports necesarios */
import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { User } from 'src/app/interfaces/user'; // interface para la estructura de los datos
import { IndexService } from 'src/app/services/index.service'; // servicio para peticiones HTTP
import Swal from 'sweetalert2'; // libreria SweetAlert para alertas dinamicas

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  @Input() user: User | null = null; // parametro de entrada del usuario a editar
  @Input() action: string | null = null; // parametro de entrada para saber que acción se esta realizando
  @Output() cancelEdit = new EventEmitter<boolean>(); // Este parametro de salida nos ejecutará una función en el componente padre
  @Output() cargarTabla = new EventEmitter(); // Este parametro de salida nos ejecutará una función en el componente padre

  userTemp: User = { // Objeto con estructura User temporal para modificar los datos sin perder los originales 
    id: 0,
    email: '',
    name: '',
    gender: '',
    status: ''
  }

  check: boolean = false; // propiedad para saber sí se ha chekeado los input radio button

  constructor(
    private service: IndexService // Se declara un objeto en el constructor de tipo IndexService para acceder a las funciones HTTP del servicio
  ) {
    if (this.user == null){ // Sí el objeto llega null se asigna a la propiedad de la clase su estructura de tipo User
      this.user = {
        id: 0,
        email: '',
        name: '',
        gender: '',
        status: ''
      }
    }
  }

  ngOnInit(): void {
  }

  /* 
    Funcion para limpiar el formulario y emitir un evento mediente nuestro decorador para comunicar al componente padre y que limpie el objeto user
    Versión 0.1
    Autor: Victor Vivas
  */
  cancel($event: Event) {
    this.limpiarForm();
    this.user = null;
    this.cancelEdit.emit(true);
  }

  /* 
    Funcion o evento orquestador, donde se validan los campos del formuilario, se registra o 
    se actualizan datos mediante validaciones t se muestran alertas a los usuarios del estado de la solicitud
    Versión 0.1
    Autor: Victor Vivas
  */
  sendForm($event: any){
    $event.preventDefault();

    let boolCampos: boolean = this.validationForm();

    if(boolCampos == false) return;

    if(this.action == 'edit') this.userTemp.id = this.user!.id;

    this.userTemp.name = (document.getElementById('inputName') as HTMLInputElement).value.toString();
    this.userTemp.email = (document.getElementById('inputEmail') as HTMLInputElement).value.toString();
    this.userTemp.gender = (document.getElementById('inputGender') as HTMLInputElement).value.toString();
    this.userTemp.status = this.check ? 'active' : 'inactive';

    if(this.action == 'save') {
      this.service.postUser(this.userTemp).subscribe(res =>{
        Swal.fire({
          title: '¡Solicitud procesada!',
          text: 'Se creo su registro correctamente!',
          icon: 'success',
        })
        this.cargarTabla.emit();
        this.limpiarForm();
      }, err =>{
        if(err.status == 422){
          Swal.fire({
            title: '¡Error!',
            text: 'El "Email" ingresado ya existe en la base de datos',
            icon: 'error',
          })
        }else{
          Swal.fire({
            title: '¡Error!',
            text: 'Ocurrio un fallo interno del servidor.',
            icon: 'error',
          })
        }
      });
    }
    else {
      this.service.putUser(this.userTemp).subscribe(res =>{
        Swal.fire({
          title: '¡Solicitud procesada!',
          text: 'Se edito su registro correctamente!',
          icon: 'success',
        });
        this.cargarTabla.emit();
        this.limpiarForm();
      }, err =>{
        if(err.status == 422){
          Swal.fire({
            title: '¡Error!',
            text: 'El "Email" ingresado ya existe en la base de datos',
            icon: 'error',
          })
        }else{
          Swal.fire({
            title: '¡Error!',
            text: 'Ocurrio un fallo interno del servidor.',
            icon: 'error',
          })
        }
      });
    }
  }


  /* 
    Funcion para validar campos obligatorios y formatos
    Versión 0.1
    Autor: Victor Vivas
  */
  validationForm(): boolean{
    let bool: boolean = true;

    let inputName: string = (document.getElementById('inputName') as HTMLInputElement).value.toString().trim();
    let inputEmail: string = (document.getElementById('inputEmail') as HTMLInputElement).value.toString().trim();
    let inputGender: string = (document.getElementById('inputGender') as HTMLInputElement).value.toString().trim();
    let inputActive: HTMLInputElement = (document.getElementById('inputStatusA') as HTMLInputElement);
    let inputInactive: HTMLInputElement = (document.getElementById('inputStatusI') as HTMLInputElement);

    let regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i

    if(inputName.length == 0) (document.getElementById('s-inputName') as HTMLElement).style.display = "block", bool = false;
    else (document.getElementById('s-inputName') as HTMLElement).style.display = "none";

    if(inputEmail.length == 0) (document.getElementById('s-inputEmail') as HTMLElement).style.display = "block", bool = false;
    else if(!regex.test(inputEmail)){
      (document.getElementById('s-inputEmail-v') as HTMLElement).style.display = "block";
      bool = false;
    } else (document.getElementById('s-inputEmail') as HTMLElement).style.display = "none", (document.getElementById('s-inputEmail-v') as HTMLElement).style.display = "none";

    if(inputGender.length == 0) (document.getElementById('s-inputGender') as HTMLElement).style.display = "block", bool = false;
    else (document.getElementById('s-inputGender') as HTMLElement).style.display = "none";

    if(inputActive.checked == false && inputInactive.checked == false) (document.getElementById('s-inputStatus') as HTMLElement).style.display = "block", bool = false;
    else (document.getElementById('s-inputStatus') as HTMLElement).style.display = "none";

    return bool;
  }

  /* 
    Funcion para cambiar el comportamiento natural del radio buttom y así permitir un formulario más dinamico
    Versión 0.1
    Autor: Victor Vivas
  */
  statusForm($event: any, bool: boolean){
    this.check = bool;
    if(this.check == true){
      if(bool == true) (document.getElementById('inputStatusI') as HTMLInputElement).checked = false;
      else (document.getElementById('inputStatusA') as HTMLInputElement).checked = false;
    }
  }

  /* 
    Funcion para limpiar el fomrulario
    Versión 0.1
    Autor: Victor Vivas
  */
  limpiarForm(){
    this.user = {
      id: 0,
      email: '',
      name: '',
      gender: '',
      status: ''
    }
    this.userTemp = {
      id: 0,
      email: '',
      name: '',
      gender: '',
      status: ''
    }
    this.check = false;
    this.action = 'save';
    (document.getElementById('inputStatusI') as HTMLInputElement).checked = false;
    (document.getElementById('inputStatusA') as HTMLInputElement).checked = false;
  }

  

}
