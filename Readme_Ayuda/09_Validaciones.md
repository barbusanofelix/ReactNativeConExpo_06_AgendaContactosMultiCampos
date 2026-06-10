# 🪜 Etapa 4: Validaciones en Bucle para Arrays Dinámicos
## 🧠 El Desafío de esta Etapa
Validar un formulario tradicional es fácil: 
Tienes un estado nombre y un estado telefono, y haces un par de if. Pero ahora tenemos un escenario más avanzado y profesional: el usuario puede crear múltiples filas de teléfonos, y necesitamos revisar todas y cada una de ellas antes de permitir que el paquete viaje al Padre.

Queremos asegurar tres reglas de oro:
* El campo del Nombre no puede estar vacío.
* Ninguna fila de teléfono puede quedarse con el campo vacío.
* Los números deben cumplir con un formato limpio (solo números, permitiendo el signo + al principio por si hay prefijos internacionales).

## 🛠️ Modificación en src/components/ContactoForm.js
Para lograr esto, vamos a transformar por completo la función encargada de reaccionar al botón de Guardar. Abre tu archivo ContactoForm.js y localiza la función que dispara el guardado: ``presionarGuardar`` 

Para robustecer esta validación dentro de tu función presionarGuardar e incorporar la expresión regular (para validar que solo entren números de entre 6 y 15 dígitos, permitiendo el + internacional), lo único que debemos hacer es añadir la regla dentro del bucle que ya construiste.

Aquí tienes la actualización exacta de la función presionarGuardar adaptada al 100% a tu archivo:

---
```jsx
   // 💾 Lógica al presionar Guardar
  const presionarGuardar = () => {
    if (nombre.trim() === "") {
      Alert.alert("Error", "El nombre es obligatorio.");
      return;
    }

    // 🔢 Expresión regular: Permite un '+' opcional al inicio, seguido de entre 6 y 15 números estrictos.
    const regexTelefonoValido = /^\+?[0-9]{7,15}$/;

    // Validación interna en bucle para comprobar que ningún teléfono esté vacío o sea inválido
    for (let tel of telefonos) {
      const numeroLimpio = tel.numero.trim();

      // Regla A: Comprobar si el campo está vacío (Tu validación original)
      if (numeroLimpio === "") {
        Alert.alert(
          "Error",
          `El campo de teléfono con etiqueta [${tel.etiqueta}] está vacío.`,
        );
        return;
      }

      // Regla B: 🌟 NUEVA: Comprobar si cumple con el patrón numérico estricto
      if (!regexTelefonoValido.test(numeroLimpio)) {
        Alert.alert(
          "Error",
          `El número ${numeroLimpio},  con etiqueta [${tel.etiqueta}] no es válido.\n\n` +
            `Asegúrate de usar 7 a 15 dígitos, opcionalmente con + al inicio.`,
        );
        return; // 🛑 Frenamos el guardado de inmediato si falla el formato
      }
    }

    // Si pasa las reglas, disparamos el guardado hacia el Padre
    onGuardarContacto({
      id: contactoAEditar ? contactoAEditar.id : Date.now().toString(),
      nombre: nombre.trim(),
      // 🌟 Buena práctica: Guardamos los números ya limpios sin espacios ocultos
      telefonos: telefonos.map((tel) => ({
        ...tel,
        numero: tel.numero.trim(),
      })),
    });
  };
```
---

¿Qué cambia con este ajuste en tu código?
Tu bucle original ya controlaba el flujo perfectamente usando el return como freno. Ahora, simplemente aprovecha el mismo recorrido de cada tel para comprobar si el formato es correcto usando .test(numeroLimpio).

Si el usuario añade tres números de teléfono y el segundo tiene letras o espacios, el bucle se detendrá ahí mismo, mostrará la alerta especificando cuál etiqueta falló y evitará que se envíe información corrupta a onGuardarContacto.
=======


🧠 ¿Cómo funciona este "Freno de Mano" en Bucle?
Usar un bucle for...of combinado con la palabra clave return es una de las técnicas de control de flujo más limpias que existen.

En lugar de hacer lógicas complejas con banderas booleanas, el procesador de tu móvil va leyendo las filas una a una. Si el contacto tiene 5 teléfonos y el tercero está vacío, el bucle evalúa la fila 3, entra en el if, dispara el Alert.alert y el return actúa como un freno de mano absoluto: rompe el bucle y la función se muere en ese mismo instante. El Padre jamás se entera de que intentaron guardar datos corruptos.

