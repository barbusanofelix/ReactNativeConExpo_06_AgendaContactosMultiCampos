# RESOLVER QUE EL TECLADO TAPE LOS CAMPOS A LLENAR.

El problema se ve en la siguiente imagen:
Hay un campo `Empresa` que no vemos porque el teclado lo tapa.

![alt text](<WhatsApp Image 2026-06-10 at 12.14.46 AM.jpeg>)

🧠 El Planteamiento Lógico del Problema de la Pantalla Completa
En las aplicaciones de escritorio o web (C#, PHP/HTML), si una página es muy larga, el navegador o el sistema operativo le añaden barras de desplazamiento automáticas.

En los teléfonos móviles esto no ocurre por defecto. Cuando el teclado se despliega, se posiciona como una capa flotante rígida por encima de nuestra interfaz. Para resolver esto con mentalidad de programador humano, necesitamos dos herramientas nativas de React Native trabajando en equipo:

ScrollView (El Desplazador): Cambiar el contenedor estático `<View>` del formulario por uno que permita hacer scroll vertical de forma natural con el dedo cuando los campos excedan la altura disponible.

KeyboardAvoidingView (Evitador de Teclado): Un componente inteligente que detecta los milisegundos exactos en los que el teclado sube y, automáticamente, empuja o encoge el formulario hacia arriba para que el input que tiene el foco (donde parpadea el cursor) quede siempre visible por encima del teclado.

🛠️ Paso 1: Importar los Nuevos Componentes en ContactoForm.js
Abre tu archivo src/components/ContactoForm.js. Vamos a la primera línea del archivo para traer estas dos herramientas de la librería nativa.

Modifica tu importación de React Native para incluir ScrollView y KeyboardAvoidingView, además de Platform (que nos servirá para ajustar el comportamiento exacto en Android):

---

```jsx
// src/components/ContactoForm.js
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView, // 📜 ¡Nuevo!
  KeyboardAvoidingView, // ⌨️ ¡Nuevo!
  Platform, // 📱 ¡Nuevo! para detectar si es Android
} from "react-native";
```

---

📐 Paso 2: Rediseñar la Envoltura Raíz del Formulario
Vamos al return de tu ContactoForm.js. Actualmente, todo el cuerpo de tu formulario está envuelto en un `<View style={styles.contenedor}>` (o el nombre que le tengas a tu contenedor interno).

Vamos a envolver todo el contenido dentro de nuestra nueva armadura inteligente. Modifica el inicio y el final de tu return para que quede estructurado de esta manera:

JavaScript
return (
// ⌨️ Capa 1: Evita que el teclado tape los inputs
<KeyboardAvoidingView
behavior={Platform.OS === "ios" ? "padding" : "height"}
style={{ flex: 1 }} >
{/_ 📜 Capa 2: Permite deslizar libremente los campos si la pantalla es corta _/}
<ScrollView
contentContainerStyle={styles.scrollFormulario}
showsVerticalScrollIndicator={false} // Oculta la barra gris fea de scroll lateral >

        {/* ✏️ AQUÍ DENTRO QUEDA TODO TU CONTENIDO ACTUAL SIN TOCAR NADA MÁS */}
        <View style={styles.cabeceraFormulario}>
          <Text style={styles.tituloFormulario}>📝 Editar Contacto</Text>
          {/* ... Tu botón de X para cancelar con 'cancelarMostrarFormYEdicion' */}
        </View>

        {/* Campo Nombre */}
        {/* Listado de Teléfonos con sus cestas */}
        {/* Botón "+ Añadir otro teléfono" */}

        {/* 🏢 Tu nuevo bloque de la Empresa (que ahora está abajo) */}

      </ScrollView>
    </KeyboardAvoidingView>

);
🎨 Paso 3: El Estilo para el Contenedor del Scroll
Para asegurarnos de que el ScrollView se comporte de forma elástica y respete los márgenes que ya tenías diseñados, añade este estilo al final de tu hoja de estilos (StyleSheet.create) dentro de ContactoForm.js:

JavaScript
scrollFormulario: {
paddingBottom: 40, // 🚀 TRUCO: Deja un colchón de espacio abajo para que el último campo (Empresa) suba cómodamente
},
⏱️ Parada de Control y Prueba de Fuego de Ingeniería
Como programadores minuciosos, guardamos los cambios y hacemos el test real en tu Samsung A34:

Abre el formulario para editar a Carlos.

Intenta arrastrar la pantalla con tu dedo hacia arriba. ¿Notas que ahora la pantalla se desliza como si fuera una página web larga, permitiéndote bajar cómodamente hasta el fondo?

Toca el input de la Empresa. Verás que en cuanto el teclado se despliega, el sistema reacciona: el formulario se acomoda solo y desplaza la caja de texto hacia arriba de forma automática, dejándola libre de la obstrucción del teclado.

Pruébalo directamente en el móvil y cuéntame si logramos liberar el campo Empresa del teclado para poder avanzar con total comodidad técnica al campo de Correo y Notas. ¡Paso a paso!
