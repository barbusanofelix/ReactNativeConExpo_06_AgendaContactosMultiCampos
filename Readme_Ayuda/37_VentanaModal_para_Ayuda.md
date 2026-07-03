# USAR UN MODAL PARA UNA VENTANA DE AYUDA.

En el desarrollo móvil con React Native (y más en esta arquitectura de archivo único o componentes limpios ), la forma más elegante, rápida y nativa de hacer una ayuda , sin complicarnos con librerías pesadas de navegación, es usar un `Modal`.

El Modal es un componente nativo de React Native que levanta una pantalla por encima de la aplicación (como una tarjeta flotante o una ventana emergente) que viene perfecta para textos de ayuda, términos y condiciones o créditos.

Vamos a ver cómo implementarlo paso a paso en la cabecera:

## Paso 1: Crear el estado de control

## Primero, en tu archivo principal (App.js), necesitas un interruptor (booleano) para saber si la ventana de ayuda debe estar abierta o cerrada. Añade este useState arriba junto a los demás:

```jsx
// Estado para controlar si el Modal de ayuda está visible o no
const [mostrarAyuda, setMostrarAyuda] = useState(false);
```

---

## Paso 2: El botón con tu icono ayuda.png en el título

En tu cabecera, donde reemplazaste el icono de la agenda por el de interrogación, envuelve tu componente de imagen (Image) o texto dentro de un `<TouchableOpacity>` para que reaccione al toque y encienda nuestro interruptor:

---

```jsx
<TouchableOpacity onPress={() => setMostrarAyuda(true)}>
  <Image
    source={require("../../assets/ayuda.png")}
    style={globalStyles.iconoAyuda} // O el estilo que tengas para tus iconos de cabecera
  />
</TouchableOpacity>
```

---

## Paso 3: El componente `<Modal>` (La ventana de ayuda)

Coloca este bloque de código abajo del todo en tu JSX, justo antes de cerrar el contenedor principal `<View style={globalStyles.container}>` y antes de la `<StatusBar />`.

No importa que esté abajo; al ser un Modal, React Native lo sacará a flote por encima de toda la agenda:

---

```jsx
import { Modal, ScrollView } from "react-native"; // ◄--- Asegúrate de importar Modal y ScrollView arriba
// ... (Tu código actual)
```

---

---

```jsx
{
  /* 🙋‍♂️ VENTANA EMERGENTE DE AYUDA */
}
<Modal
  animationType="slide" // Hace que la pantalla suba elegantemente desde abajo
  transparent={true} // Permite que el fondo de la app se intuya detrás con opacidad
  visible={mostrarAyuda}
  onRequestClose={() => setMostrarAyuda(false)} // Controla el botón "atrás" físico de Android
>
  <View style={styles.contenedorCentradoModal}>
    <View style={styles.tarjetaAyuda}>
      {/* Cabecera de la ventana de ayuda */}
      <View style={styles.cabeceraModal}>
        <Text style={styles.tituloModal}>❓ Guía de Uso Rápido</Text>
        <TouchableOpacity onPress={() => setMostrarAyuda(false)}>
          <Text style={styles.botonCerrarModal}>❌</Text>
        </TouchableOpacity>
      </View>

      {/* Cuerpo de la ayuda con Scroll por si el texto crece */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.subtituloAyuda}>🔤 Ordenación en Memoria</Text>
        <Text style={styles.textoAyuda}>
          Toca las flechas (↕) en la cabecera para alternar el orden de tus
          contactos de la A-Z o de la Z-A de forma instantánea.
        </Text>

        <Text style={styles.subtituloAyuda}>🔍 Búsqueda Inteligente</Text>
        <Text style={styles.textoAyuda}>
          Escribe en la barra superior. El filtro buscará simultáneamente por
          Nombre, Teléfono o las Notas que hayas guardado.
        </Text>

        <Text style={styles.subtituloAyuda}>📞 Llamadas Directas</Text>
        <Text style={styles.textoAyuda}>
          Puedes tocar directamente el número de teléfono subrayado en cualquier
          tarjeta para iniciar una llamada sin necesidad de expandirla.
        </Text>

        <Text style={styles.subtituloAyuda}>✏️ Gestión (CRUD)</Text>
        <Text style={styles.textoAyuda}>
          Usa el lápiz para editar los datos de un contacto o la cruz para
          eliminarlo de la base de datos de forma permanente.
        </Text>

        <Text style={styles.versionApp}>
          Versión 1.0.0 • Desarrollado por Félix C.
        </Text>
      </ScrollView>
    </View>
  </View>
</Modal>;
```

---

## Paso 4: Los Estilos para que quede espectacular

Añade estos estilos al final de tu archivo para darle ese look de "tarjeta flotante" moderna con fondo semitransparente:

---

```jsx
contenedorCentradoModal: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro semitransparente que resalta el modal
  padding: 20,
},
tarjetaAyuda: {
  backgroundColor: "#ffffff",
  borderRadius: 16,
  padding: 20,
  width: "90%",
  maxHeight: "80%", // Evita que se coma toda la pantalla en dispositivos pequeños
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5, // Sombra para Android
},
cabeceraModal: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottomWidth: 1,
  borderBottomColor: "#e2e8f0",
  paddingBottom: 12,
  marginBottom: 15,
},
tituloModal: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#1e3a8a",
},
botonCerrarModal: {
  fontSize: 18,
  padding: 4,
},
subtituloAyuda: {
  fontSize: 15,
  fontWeight: "600",
  color: "#1e40af",
  marginTop: 12,
  marginBottom: 4,
},
textoAyuda: {
  fontSize: 13,
  color: "#475569",
  lineHeight: 18,
  marginBottom: 8,
},
versionApp: {
  fontSize: 11,
  color: "#94a3b8",
  textAlign: "center",
  marginTop: 25,
  fontStyle: "italic",
},
```

---

Con esto, cuando el usuario pulse tu nuevo icono ayuda.png, la pantalla se oscurecerá sutilmente y emergerá una elegante ventana blanca con toda la documentación bien estructurada. Al pulsar la ❌, volverá a deslizarse hacia abajo y la agenda seguirá exactamente donde estaba.
