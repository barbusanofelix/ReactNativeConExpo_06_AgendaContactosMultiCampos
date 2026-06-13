Vamos a agregar un campo correo.
Es seguir los pasos que usamos para agregar Empresa.

El useState de contactoAEditar se recibe como una prop en ControlForm.js. Es decir, un valor de lectura.

Pasos basicos:

En FormControl.js

1. Agregar un UseState para el correo.
2. Agregar el campo correo y su cesta en el formulario.
3. Validacion y guardado

# 1. Agregar un useState para el correo del contacto.

Definimos el State de `correo`.
Cuando abrimos `ControlForm.js` , este recibe por prop `contactoAEditar` , es decir, parametro en la cabecera de la funcion:

---

```jsx
export default function ContactoForm({
  guardarContactoGlobal,
  contactoAEditar,
  cancelarMostrarFormYEdicion,
}) {.....
```

---

Entonces al crear el State correo, para que no genere error si la base de datos no incluia correo ( como ahora que lo estoy añadiendo) , le asignaremos:

- vacio si contactoAEditar esta vacio.
- Si contactoAEditar no es vacio, hacemos el chequeo sobre la existencia del correo (&& contactoAEditar.correo ), entonces si existe al estado le asignamos el correo : contactoAEditar.correo

---

```jsx
const [correo, setCorreo] = useState(
  contactoAEditar && contactoAEditar.correo ? contactoAEditar.correo : "",
);
```

---

# 2. Pintar el Input del Correo con su Cesta 🗑️

Baja en el return (dentro del ScrollView) y colócalo justo debajo de tu bloque de la Empresa. Reutilizaremos la misma estructura simétrica en fila:

---

```jsx
{/* ✉️ INPUT DEL CORREO ELECTRÓNICO CON BOTÓN DE ELIMINACIÓN */}
      <Text style={styles.label}>Correo Electrónico (Opcional):</Text>

      <View style={styles.contenedorInputAccion}>
        <TextInput
          style={styles.inputFlexible}
          placeholder="Ej: pepe.perez@correo.com"
          placeholderTextColor="#999"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address" // Muestra la '@' cómoda en el teclado de tu Samsung
          autoCapitalize="none"        // Evita mayúsculas automáticas molestas en correos
        />

        {/* Cesta de eliminación: Solo si el campo tiene texto */}
        {correo.trim() !== "" && (
          <TouchableOpacity
            style={styles.btnEliminarCampo}
            onPress={() => setCorreo("")}
          >
            <Text style={{ fontSize: 20 }}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
```

---

# ⏱️ GUARDADO DEL CORREO.

Para cerrar el ciclo del Correo, abre tu función `presionarGuardar` en el mismo formulario.
Busca el objeto que le envías al Padre y añádele el nuevo cable del correo limpio:

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
  // Vamos a hacerlo por parte
  // PRIMERO EL CONTACTO A PASAR:
  const contactoListo = {
    id: contactoAEditar ? contactoAEditar.id : Date.now().toString(),
    nombre: nombre.trim(),
    // 🌟 Buena práctica: Guardamos los números ya limpios sin espacios ocultos
    telefonos: telefonos.map((tel) => ({
      ...tel,
      numero: tel.numero.trim(),
    })),
    empresa: empresa.trim(), // EMPRESA_NUEVA_LINEA
    correo: correo.trim(), // Añadimos el correo
  };

  // Mandamos al Padre el cpontactoListo
  guardarContactoGlobal(contactoListo); //
};
```

---

# COMO VIAJE EL GUARDADO?

- En la vista, `ContactoForm` al pintar `<ContactoForm>` le pasamos la funcion del padre `guardarContactoGlobal` ( Que espera recibir cun contacto, que incluira el correo)

> > > > ⬇️

- En `ContactoForm` creamos un useState para el correo.

- En el padre tenemos la funcion `guardaContactoGlobal(contactoProcesado)` que claramente recibe UN contacto.
- El contactoProcesado ( el recibido ) lo adicionamos al estado `listaContactos[]`

> > > > ⬇️

- El cambio de estado dispara el useEffect GuardarContactosEnDisco

> > > > ⬇️

Cuando abrimos ContactoForm le pasamos la funcion de guardado del padre como una pro en la cabecera de ContactoForm :
`export default function ContactoForm({
  guardarContactoGlobal,
  contactoAEditar,
  cancelarMostrarFormYEdicion,
}) {`

> > > > ⬇️

Cuando oprimimos boton presionarguardar se activa esta función que dentro llama a `guardarContactoGlobal(contactoListo);,` siendo contactoListo la construccion del contacto ue se armó en el formulario.

> > > > ⬇️

- Lo anterior hace que regrese al Padre donde se actualiza contactoLista y se activa el useEffect, para grabar en el disco.
