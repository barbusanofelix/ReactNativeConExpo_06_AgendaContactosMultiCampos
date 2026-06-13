# 🧠 El Planteamiento Lógico para Validar el Correo

Al igual que hicimos con los números de teléfono, la forma más precisa y profesional de verificar si un correo está bien escrito (es decir, que tenga letras, un símbolo de @, más letras, un punto . y una extensión como com o es) es utilizando una Expresión Regular (RegEx).

Sin embargo, tenemos una regla de negocio clave: `El correo es opcional`.

Por lo tanto, nuestra lógica en presionarGuardar debe razonar de la siguiente manera:

Si el campo está completamente vacío, no validamos nada y dejamos pasar el guardado (porque es opcional).

Si el usuario escribió aunque sea una sola letra, entonces sí activamos la validación estricta. Si no cumple con el formato, frenamos el guardado con un Alert.alert y un return.

# USO DE EXPRESION REGULAR:

## 🕵️‍♂️ Radiografía de la RegEx de Correo

---

```
/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
```

---

#### A la izquierda del @ (^[a-zA-Z0-9._%+-]+):

- Permite minúsculas (a-z), mayúsculas (A-Z), dígitos (0-9), y los caracteres especiales punto (.), guion bajo (\_), porcentaje (%), más (+) y guion medio (-).
- El símbolo + al final de los corchetes significa "al menos un carácter obligatorio".

#### A la derecha del @ y antes del punto ([a-zA-Z0-9.-]+):

- Permite minúsculas, mayúsculas, dígitos, el punto y el guion medio (por ejemplo, para dominios como mi-empresa).

El punto intermedio (\.):

- Como en las expresiones regulares el punto por sí solo significa "cualquier carácter", la barra invertida \ sirve para "escaparlo". Así le decimos al motor: "aquí va un punto real estrictamente".

#### Después del punto final ([a-zA-Z]{2,}):

- Permite minúsculas o mayúsculas.
- El cuantificador {2,} significa "mínimo 2 letras en adelante" (sin límite superior). Esto valida extensiones cortas como .es, .co, tradicionales como .com, .net, o más largas y modernas como .online, .agency.

### 📋 Ejemplos de lo que tu regla acepta y rechaza:

carlos.12+prod@mi-empresa.com ➔ VÁLIDO (Usa el . y el + a la izquierda, guion a la derecha y extensión de 3 letras).

ana@gmail.c ➔ RECHAZADO (Falla en el {2,} porque la extensión solo tiene 1 letra).

pepe@gmail. ➔ RECHAZADO (No hay nada después del punto).

@empresa.com ➔ RECHAZADO (Falla el lado izquierdo del @).

# 🛠️ El Lineamiento para presionarGuardar

Para implementar esto, debes ir a tu función presionarGuardar e inyectar este bloque justo debajo de donde termina tu bucle for que valida los teléfonos (y antes de que se dispare guardarContactoGlobal).

Aquí tienes el mapa exacto de cómo estructurarlo:

---

```jsx
// ... (Aquí atrás está tu bucle 'for' que valida las etiquetas y números de teléfono)

// ✉️ EXPRESIÓN REGULAR PARA CORREO ELECTRÓNICO ESTÁNDAR
const regexCorreoValido = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const correoLimpio = correo.trim();

// 🎯 REGLA: Solo validamos si el usuario escribió algo en el campo
if (correoLimpio !== "") {
  if (!regexCorreoValido.test(correoLimpio)) {
    Alert.alert(
      "Error de Formato",
      "El correo electrónico ingresado no es válido.\n\nEjemplo correcto: usuario@dominio.com",
    );
    return; // 🛑 Frenamos el guardado de inmediato si el correo está mal escrito
  }
}

// Si pasa todas las reglas (Nombre, Teléfonos y Correo), disparamos el guardado:
guardarContactoGlobal({
  id: contactoAEditar ? contactoAEditar.id : Date.now().toString(),
  nombre: nombre.trim(),
  telefonos: telefonos.map((tel) => ({ ...tel, numero: tel.numero.trim() })),
  empresa: empresa.trim(),
  correo: correoLimpio, // Lo pasamos ya limpio de espacios residuales
  direccion: direccion.trim(),
  // notas: notas.trim(), <-- Aquí conectarás tu campo de notas cuando lo termines
});
```

---

# 🚀 Tu Turno de Trabajo

Ahora el balón está en tu tejado. Haz lo siguiente en tu laboratorio:

Modifica tu presionarGuardar para meter este bloque de validación del correo.

Construye por completo el campo Notas (Estado inicial, Input en el return con su cesta, su estilo de altura y su cableado en el objeto final de guardado).

Tómate tu tiempo, haz las pruebas de escritura y guardado en tu Samsung A34, verifica que el validador del correo salte si escribes algo como "pepe@correo" (sin el punto com) y, en cuanto lo tengas todo blindado y operando, me avisas para que pasemos al gran cierre de la V05: ¡Hacer que la tarjeta del contacto (ContactoCard.js) pinte todos estos nuevos datos de forma elegante!
