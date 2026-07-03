# 📱 Cómo cambiar el nombre de la App en el móvil y configurar el Icono

Es completamente normal que en tu primer ejercicio te saliera el nombre de la carpeta (05_AgendaContactos).
Por defecto, si no se le indica lo contrario, Expo toma el nombre del directorio del proyecto para mostrarlo debajo del icono en la pantalla de inicio del teléfono.

Para cambiar esto y hacer que aparezca elegantemente "Contactos", todo se centraliza en un archivo único de configuración que está en la raíz de tu proyecto: `el archivo app.json.`

# 🛠️ Paso a paso en tu app.json

Abre el archivo app.json que tienes en la carpeta principal de tu proyecto. Verás una estructura de objeto JSON. Lo único que tienes que hacer es editar las propiedades name e icon para que queden así:

---

```json
{
  "expo": {
    "name": "Contactos",
    "slug": "06_AgendaContactosMultiCampos",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon.png",
        "backgroundColor": "#ffffff"
      }
    }
  }
}
```

---

# 💡 Puntos clave a revisar:

- La propiedad "name":
  Aquí es donde pones "Contactos". Este es el texto sagrado que leerá Android o iOS para colocar justo debajo del icono en el menú del teléfono.

- La propiedad "slug":
  Esta déjala como está (suele ser el nombre interno del proyecto en los servidores de Expo, sin espacios ni caracteres especiales).

- Ruta del Icono ("icon" y "foregroundImage"):
  Asegúrate de que la ruta apunte correctamente a donde guardaste tu archivo. Si tu carpeta se llama assets (con una sola 's', como viene por defecto en Expo), la ruta es ./assets/icon.png.

Ojo: Vi en tu código anterior un pequeño error de dedo al escribir require("../assets/...") con doble 's' intermedia (assests). Asegúrate de que en el app.json esté escrito correctamente según el nombre real de tu carpeta (assets).

Una vez que guardes los cambios en el app.json, cierra por completo el servidor de Metro en tu terminal (Ctrl + C) y vuelve a lanzarlo con:

```Bash
npx expo start -c
```

Al recargar la app en tu dispositivo con la caché limpia, Expo aplicará la nueva configuración, modificará los metadatos y verás nacer tu aplicación con su nombre definitivo y su flamante nuevo icono. ¡Ya casi la tienes lista para presumir!

# json para el nombre correcto del proyecto y adaptado a la version sdk54: La solución: El app.json definitivo y corregido

Para borrar esas advertencias de la pantalla y asegurarte de que el nombre de tu aplicación cambie oficialmente a "Contactos", reemplaza por completo el contenido de tu archivo app.json por este bloque limpio y adaptado a la estructura nativa de Expo:

```json
{
  "expo": {
    "name": "Contactos",
    "slug": "06_AgendaContactosMultiCampos",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon.png",
        "backgroundColor": "#ffffff"
      }
    }
  }
}
```

---

# ⚡ Pasos obligatorios tras guardar el archivo:

Como has modificado metadatos estructurales de la app (cambio de carpetas físicas de iconos y el archivo app.json), el servidor Metro que tienes abierto en segundo plano no se va a enterar por sí solo. Sigue estos tres pasos en tu terminal para forzar el cambio:

- Haz clic en la terminal de VS Code y pulsa Ctrl + C para apagar el servidor actual.

- Ejecuta este comando para borrar el almacenamiento temporal viejo:

```Bash
npx expo start -c
```

Cuando aparezca el código QR, abre la app de Expo en tu Samsung y recarga el proyecto.

Al iniciar el servidor con la opción -c (limpieza de caché), la aplicación adoptará la nueva ruta interna de los iconos y, cuando salgas al menú principal de tu teléfono móvil, verás que el nombre del acceso directo se habrá actualizado mágicamente a "Contactos". ¡Pruébalo y me cuentas si se te vació la lista de advertencias en el editor!
