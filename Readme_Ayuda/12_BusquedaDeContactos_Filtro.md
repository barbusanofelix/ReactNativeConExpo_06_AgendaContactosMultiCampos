# BUSQUEDA DE CONTACTOS

## 🧠 Paso 1: El Razonamiento Lógico de la Búsqueda
Pensemos pensemos qué necesitamos a nivel de lógica en nuestra App_V04.js:

Un nuevo estado: Necesitamos una caja de memoria para guardar lo que el usuario va escribiendo letra a letra en la barra de búsqueda. Lo llamaremos filtroBusqueda.

* El dilema de los datos: 
Si modificamos directamente listaContactos al buscar, los contactos que no coincidan se borrarían del disco por culpa de nuestro useEffect de guardado automático. ¡Peligro!

La solución elegante: 
Mantendremos listaContactos intacta como nuestra "Base de Datos de confianza". Crearemos una variable calculada en tiempo real justo antes del return (en el renderizado) llamada contactosFiltrados. La FlatList ya no leerá de la lista completa, sino de esta lista filtrada.

## 🛠️ Paso 2: Preparando el terreno en App_V04.js
Lo primero que hace un desarrollador es clonar su versión anterior para no romper lo que ya funciona.

Duplica tu archivo actual y llámalo src/versionesApps/App_V04.js.

Cambia el nombre de la función exportada a App_V04.

En tu App.js raíz, cambia el apuntador para que apunte a esta nueva versión:

---
```jsx

import App_V04 from "./src/versionesApps/App_V04";
export default function App() { return <App_V04 />; }
```
---

Ahora, abre el nuevo App_V04.js. Vamos a añadir el nuevo estado para la búsqueda y a ``importar TextInput (que lo necesitaremos en la cabecera)``.


---
```jsx
import { View, Text, StyleSheet,  FlatList,  Alert, TouchableOpacity, TextInput } from "react-native";
```
---

Busca la cabecera de tus estados e inyecta la nueva variable filtroBusqueda:

---
```jsx
export default function App_V04() {
  const STORAGE_KEY = "@agenda_multicampos_v03"; // Mantenemos la llave para heredar tus datos

  const [listaContactos, setListaContactos] = useState([]);
  const [mostrarFormulario, setMostarFormulario] = useState(false);
  const [contactoAEditar, setContactoAEditar] = useState(null);

  // 🔍 NUEVO ESTADO: Guarda el texto de la barra de búsqueda
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
```
---

## 📐 Paso 3: Rediseñando la Cabecera (Tu propuesta visual)- barra de busqueda + adicion contacto.
Actualmente, tienes el título arriba y, condicionalmente, el BotonNuevoContacto (que es un botón ancho que ocupa toda la fila).

Para lograr tu diseño de "Barra de búsqueda e icono ➕ en la misma línea", vamos a crear un contenedor horizontal (flexDirection: "row") justo debajo del título principal. Además, este bloque solo debería verse si no se está mostrando el formulario, para mantener la pantalla limpia.

Vamos a ver cómo quedaría estructurada esa sección en el return de tu App_V04.js. Busca donde estaba el BotonNuevoContacto y reemplázalo por este nuevo bloque:

---
```jsx
 <Text style={globalStyles.titulo}>📒 Agenda Multi-Campos (V04)</Text>

      {/* 🔍 BARRA DE BÚSQUEDA Y BOTÓN ➕ EN LA MISMA LÍNEA */}
      {!mostrarFormulario && (
        <View style={styles.contenedorCabeceraAcciones}>
          <TextInput
            style={styles.inputBusqueda}
            placeholder="Buscar por nombre o teléfono..."
            value={filtroBusqueda}
            onChangeText={setFiltroBusqueda} // Cada letra cambia el estado
          />
          
          <TouchableOpacity
            style={styles.btnAñadirCorto}
            onPress={() => {
              setContactoAEditar(null);
              setMostarFormulario(true);
            }}
          >
            <Text style={styles.textoBtnAñadir}>➕</Text>
          </TouchableOpacity>
        </View>
      )}
```
---
     
## 🎨 Paso 4: Los Estilos Locales de la Cabecera
Para que esto se alinee perfectamente en tu pantalla, necesitamos añadir las reglas de maquetación al final del archivo, dentro del StyleSheet.create local que ya tienes en App_V04.js.

Añade estas tres nuevas reglas respetando tus colores:


---
```jsx
const styles = StyleSheet.create({
  contenedorVacio: {
    padding: 40,
    alignItems: "center",
  },
  textoVacio: {
    fontSize: 15,
    color: colores.textoMutado,
    textAlign: "center",
    fontStyle: "italic",
  },
  // 🌟 NUEVOS ESTILOS PARA LA CABECERA COMPACTA:
  contenedorCabeceraAcciones: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10, // Separación limpia entre el input y el botón
  },
  inputBusqueda: {
    flex: 1, // El buscador se estira y ocupa todo el espacio que pueda
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  btnAñadirCorto: {
    width: 45,
    height: 45,
    backgroundColor: colores.primario, // Mantiene el color azul de tu botón original
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  textoBtnAñadir: {
    fontSize: 20,
    color: "#fff",
  },
});
```
---

## ⏱️ Parada de Control
Hasta aquí hemos resuelto la maquetación visual de tu idea: el input y el botón ➕ conviven en armonía en la misma línea, y el estado filtroBusqueda ya captura lo que escribes.

¿Hacemos una pausa aquí para que verifiques en tu Samsung si la nueva distribución visual se ve tan compacta y estilizada como te la imaginas? En cuanto me des el visto bueno, pasamos al siguiente paso: programar el algoritmo del filtro en tiempo real.