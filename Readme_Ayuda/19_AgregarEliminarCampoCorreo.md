Vamos a agregar un campo correo. 
Es seguir los pasos que usamos para agregar Empresa.

El useState de contactoAEditar se recibe como una prop en ControlForm.js. Es decir, un valor de lectura.


Pasos basicos:

En FormControl.js
1. Agregar un UseState para el correo.
2. Agregar el campo correo en el formulario.
3. onG


# 1. Agregar un useState para el correo del contacto.

Definimos el State de ``correo``. 
Cuando abrimos ``ControlForm.js`` , este recibe por prop `contactoAEditar`  , es decir, parametro en la cabecera de la funcion:

``export default function ContactoForm({onGuardarContacto,  contactoAEditar,  onCancelar,})`` // junto con  onGuardarContacto y onCancelar.

``const [correo, setCorreo] =useState(contactoAEditar && contactoAEditar.correo ? contactoAEditar.correo:"");``


