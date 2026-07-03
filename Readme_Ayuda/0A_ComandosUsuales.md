# CORRER UN PROYECTO EN EXPO

1. Nos colocamos en la carpeta raiz del proyecto.

```bash

npx expo start

```

---

2. Si el proyecto no se abre en el movil o se queda tratando de abrir usamos:

---

```bash

npx expo start --tunnel
```

---

A veces genera un error como a continuacion....simplemente hacemos [Ctrl] [C] y volvemos a intentar:`npx expo start`

---

```bash
npx expo start --tunnel
Starting project at E:\React Native Con Expo\ProyectosReactNativeConExpo\06_AgendaContactosMultiCampos
Starting Metro Bundler
CommandError: failed to start tunnel

remote gone away
```

---

# PUERTO 8081 OCUPADO.

1. Ubicamos que proceso lo esta ocupando:

```bash

netstat -ano | findstr :8081
```

Mostrara que proceso esta LISTENNING el 8081 => Un numero PID 6976

2. Matamos el proceso que ocupa el puerto 8081

Susituimos el 6976, por el número que arroje

---

```bash

taskkill /PID 6976 /F
```

---

# CREAR UN PROYECTO EXPO

- Crea las carpetas de un proyecto Expo.
- Si añadimos al final `--template blank` lo creara con App.js y para javaScript
- Sino se coloca el --template blank lo crea para TypeScript y no crea App.js en la raiz sino carpetas y archivos con extension .jsx

---

```BASH

npx create-expo-app 06_AgendaContactosMultiCampos --template blank
```

---

# INSTALAR LIBRERIA PARA LA BASE DE DATOS ( TEXTO PLANO)

---

```bash

npx expo install @react-native-async-storage/async-storage
```

---

# COMANDO DE LIMPIEZA DE CACHE DE EXPO

Se usa para limpiar el cache de expo.
Por ejemplo , cuando cambiamos el json.

---

```BASH
npx expo start -c
```

---
