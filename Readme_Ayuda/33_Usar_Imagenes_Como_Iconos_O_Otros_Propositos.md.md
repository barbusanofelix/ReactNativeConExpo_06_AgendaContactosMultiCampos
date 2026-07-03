# PLANTEAMIENTO

Con 🪟 + "." ( Windows y presionar . se abre emoji y mas) podemos usar iconos predefinidos como ❓, ℹ️, 🗑️,➕, ❌, ✏️, 🔍...... Ahora bien, si tememos una imagen .png la podemos usar tambien, independiente del tamaño original.

## 🧠 El secreto técnico: Las dimensiones reales vs. El tamaño en pantalla de una imagen

Aunque tengamos un archivo original con 512 x 512 píxeles, en el desarrollo móvil, es una excelente práctica usar imágenes de alta resolución (como 512x512) para iconos pequeños.

Al renderizar un archivo de alta resolución en un espacio pequeño (por ejemplo, 24 x 24), el procesador del movil aplica un filtro de escalado que hace que el icono se vea increíblemente nítido, definido y sin píxeles borrosos (evitando el efecto "borroso" en pantallas de alta densidad).

## 🛠️ Cómo se implementa el usar una imagen en el código

Para usar una imagen en lugar de un texto con emoji, cambiamos el componente `<Text>` por el componente nativo `<Image>` de React Native.

- Paso 1: Importar Image
  Asegúrate de tener Image en tus importaciones de react-native:

---

```jsx
import { View, Text, TouchableOpacity, Image } from "react-native";
```

---

- Paso 2: Guardar el archivo
  Colocamos el archivo del icono, ejemplo ayuda.png (o contacto.png) dentro de la carpeta de recursos, por ejemplo en src/assets/iconos/.

- Paso 3: Reemplazar el emoji en tu JSX
  Vamos a meter el icono de ayuda en la esquina superior derecha del título "Contactos". Tu estructura quedaría así de limpia:

````jsx
<View style={styles.recuadroTituloModerno}>
  {/* Icono izquierdo del título (sustituyendo al emoji de la tarjetita) */}
  <Image
    source={require('../assets/iconos/contacto.png')}
    style={styles.iconoPngTitulo}
  />

  <Text style={styles.textoTituloPrincipal}>Contactos</Text>

  {/* 🎯 Icono derecho de ayuda interactivo (sustituyendo al ❓) */}
  <TouchableOpacity
    onPress={() => mostrarFirmaCreditos()}
    style={styles.btnAyudaFlotante}
  >
    <Image
      source={require('../assets/iconos/ayuda.png')}
      style={styles.iconoPngAyuda}
    />
  </TouchableOpacity>
</View>
🎨 Las reglas de estilo para domar el PNG
Para que tu imagen de 512 x 512 se comporte como un icono pequeño y estilizado, le aplicamos las dimensiones deseadas en el StyleSheet.

Es obligatorio darle un ancho (width) y un alto (height) a las imágenes locales en React Native, de lo contrario no se mostrarán en pantalla:

---
```jsx
  recuadroTituloModerno: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Mantiene el texto centrado
    position: 'relative',    // Nos permite posicionar el botón de ayuda de forma absoluta
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 14,
  },
  iconoPngTitulo: {
    width: 26,             // Redimensionamos el PNG de 512 a un tamaño óptimo
    height: 26,
    marginRight: 10,
    resizeMode: 'contain', // Asegura que la imagen no se deforme ni se estire
  },
  btnAyudaFlotante: {
    position: 'absolute',  // Lo clavamos en la esquina derecha sin mover el texto del centro
    right: 14,
    padding: 4,            // Zona táctil extra alrededor del icono para comodidad del dedo
  },
  iconoPngAyuda: {
    width: 22,             // Un poco más pequeño y discreto para la esquina
    height: 22,
    resizeMode: 'contain',
    tintColor: '#ffffff',  // 🔥 ¡TRUCO MAGNÍFICO! Si tu PNG es negro o gris, esta línea
                           // lo tiñe instantáneamente de blanco puro para que combine con tu título.
  },
````

---

## 💡 Un consejo de diseño para tu barra azul

Al aplicar la caja azul con gradiente, si usamos un PNG transparente de ayuda (que solo sea la silueta del círculo con el signo de interrogación), al usar tintColor: '#ffffff', el icono se volverá blanco brillante automáticamente, integrándose de forma preciosa con el fondo tecnológico.
Es decir, ponerle el tintColor:'#ffffff' , funciona muy bien para icono de silueta. Si el icono tiene detalles de colores , se perderan pues todo se pondran blanco o del tintColor que usemos.
