# PLANTEAMIENTO

## 🧠 Una direccion es muy larga como para hacer el campo de una sola linea. Dirección Multilínea:

Para que un campo de dirección sea cómodo en un móvil, no nos sirve un input de una sola línea donde el texto se desborda horizontalmente y el usuario deja de ver lo que escribió al principio. Queremos que si la dirección es larga (por ejemplo: "Calle Sierpes 14, Piso 3ºA, CP 41004, Sevilla"), el texto salte de línea automáticamente hacia abajo, como en un bloc de notas.

Para lograr esto en React Native, utilizaremos tres propiedades mágicas del `<TextInput>`:

1. multiline={true}:
   Le dice al componente que permita múltiples líneas.

2. numberOfLines={3}:
   Le da una altura inicial por defecto equivalente a tres líneas de texto para que se note visualmente que es un campo amplio.

3. textAlignVertical="top":
   (Crucial para Android) Evita que el texto comience a escribirse flotando en el centro de la caja y lo obliga a arrancar arriba a la izquierda, tal como esperamos los humanos.

## 🛠️ Paso 1: Crear el Estado de la Dirección en ContactoForm.js

Vamos a la cabecera de tu archivo, justo debajo del estado de correo que acabas de crear, e inyectamos la memoria para la dirección protegiéndola contra contactos antiguos de la misma forma:

---

```jsx
const [direccion, setDireccion] = useState(
  contactoAEditar && contactoAEditar.direccion ? contactoAEditar.direccion : "",
);
```

---

## 📐 Paso 2: Pintar el Input Multilínea con su Cesta 🗑️

Bajemos al return (dentro de tu ScrollView) y colócalo justo debajo del campo de Correo.
Mantendremos la misma estructura de fila horizontal para que la cesta de borrado aparezca a la derecha si hay texto:

---

```jsx
      {/* 🏠 INPUT DE LA DIRECCIÓN CON BOTÓN DE ELIMINACIÓN */}
      <Text style={styles.label}>Dirección (Opcional):</Text>

      <View style={styles.contenedorInputAccion}>
        <TextInput
          style={[styles.inputFlexible, styles.inputMultiline]} // Combinamos tus estilos con uno especial para multilínea
          placeholder="Ej: Av. de la Constitución 4, 3ºB..."
          placeholderTextColor="#999"
          value={direccion}
          onChangeText={setDireccion}
          multiline={true}            // 🚀 Permite saltos de línea
          numberOfLines={3}           // Altura visual inicial de 3 líneas
          textAlignVertical="top"     // 🎯 Fuerza al texto a arrancar arriba en Android
        />

        {/* Cesta de eliminación: Solo si el campo tiene texto */}
        {direccion.trim() !== "" && (
          <TouchableOpacity
            style={styles.btnEliminarCampo}
            onPress={() => setDireccion("")}
          >
            <Text style={{ fontSize: 20 }}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
```

---

## 🎨 Paso 3: Ajuste de Estilo en la Hoja de Estilos

Como una caja de tres líneas es más alta que un input normal (de height: 45), necesitamos crear una pequeña regla en tu StyleSheet.create para sobreescribir la altura solo en este campo y que se vea espacioso:

---

```jsx

  inputMultiline: {
    height: 80,         // 🚀 Le damos más altura para que quepan holgadamente las líneas
    paddingTop: 10,     // Espacio interno arriba para que el texto no choque con el borde
  },

```

---

## 🔌 Paso 4: El Cableado en presionarGuardar ( GUARDAR )

Para cerrar el ciclo completo de la dirección, modificamos tu función central de guardado añadiendo el nuevo cable limpio que viajará hacia la base de datos del Padre:

---

```jsx
// Si pasa las reglas, disparamos el guardado hacia el Padre
guardarContactoGlobal({
  id: contactoAEditar ? contactoAEditar.id : Date.now().toString(),
  nombre: nombre.trim(),
  telefonos: telefonos.map((tel) => ({
    ...tel,
    numero: tel.numero.trim(),
  })),
  empresa: empresa.trim(),
  correo: correo.trim(),
  direccion: direccion.trim(), // 🏠 ¡NUEVO CABLE CONECTADO CON EL PADRE!
});
```

---

## ⏱️ Parada de Control y Prueba de Fuego

Hacemos nuestra pausa de ingenieros para verificar este módulo en el movil:
Corremos la aplicacion en el movil.
Abrimos el formulario de añadir contacto, pulsando el +.

Debe aparecer la caja de Dirección más alta e imponente debajo del correo.

Escribimos una dirección larga y le damos a "Intro/Enter" en el teclado de tu móvil, para saltar de linea.

Al escribir debe aparecer la cesta 🗑️ a la derecha y al pulsarla limpie toda la dirección por completo.
