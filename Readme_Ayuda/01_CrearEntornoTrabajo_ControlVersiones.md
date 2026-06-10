[Avanzar a: 02_EstilosCentralizados_globalStyles](02_EstilosCentralizados_globalStyles.md)

# 🚀 El Primer Paso: Crear el Lienzo en Blanco
Para arrancar con este nuevo proyecto con total paciencia y orden, lo primero es generar la estructura limpia desde tu terminal.

Abrimo la terminal (la consola de comandos o la terminal integrada de VS Code en la carpeta raíz del  proyectos).

Ejecuta el comando oficial para crear el nuevo proyecto con la última versión de Expo:

```Bash
npx create-expo-app 06_AgendaContactosMultiCampos --template blank
```

Una vez que termine de descargar las carpetas iniciales, entra en el nuevo directorio:

```Bash
cd 06_AgendaContactosMultiCampos
```

Instala la librería de almacenamiento persistente para dejar el entorno listo:

```Bash
npx expo install @react-native-async-storage/async-storage
```
---

# CONTROL DE VERSIONES DE APPS
Para llevar el control de versiones de la App.js ( el archivo principal, el motor - punto de entrada, ubicado en la raiz) usare el concepto de renderizar un componente. Es decir, cada version de App.js será un componente como tal y lo renderizaremos en la App.js de la raiz..

* El App.js, en la raiz, sera  solo un puente para cargar las versiones. El codigo sera simplemente:
  * Una importacion de la version ubicada en la carpeta src/versionesApps
    * En el inicial importamos "./src/versionesApps/App_V00", es decir la App_V00.js es la version inical.
* Simplemente la funcion principal de App.js renderiza el componente AppV00.js en `return <MiVersionActual />;`
* Segun vayamos cambiando las versiones pues importaremos la App_V01.js , la App_V02, ña App_V03.js....

---
```jsx
// App.js, ubicado en la raiz del proyecto:  dominio principal de versiones
import MiVersionActual from "./src/versionesApps/App_V01"; // Version inicial

export default function App() {
  return <MiVersionActual />;
}
```
---

# 🧠 DEFINIMOS UNA listaContactos ESTATICA CON LA FILOSOFICA DE MAS DE UN TELEFONO.
Empecemos modificando el archivo principal App.js de este nuevo proyecto, pero enfocado únicamente en cómo se va a ver nuestra base de datos simulada (el estado inicial).

Antes, la lista de contactos de prueba se veía así:

```jsx
// El pasado en 05_AgendaContactos (Estructura Plana)
{ id: "1", nombre: "Ana Pérez", telefono: "600000000" }
```

En ``06_AgendaContactosMultiCampos``, la RAM de tu aplicación debe entender que un contacto tiene una colección de teléfonos. Para lograrlo de forma ultra organizada, cada teléfono dentro del array tendrá su propio id único (para poder borrarlos o editarlos individualmente dentro del formulario más adelante), una etiqueta y el numero.

Vamos a dejar el nuevo App.js preparado con esta nueva filosofía de datos en su estado inicial. 
Reemplazemo el contenido de tu nuevo App.js por este bloque limpio de partida.
Al useState le asignamos directamente el nuevo array donde el campo telefonos tambien es un array.

```jsx
// App_V01.js
// App.js en 06_AgendaContactosMultiCampos
import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function App() {
  // NUEVO MODELO DE DATOS: Array de objetos con sub-arrays de teléfonos
  const [listaContactos, setListaContactos] = useState([
    {
      id: "1",
      nombre: "Ana Pérez",
      telefonos: [
        { id: "t1", etiqueta: "Móvil", numero: "600000000" },
        { id: "t2", etiqueta: "Trabajo", numero: "910000000" }
      ]
    },
    {
      id: "2",
      nombre: "Román",
      telefonos: [
        { id: "t3", etiqueta: "Personal", numero: "541236" }
      ]
    }
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📒 Agenda Multi-Campos (Evolución)</Text>
      
      {/* De momento dejamos este texto para verificar que el proyecto arranca */}
      <Text style={{ textAlign: 'center', marginTop: 20 }}>
        Proyecto 06 creado con éxito. Estructura de datos lista en memoria RAM.
      </Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 20,
  },
});
```
---

🏁 ¿Qué hacemos ahora?
Con la carpeta del nuevo proyecto 06_AgendaContactosMultiCampos iniciada, pegamos este código base en App.js ( ubicado en la raiz del proyecto) y levantamos el servidor de desarrollo en la terminal con ``npx expo start`` para verificar que el proyecto en blanco corre perfectamente en Expo Go.

Exito:
![Primera corrida : Aun no muestra la lista estatica](<WhatsApp Image 2026-06-06 at 2.34.23 AM.jpeg>)

# 🏛️ VISION DE LA ARQUITECTURA QUE USAREMOS EN LA APLICACION: El enfoque de "Pantalla de Detalle" ( Hacia donde vamos?)
En la aplicación anterior, ( Agenda de contacto con 1 telefono por Contacto) metíamos todo en la pantalla principal: el formulario de adicion/edicion aparecía arriba, la lista abajo y las tarjetas mostraban toda la información disponible ( Nombre y telefono ). 
Eso funcionaba bien para un solo teléfono, pero con múltiples teléfonos, correos y empresas, la pantalla principal se volvería caótica, muy larga y difícil de gestionar.

Para ir paso a paso, aprendiendo de verdad y con paso firme, te adoptaremos el estándar de la industria que es mostrar un resumen por contacto y al pincharlo mostrar todos los detalles de ese contacto.
Vamos a estructurar la evolución de la aplicación en dos etapas lógicas:

🔹 Etapa 1 (Nuestro punto de partida actual): 
Tarjetas dinámicas pero compactas
Mantendremos la estructura de una sola pantalla por ahora para dominar la lógica de los arrays dinámicos.

La tarjeta (ContactoCard) mostrará el nombre y la lista completa de sus teléfonos uno debajo del otro de forma elegante.

El formulario aprenderá a añadir renglones de teléfonos de forma dinámica.

Esto nos permite concentrarnos al 100% en la lógica de los datos de JavaScript sin añadir la complejidad de configurar sistemas de navegación por pantallas (como React Navigation), que requiere instalar muchas librerías nuevas.

🔹 Etapa 2 (Siguiente reto futuro): 
Navegación y Pantalla de Detalle.
Una vez que dominamos cómo guardar, editar y persistir múltiples teléfonos y correos en la base de datos local, daremos el salto definitivo: aprenderemos a pasar de una pantalla a otra. Al pinchar en la tarjeta compacta, se abrirá una hermosa pantalla completa con todo el expediente del contacto.

# ⚙️ CREAR ESTRUCTURA DE CARPETAS PARA EL PROYECTO y CONTROL VERSIONES
Para trabajar con buenas prácticas, vamos a crear la estructura de carpetas profesional. En el proyecto 06_AgendaContactosMultiCampos, creamos la siguiente estructura dentro de la raíz:

---
```txt
06_AgendaContactosMultiCampos/
├── src/
│   ├── components/
│   │   ├── ContactoCard.js
│   │   └── ContactoForm.js
│   ├── styles/
│   │   └── globalStyles.js
│   └── versionesApps/
│       └── App_v01.js  <-- Aquí guardaremos el motor de cada etapa
```
---

Empecemos creando el archivo de estilos centralizado para que no haya líneas repetidas, y luego preparemos la tarjeta capaz de leer múltiples teléfonos.

# 🏁 CONTROL DE VERSIONES
Para aplicar el control de versiones de App, vamos al archivo principal App.js (el que está en la raíz de tu proyecto) y lo modifícamos para que actúe como un "conmutador o apuntador" limpio que llama a la versión en desarrollo. 

Así:

```JavaScript
// App.js (Raíz del proyecto 06)
// Desde aquí apuntamos a la versión del tutorial que queremos probar en el móvil
import App_v01 from "./src/versionesApps/App_v01";

export default function App() {
  return <App_v01 />;
}
```
---

# VERSION App_V01.js:
Para terminar el set de preparación, vamos a ``src/versionesApps/``, creamos el archivo: ``App_V01.js`` y pegamos el siguiente código: 

```jsx
// App_V01.js en 06_AgendaContactosMultiCampos: Version Inicial
import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function App() {
  // NUEVO MODELO DE DATOS: Array de objetos con sub-arrays de teléfonos
  const [listaContactos, setListaContactos] = useState([
    {
      id: "1",
      nombre: "Ana Pérez",
      telefonos: [
        { id: "t1", etiqueta: "Móvil", numero: "600000000" },
        { id: "t2", etiqueta: "Trabajo", numero: "910000000" },
      ],
    },
    {
      id: "2",
      nombre: "Román",
      telefonos: [{ id: "t3", etiqueta: "Personal", numero: "541236" }],
    },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📒 Agenda Multi-Campos (Evolución)</Text>

      {/* De momento dejamos este texto para verificar que el proyecto arranca */}
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        Proyecto 06 creado con éxito. Estructura de datos lista en memoria RAM.
      </Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 20,
  },
});

```
---

Avísame cuando tengas creados los archivos de estilos, la tarjeta multi-teléfono y tu apuntador de versiones configurado. Con eso listo y verificado en tu pantalla, pasaremos a diseñar el Paso 3: el formulario dinámico con la capacidad de inyectar renglones. ¡Vamos sin prisa pero con paso firme!


[Avanzar a: 02_EstilosCentralizados_globalStyles](02_EstilosCentralizados_globalStyles.md)






