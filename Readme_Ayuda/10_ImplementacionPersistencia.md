# 🪜 El Guardado Persistente en Disco (AsyncStorage)

Ahora que tenemos la V03 blindada en interfaz, diseño simétrico y validaciones, estamos listos para resolver la última gran pieza de esta versión: conseguir que los contactos no se borren al cerrar la aplicación.

En el código de App_V02.js ya dejé un comentario que decía:

// Actualizamos la lista... el useEffect se encargará de guardar en disco

Vamos a hacer exactamente eso realidad dentro de tu App_V03.js.

## 📦 1. Instalación del módulo nativo para Persistencia

Para trabajar con el almacenamiento local en Expo, se utiliza la librería oficial de la comunidad. En tu terminal de VS Code (con el servidor de Expo corriendo o pausado, no importa), ejecuta este comando para instalarlo de forma segura:

Solo si ya no lo habiamos hecho ( al inicio de este proyecto, al preparar el entorno, lo hicimos)

```Bash
npx expo install @react-native-async-storage/async-storage
```

(Usar npx expo install es la mejor práctica porque Expo busca automáticamente la versión exacta que es 100% compatible con tu entorno).

## 🛠️ 2. Implementación de la Persistencia en App_V03.js

Abre el archivo src/versionesApps/App_V03.js.
Vamos a importar el módulo en la parte superior y a cablear dos efectos (useEffect): uno para cargar los datos cuando el móvil abre la app y otro para guardar cada vez que la lista de contactos mute.

### Paso A: Importar los módulos necesarios

Añade useEffect en tu importación de React e importa AsyncStorage:

---

```jsx
import React, { useState, useEffect } from "react"; // ◄--- Añadimos useEffect
// ... tus otros imports de react-native ...
import AsyncStorage from "@react-native-async-storage/async-storage"; // ◄--- Importamos el disco
```

---

### Paso B: Inyectar la lógica de persistencia dentro de App_V03

Coloca estos dos bloques de efectos justo debajo de la definición de tus estados iniciales (donde tienes listaContactos, mostrarFormulario, etc.):

---

```jsx
  // 🔑 Clave única para identificar los datos de nuestra agenda en el disco del móvil
  const STORAGE_KEY = "@agenda_multicampos_v03";

  // 📥 EFECTO 1: Cargar los contactos del disco cuando la App se arranca por primera vez
  useEffect(() => {
    const cargarContactosDelDisco = async () => {
      try {
        const datosSerializados = await AsyncStorage.getItem(STORAGE_KEY);
        if (datosSerializados !== null) {
          // Si había datos guardados, los transformamos de texto a Array de objetos de JS
          setListaContactos(JSON.parse(datosSerializados));
        }
      } catch (error) {
        Alert.alert("Error de lectura", "No se pudieron cargar los contactos guardados.");
        console.log("Error al leer de AsyncStorage:", error);
      }
    };

    cargarContactosDelDisco();
  }, []); // Array vacío = Solo se ejecuta una vez al montar el componente

  // 📤 EFECTO 2: Guardar automáticamente en el disco cada vez que la lista cambie
  useEffect(() => {
    const guardarContactosEnDisco = async () => {
      try {
        // Transformamos el Array de objetos a una cadena de texto plana (JSON)
        const datosSerializados = JSON.stringify(listaContactos);
        await AsyncStorage.setItem(STORAGE_KEY, datosSerializados);
      } catch (error) {
        Alert.alert("Error de guardado", "Los cambios no se pudieron escribir en el almacenamiento.");
        console.log("Error al escribir en AsyncStorage:", error);
      }
    };

    guardarContactosEnDisco();
  }, [listaContactos]); // Se dispara mágicamente CADA VEZ que 'listaContactos' mute (crear, editar o borrar)


🧠 ¿Por qué usamos JSON.parse y JSON.stringify?
El almacenamiento local AsyncStorage es un sistema de tipo clave-valor muy simple que solo sabe guardar texto plano (strings). No entiende qué es un objeto de JavaScript ni mucho menos un array anidado de teléfonos.

JSON.stringify(listaContactos): Actúa como una máquina empacadora al vacío. Toma todo tu árbol complejo de contactos y lo convierte en una sola línea de texto larga. Eso es lo que se guarda en el chip de memoria.

JSON.parse(datosSerializados): Hace el proceso inverso al abrir la app. Toma esa línea de texto larga y la reconstruye en memoria RAM devolviéndote tus objetos y arrays listos para ser mapeados en la FlatList.

🏁 La Prueba de Fuego Final de la V03
Guarda los cambios en tu código.

Abre la aplicación en el movil.

Agrega un contacto nuevo (ej: "Carlos Pruebas") con un par de números válidos y dale a Guardar.

Ahora, cierra la aplicación por completo (mándala a volar desde el gestor de aplicaciones abiertas de Android).

Vuelve a abrir tu aplicación desde Expo.

Si todo el cableado está bien hecho, tu FlatList arrancará mostrando inmediatamente a "Carlos Pruebas" y los contactos iniciales que tenías en el estado, demostrando que tu base de datos local es 100% funcional.

Prueba el guardado y el cierre completo de la app y confírmame si tus contactos sobreviven al reinicio.
```
