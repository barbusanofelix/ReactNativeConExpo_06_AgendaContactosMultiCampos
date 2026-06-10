Hasta ahora los campos de la base de datos eran:

- Nombre
- Telefono => que despues lo ampliamos a Array de telefonos, con id, numero y etiqueta.

El proximo paso sera incorporar:

- Empresa
- correo
- Nota

# 🗺️ Bienvenidos a la Versión 05 ( App_V05.js): La Gran Expansión de Campos

Ahora que la estructura de la casa es sólida y flexible, estamos listos para asumir el reto : añadir Correo, Empresa y un campo libre de Notas sin que la aplicación sufra el más mínimo desorden.

Como siempre, vamos a razonar la jugada como ingenieros antes de tocar una sola tecla.

## 🧠 El Razonamiento del Modelo de Datos

Miremos cómo es la estructura de un contacto en tu base de datos actual:

JavaScript
{
id: "1717965412",
nombre: "Carlos",
telefonos: [
{ id: "tel_1", numero: "5231452", etiqueta: "Móvil" },
{ id: "tel_2", numero: "9851245", etiqueta: "Casa" }
]
}
Para incorporar los nuevos requerimientos, no tenemos que romper esta base. Lo único que haremos será expandir el objeto inyectándole tres cables nuevos a la misma altura del nombre:

JavaScript
{
id: "1717965412",
nombre: "Carlos",
empresa: "Google", // 🏢 ¡Nuevo!
correo: "carlos@...", // ✉️ ¡Nuevo!
notas: "Amigo de...", // 📝 ¡Nuevo!
telefonos: [...]
}

## 🛠️ Paso 1: Clonar y Apuntar a la App_V05.js

Para trabajar con red de seguridad y mantener tu laboratorio impecable:

- Duplica tu archivo principal y renómbralo a src/versionesApps/App_V05.js.
- Cambia el nombre de la función interna a App_V05.

En App.js raíz, actualiza el apuntador para que el compilador de Expo lea esta nueva versión:

---

```jsx
import App_V05 from "./src/versionesApps/App_V05";
export default function App() {
  return <App_V05 />;
}
```

---

(Nota: Mantén el `STORAGE_KEY = "@agenda_multicampos_v03"` dentro de la V05 para que tu Samsung siga heredando y leyendo los mismos contactos que ya tienes guardados).

## 📋 Paso 2: Preparar la Lógica de los Campos Vacíos

Aquí viene una regla de oro de la Experiencia de Usuario (UX): El nombre es obligatorio, pero los nuevos campos (Empresa, Correo, Notas) deben ser 100% opcionales. Un usuario no siempre sabe el correo o la empresa de un contacto cuando lo registra.

Por lo tanto, en nuestro formulario, cuando un usuario no escriba nada en ellos, los guardaremos como cadenas vacías "".

## 🧠 Paso 1: El planteamiento de la lógica para el campo "Empresa"

Vamos a inaugurar la V05 atacando exclusivamente el campo de la Empresa. Antes de picar código, nos hacemos tres preguntas clave:

- ¿Qué memoria necesitamos? En el formulario, necesitamos un estado local para capturar lo que el usuario escribe en el input de la empresa. Lo llamaremos empresa.
- ¿Cómo se inicializa? Si estamos creando un contacto nuevo, debe arrancar vacío (""). Si estamos editando a un contacto existente (como Carlos), debe arrancar con el valor que Carlos ya tenía guardado (contactoAEditar.empresa).
- ¿Es obligatorio? No, es opcional. Por lo tanto, no bloquearemos el botón de guardar si el usuario lo deja vacío.

## 🛠️ Paso 2: Crear el Estado para Empresa en ContactoForm.js

Abre tu archivo src/components/ContactoForm.js. Vamos a la cabecera del componente, justo donde tienes tus estados para el nombre y la lista de telefonos.

Inyectemos la memoria para la empresa respetando la lógica de inicialización que acabamos de razonar:

---

```jsx
export default function ContactoForm({ onGuardarContacto, contactoAEditar, onCancelar }) {
// Estados que ya tenías:
const [nombre, setNombre] = useState(contactoAEditar ? contactoAEditar.nombre : "");

// 🏢 NUEVO ESTADO: Memoria para el campo Empresa
const [empresa, setEmpresa] = useState(contactoAEditar && contactoAEditar.empresa ? contactoAEditar.empresa : "");
```

---

Nota técnica de seguridad: Usamos `contactoAEditar && contactoAEditar.empresa` por pura precaución. Así, si tus contactos antiguos de la V03/V04 no tienen el campo empresa creado en sus objetos, JavaScript no se romperá y simplemente le asignará un texto vacío "".

- Al colocar contactoAEditar , si tiene info sale true.
- Al colocar contactoAEditar.empresa, si no exite sale false.
  - Si el contacto no se le habia asignado un campo de empresa ( los contactos de las versiones anteriores) , al intentar leer contactoAEditar.empresa, JavaScript no encuentra esa clave y devuelve un valor especial llamado undefined (indefinido).
    - En JavaScript, el valor undefined se comporta como un false cuando lo metes dentro de una evaluación lógica (como un if o un operador &&).

## 📐 Paso 3: Pintar el Input de la Empresa en la Interfaz

Ahora bajemos al return de tu ContactoForm.js. Un programador busca un lugar lógico para la nueva caja de texto. Colocarla justo debajo del input del "Nombre" y antes de la sección de "Teléfonos" es perfecto a nivel visual.

Busca donde termina el TextInput del nombre e inyecta el nuevo input de la empresa:

---

```jsx
{/_ INPUT DEL NOMBRE (Ya lo tienes) _/}
<Text style={styles.label}>Nombre del Contacto:</Text>
<TextInput
        style={styles.input}
        placeholder="Ej: Pepe Pérez"
        value={nombre}
        onChangeText={setNombre}
      />

      {/* 🏢 NUEVO: INPUT DE LA EMPRESA */}
      <Text style={styles.label}>Empresa (Opcional):</Text>
      <TextInput
        style={styles.input} // Reutilizamos tu estilo de input para que mantenga la misma estética
        placeholder="Ej: Google, Talleres Paco..."
        value={empresa}
        onChangeText={setEmpresa} // Guarda cada letra en nuestro nuevo estado
      />
```

---

## ⏱️ Parada de Control y Prueba de Fuego Nº 1
Probamos. No hemos tocado la función de guardar todavía, pero queremos validar la interfaz y la inicialización de la memoria.

Guarda el archivo y haz estas dos pruebas:

Prueba A (Crear nuevo): Toca el botón + en la cabecera. ¿Aparece el nuevo input de "Empresa" justo debajo del nombre? Intenta escribir en él para comprobar que el teclado responde y el estado acepta las letras.

Prueba B (Cancelar): Toca "Cancelar" para comprobar que la app regresa a la lista sin romper nada.


## 🛠️ Siguiente Micro-Paso: Inyectar la Empresa en el Botón de Guardar. ( GUARDAR EMPRESA EN EL CONTACTO)
Ya comprobamos que el input se dibuja bonito y captura el texto. Ahora necesitamos que, al pulsar el ``botón "Guardar"``, ese texto que está flotando en el estado empresa se meta en el paquete que se envía a la base de datos.

En ContactoForm.js, buscamod la función interna que maneja el guardado (suele llamarse handleGuardar o algo muy similar).

Dentro de esa función, busca el lugar donde se construye el objeto que se envía a onGuardarContacto. Vamos a inyectar la clave empresa justo debajo del nombre:

---
```jsx
  // 💾 Lógica al presionar Guardar
  const presionarGuardar = () => {
    if (nombre.trim() === "") {
      Alert.alert("Error", "El nombre es obligatorio.");
      return;
    }

    // (Aquí ya tienes tu lógica para validar que haya al menos un teléfono y resto de codigo de la funcion presionarGuardar)

    // 🏗️ CONSTRUIMOS EL OBJETO EXPANSO PARA ENVIAR AL PADRE
    const contactoListo = {
      id: contactoAEditar ? contactoAEditar.id : Date.now().toString(),
      nombre: nombre.trim(),
      empresa: empresa.trim(), // 🏢 ¡NUEVO CABLE CONECTADO!
      telefonos: telefonos,
    };

    // Despachamos el paquete hacia App_V05
    onGuardarContacto(contactoListo);
  };
  ```
  ---

  ## 🧠 El Planteamiento Lógico de la Cesta de Eliminación
Para que un input tenga un botón de "borrar" a su derecha, ya no puede estar flotando suelto en el return. Necesitamos:

Un contenedor horizontal: 
* Envolver el TextInput de la empresa y el botón de la cesta en un <View style={{ flexDirection: "row" }})>.

Distribución de espacio: 
* El input de texto debe estirarse todo lo posible (flex: 1) y dejar un pequeño espacio a la derecha para que se asiente el botón de la cesta.

La Acción:
 * Al pulsar la cesta, simplemente ejecutaremos setEmpresa(""). Al vaciar el estado, el input se limpiará automáticamente en pantalla gracias al renderizado reactivo.

### 📐 Paso 1: Rediseñar el Bloque de la Empresa en la Interfaz
Vamos al return de tu ContactoForm.js. Vamos a quitar el TextInput simple que pusimos hace un momento y lo vamos a reemplazar por este bloque estructurado en fila.

Busca el área de la Empresa y modifícalo para que quede exactamente así:

---
```JSX
      {/* 🏢 INPUT DE LA EMPRESA CON BOTÓN DE ELIMINACIÓN */}
      <Text style={styles.label}>Empresa (Opcional):</Text>
      
      <View style={styles.contenedorInputAccion}>
        <TextInput
          style={styles.inputFlexible} // Cambiamos a un estilo flexible para que comparta fila
          placeholder="Ej: Google, Talleres Paco..."
          value={empresa}
          onChangeText={setEmpresa}
        />
        
        {/* Mostramos la cesta de eliminación SOLOS si el campo tiene texto */}
        {empresa.trim() !== "" && (
          <TouchableOpacity 
            style={styles.btnEliminarCampo} 
            onPress={() => setEmpresa("")} // 🎯 Vacía el estado al pulsar
          >
            <Text style={{ fontSize: 20 }}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>

```
---
      
🎨 Paso 2: Los Estilos Locales para la Fila
Para que el input y la cesta se alineen de forma simétrica e impecable en tu Samsung, necesitamos añadir estas tres pequeñas reglas al final de tu archivo, dentro del StyleSheet.create de tu ContactoForm.js:

JavaScript
  // 🌟 NUEVOS ESTILOS PARA LOS CAMPOS EXPANDIDOS CON BORRADO:
  contenedorInputAccion: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8, // Separación sutil entre la caja de texto y la cesta
  },
  inputFlexible: {
    flex: 1, // 🚀 Absorbe todo el ancho disponible, empujando la cesta a la derecha
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  btnEliminarCampo: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fee2e2", // Un fondo rojo muy sutil para que haga juego con el borrado
    borderRadius: 8,
  },
⏱️ Parada de Control y Prueba de Fuego (Empresa Cerrada)
Como programadores humanos minuciosos, cerramos el ciclo del campo Empresa probando esta nueva característica:

Abre el formulario pulsando el +.

Verás que el campo "Empresa" aparece limpio y no se ve la cesta por ningún lado (gracias a la condición empresa.trim() !== ""). Esto evita ruido visual innecesario si el campo está vacío.

Empieza a escribir "Apple". En cuanto pongas la primera "A", ¡pum!, la cesta 🗑️ aparecerá mágicamente a la derecha perfectamente alineada.

Pulsa el botón de la cesta 🗑️. ¿Se borra todo el texto por completo y se oculta la papelera de inmediato?

Pruébalo en tu móvil y dime si el comportamiento interactivo se siente tan natural y limpio como lo planeaste. ¡Una vez verificado, le aplicamos este mismo estándar de oro al Correo!



