Ya vimos que el titulo principal ( o cualquier otro donde queramos aplicar esta tecnica, que incluye cualquier elemento que renderizemos o pintemos en la pantalla) puede tener un gradiente.

Como por ejemplo el titulo CONTACTOS, que tiene un gradiente horizontal.
![alt text](image-17.png)

# COMO SE HACE UN GRAGIENTE DE COLORES Y SU IMPLEMENTACION DE DIFERENTES MANERAS:

- Implementacion explicita ( Escribiendo mucho codigo en el render)
- Usando un `objeto de configuracion`
- Usando un componente.

# PASOS COMUNES : INSTALAR LIBRERIA E IMPORTAR LinearGradient DE expo--linear-gradient

### 1. Instalar la libreria LinearGradient

---

```bash
npx expo install expo-linear-gradient
```

---

- 💡 ¿Por qué npx expo install y no npm install?
  > Porque el comando de Expo revisa la versión exacta de tu SDK y descarga la versión de expo-linear-gradient que no va a romper nada en tu móvil Samsung.

En el archivo que vayamos a implementar el Gradiente Lineal tenemos que importarlo:

### 2. Importar LinearGradient

---

```jsx
import { LinearGradient } from "expo-linear-gradient";
```

---

### 3. En la vista el LinearGradient sustituye el View del contenedor al cual queremos aplicar el LinearGradient.

    Este paso lo podemos observar en la propia implementacion de Gradiente en el siguiente ejemplo.
    El View que existia inicialmente esta comentado y el LinearGradient sustituye el View de apertura y el de cierre.

# IMPLEMENTACION EXPLICITA DEL LINEAL GRADIENTE ( LinearGradient )

Aqui tenemos un ejemplo :
Como vemos el LinearGradient lleva sus parametros de colores (colors) inicial y final, la posicion xy de inicio ( start) y el final ( end). Basicamente el LinearGradient , podriamos decir que es el background.
Luego el area misma, donde se aplica el LinearGradient tendra sus estilos ( En este ejemplo: styles.recuadroTituloModerno) y los textos que se renderizen tambien tienen sus propios estilos ( style={styles.emojisTitulo} y style={styles.textoTituloPrincipal} )

---

```jsx
<View style={styles.contenedorHeaderPrincipal}>
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={() => contactarme()} // <-- El "huevo de pascua"
  >
    {/* <View style={styles.recuadroTituloModerno}> */}
    <LinearGradient
      colors={["#1e3a8a", "#3b82f6"]} // Azul profundo a azul electrico
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }} // Gradiente horizontal elegante
      style={styles.recuadroTituloModerno}
    >
      <Text style={styles.emojisTitulo}>📇</Text>
      <Text style={styles.textoTituloPrincipal}>Contactos</Text>
    </LinearGradient>
    {/* </View> */}
  </TouchableOpacity>
</View>
```

---

# IMPLEMENTACION COMO UN OBJETO DE CONFIGURACION:

Un objeto de configuracion es basicamente una constante que tendra, en este caso, los atributos propios del LinearGradiente ( colors, start y end).

Podemos definirlo como una constante ubicada fuera de los bloques de la funcion principal del archivo, `export default App_V06() {}`, y los `const styles = StyleSheet.create({})`

ASI:

- Importante: Ahora como un objeto, en relacion a la forma explicita:
  - El objeto es clave:valor, no hay '=' y las propiedades ya no estan desagregadas con {} en cada una.

---

```jsx
const GRADIENTE_TITULO = {
  colors: ["#1e3a8a", "#3b82f6"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 }, // Gradiente horizontal elegante
};
```

---

Para implementarlo en el render:

---

```jsx
<LinearGradient {...GRADIENTE_TITULO} style={styles.recuadroTituloModerno}>
  <Text style={styles.emojisTitulo}>📇</Text>
  <Text style={styles.textoTituloPrincipal}>Contactos</Text>
</LinearGradient>
```

---

# IMPLEMENTAR UN COMPONENTE CON LinearGradient

Es la opcion más limpia para el codigo (Crear un Componente Contenedor)

Podeos crear un componente llamado, por ejemplo, CabeceraGradient (o meterlo en una carpeta de componentes compartidos):

Aplicacion de CabeceraGradient en el jsx ( Este caso en App_V06.js)

- Ponemos la etiquera `<CabeceraGradiente>`
  - Si vemos el archivo del componente , dice que tenndra hijos ( children) y stye
  - Children sera los Text que hemos envuelto ( Los toma automaticamente)
  - Style : Toma el Style con que acompañamos `<CabeceraGradient style={styles.recuadroTituloModerno}>`

```jsx
<CabeceraGradient style={styles.recuadroTituloModerno}>
  <Text style={styles.emojisTitulo}>📇</Text>
  <Text style={styles.textoTituloPrincipal}>Contactos</Text>
</CabeceraGradient>
```

---

Y el codigo de CabeceraGradient es : ( Su ubicación seria src/coponents/CabeceraGradient.js)
y para usarlo pues lo importamos :

```jsx
import CabeceraGradient from "../components/CabeceraGradient";
```
---

---

```jsx
/ CabeceraGradient.js
import React from "react";
// Antes hay que instalar la libreria en el proyecto: "npx expo install expo-linear-gradient"
import { LinearGradient } from "expo-linear-gradient";

// Children son los hijos que envolvera CabeceraGradient
// style: Lee el style junto a la llamada de CabeceraGradient
export default function CabeceraGradient({ children, style }) {
  return (
    <LinearGradient
      colors={["#1e3a8a", "#3b82f6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={style}
    >
      {/*  Aqui estaran los hijos , que son las etiuetas envueltas por CaberaGradient */}
      {children}
    </LinearGradient>
  );
}
```
---
