# DE ETIQUETAS FIJAS PARA EL TIPO DE TELEFONO A ETIQUETAS DINAMICAS.

## 🪜 Etapa 3: El Selector de Etiquetas Dinámico (App_V03.js)

Vamos a hacer que el botón azul de la etiqueta en el formulario cambie cíclicamente entre:

- Móvil ➡️ Casa ➡️ Trabajo ➡️ Otros,
- cada vez que el usuario lo pulse.

Usaremos la modalidad explícita de flechas ( para el paso de informacion Padre <-> hijo).
Veremos como se conecta este cambio de etiqueta dinamico con nuestra App.

### Paso 1: Crear App_V03.js a partir de copiar App_V02.js

Crea una copia exacta de tu código actual y guárdala como src/versionesApps/App_V03.js.

Cambia el nombre de la función arriba para que coincida con el archivo:

```jsx
export default function App_V03() { ... }
```

No olvides cambiar el apuntador en tu App.js raíz para que apunte a la nueva versión:

---

```jsx
import App_V03 from "./src/versionesApps/App_V03";
export default function App() {
  return <App_V03 />;
}
```

## Paso 2: Actualizar ContactoForm.js con la rotación dinámica

Ahora abre src/components/ContactoForm.js.
Vamos a inyectar la lógica matemática que calcula el cambio de la etiqueta y a transformar el recuadro estático en un botón real.

### 1. Añade la función de rotación

Colócala justo debajo de la `función manejarCambioNumero` que ya tenías:

```jsx
// 🔄 Función para rotar de forma circular las etiquetas de una fila específica
const rotarEtiqueta = (idFila) => {
  const catalogoEtiquetas = ["Móvil", "Casa", "Trabajo", "Otros"];

  const nuevosTelefonos = telefonos.map((tel) => {
    if (tel.id === idFila) {
      // Buscamos la posición actual de la etiqueta en el catálogo (ej: "Móvil" es 0)
      const indiceActual = catalogoEtiquetas.indexOf(tel.etiqueta);

      // Calculamos el siguiente índice usando el operador residuo (%) para volver a 0 si llega al final.
      // Truco matematico muy bueno: que si estamos en posicion 1 el siguiente sera 2 ( Residuo de 2 entre 4 es 2...y al estar en posicion 3: (3+1) / 4 = resoduo 0, vuelve al comienzo)
      const siguienteIndice = (indiceActual + 1) % catalogoEtiquetas.length;

      // Devolvemos el teléfono con su nueva etiqueta cambiada
      return { ...tel, etiqueta: catalogoEtiquetas[siguienteIndice] };
    }
    return tel;
  });

  setTelefonos(nuevosTelefonos);
};
```

---

### 2. Modificar el bloque del Renderizado (telefonos.map)

Busca el contenedor donde pinta las filas de los teléfonos. Vamos a cambiar el viejo `<View style={styles.badgeEtiqueta}>` por un `<TouchableOpacity>` que use la modalidad de flecha explícita para pasarle el ID exacto de la fila que queremos rotar:

---

```jsx
{
  /* RENDERIZADO DINÁMICO DE FILAS DE TELÉFONOS */
}
{
  telefonos.map((tel) => (
    <View key={tel.id} style={styles.filaInput}>
      {/* 🌟 REEMPLAZADO: Ahora es un botón interactivo */}
      <TouchableOpacity
        style={styles.badgeEtiqueta}
        onPress={() => rotarEtiqueta(tel.id)} // ◄--- Flecha explícita: pasa el ID de la fila al pulsar
      >
        <Text style={styles.textoBadge}>{tel.etiqueta} 🔄</Text>
      </TouchableOpacity>

      {/* Campo numérico */}
      <TextInput
        style={[styles.input, { flex: 1, marginBottom: 0 }]}
        placeholder="Número"
        keyboardType="phone-pad"
        value={tel.numero}
        onChangeText={(texto) => manejarCambioNumero(tel.id, texto)}
      />

      {/* Botón para borrar esta fila específica */}
      <TouchableOpacity
        onPress={() => eliminarFilaTelefono(tel.id)}
        style={styles.btnEliminarFila}
      >
        <Text style={{ fontSize: 16 }}>🗑️</Text>
      </TouchableOpacity>
    </View>
  ));
}
```

---

### 🎯 Verificación en el Movil

- Guarda todos los archivos y haz la prueba de campo:
- Abre el formulario pulsando ➕ Nuevo Contacto o editando uno existente con el lápiz ✏️.
- Toca el recuadro azul que dice "Móvil 🔄". Verás cómo muta instantáneamente a Casa, luego a Trabajo, Otros y vuelve a empezar.

Agrega otra fila, ponle una etiqueta distinta, rellena los números y dale a Guardar.

Al regresar a la pantalla principal, verifica que tu ContactoCard dibuje perfectamente las nuevas etiquetas que seleccionaste de forma dinámica.

Se comportó muy bien. Al presionar el nombre de la etqueta del telefono, en edidicion o agregar, la cambia a la siguiente y si la presionamos varias veces vuelve a iniciar el ciclo.
![alt text](<WhatsApp Image 2026-06-07 at 7.34.19 PM.jpeg>)

# EXPLICACION DE COMO HACE EL CAMBIO DE ETIQUETAS:

## Expicacion sencilla:

![alt text](image-3.png)

A la funcion le añadi una serie de console.log() para lograr el seguimiento y ver como funciona:

---

```jsx

// 🔄 Función para rotar de forma circular las etiquetas de una fila específica
  const rotarEtiqueta = (idFila) => {
    console.log(`Posicion de etiqueta recibida: ${idFila}`);

    const catalogoEtiquetas = ["Móvil", "Casa", "Trabajo", "Otros"];

    const nuevosTelefonos = telefonos.map((tel) => {

      if (tel.id === idFila) {
        console.log(`Entramos en el if(tel.id ===idFila): tel.id=${tel.id} y idFila es= ${idFila}`);

        // Buscamos la posición actual de la etiqueta en el catálogo (ej: "Móvil" es 0)
        const indiceActual = catalogoEtiquetas.indexOf(tel.etiqueta);
        console.log(`indiceActual =${indiceActual} y tel.etiqueta=${tel.etiqueta}`);

        // Calculamos el siguiente índice usando el operador residuo (%) para volver a 0 si llega al final.

        // Truco matematico muy bueno: que si estamos en posicion 1 el siguiente sera 2 ( Residuo de 2 entre 4 es 2...y al estar en posicion 3: (3+1) / 4 = resoduo 0, vuelve al comienzo)

        const siguienteIndice = (indiceActual + 1) % catalogoEtiquetas.length;

        console.log(`El tel que devolvera es:${tel.numero} y la etiqueta es: ${catalogoEtiquetas[siguienteIndice]}`);

        // Devolvemos el teléfono con su nueva etiqueta cambiada
        return { ...tel, etiqueta: catalogoEtiquetas[siguienteIndice] };
      }
      console.log(`Si el tel.id es distinto  a idFila devuelve tel: ${tel.numero} y ${tel.etiqueta}`);
      return tel;

    });
```

---

Estos son algunos console.log() que se imprimieron al editar y pulsar en las etiquetas:
Android Bundled 21ms index.js (1 module)

LOG Posicion de etiqueta recibida: t1
LOG Entramos en el if(tel.id ===idFila): tel.id=t1 y idFila es= t1
LOG indiceActual =0 y tel.etiqueta=Móvil
LOG El tel que devolvera es:600000000 y la etiqueta es: Casa
LOG Si el tel.id es distinto a idFila devuelve tel: 910000000 y Trabajo
LOG Posicion de etiqueta recibida: t2
LOG Si el tel.id es distinto a idFila devuelve tel: 600000000 y Casa
LOG Entramos en el if(tel.id ===idFila): tel.id=t2 y idFila es= t2
LOG indiceActual =2 y tel.etiqueta=Trabajo
LOG El tel que devolvera es:910000000 y la etiqueta es: Otros
LOG Posicion de etiqueta recibida: t3
LOG Entramos en el if(tel.id ===idFila): tel.id=t3 y idFila es= t3
LOG indiceActual =-1 y tel.etiqueta=Personal
LOG El tel que devolvera es:541236 y la etiqueta es: Móvil

Interesante el uso del calculo del siguiente etiqueta del telefono dividiendo el ( indice + 1) / (la cantidad de elementos ) , sacando el residuo pues siempre hara la rotacion de las etiquetas.

Ya me di cuenta que el idFila lo saca inicialmente del array suministrado y al agregar nuevo numero le asigna uno construido con Date.now().toString().

Mientras no pinchamos el nombre de la etiqueta pues no pasa nada. Si la pinchamos pues va a la función rotarEtiqueta(tel.id) y si la fila que coincida con la posicion del arreglo de las etiquetas disponibles le asigna la siguiente etiqueta y ya la vemos en pantalla. Como en el map : "telefonos.map((tel)" hacemos referencia al state tel=telefonos y entiendo que en return { ...tel, etiqueta: catalogoEtiquetas[siguienteIndice] };, lo cambiamos, entonces se renderiza la etiqeta del telefono , con la nueva etiqueta.

# EXPLICACION PROFESIONAL DEL CAMBIO/SELECCION DINAMICA DE ETIQUETAS ( TIPO ) DE TELEFONO:

## 👨‍🏫 Lección Magistral:

El Motor del Mapeo Dinámico y el Residuo Circular.
Vamos a desglosar de forma magistral lo que ocurre tras bambalinas en React para que este mecanismo se quede grabado en tu inventario de herramientas para siempre.

🧩 1. La anatomía del Estado Local
El formulario mantiene las filas de teléfonos vivas en la memoria RAM del móvil usando un array de objetos en un estado:

---

```jsx
const [telefonos, setTelefonos] = useState([...]);
```

---

En React, la interfaz de usuario es un reflejo directo del estado.
Si el estado cambia un solo carácter, la pantalla se redibuja en milisegundos.

🔄 2. El Viaje del Click y la "Inmutabilidad"
Cuando tocas la etiqueta con el dedo, el botón dispara () => rotarEtiqueta(tel.id).
Al llegar a la función, no modificamos el array original directamente (ya que en React el estado es sagrado e inmutable). En su lugar, usamos .map().

El método .map() actúa como una cinta transportadora de una fábrica: toma cada teléfono del array, lo inspecciona y crea una copia exacta en una lista nueva llamada nuevosTelefonos.

🧮 3. La Magia Matemática del Operador Residuo (%)
Queremos que los números 0, 1, 2, 3 se conviertan en 1, 2, 3, 0 en un bucle infinito.
La fórmula es:

$Siguiente = (Actual + 1) \pmod{Longitud}$

Miremos cómo responde el procesador cuando la lista tiene 4 elementos:
Si estás en Móvil (0): $(0 + 1) = 1$. El residuo de $1 \div 4$ es 1 ➡️ Casa.
Si estás en Trabajo (2): $(2 + 1) = 3$. El residuo de $3 \div 4$ es 3 ➡️ Otros.
Si estás en Otros (3): $(3 + 1) = 4$. El residuo de $4 \div 4$ es 0 ➡️ ¡Vuelve a Móvil!

🕵️‍♂️ El misterio del indiceActual = -1 (¡Excelente hallazgo!)
Fíjate en tus propios logs cuando pinchaste la etiqueta de Román:

---

```txt
Entramos en el if(tel.id ===idFila): tel.id=t3 y idFila es= t3
LOG  indiceActual = -1 y tel.etiqueta=Personal
LOG  El tel que devolvera es:541236 y la etiqueta es: Móvil
```

---

¿Por qué dio -1?
El método .indexOf(valor) busca un elemento dentro de un array. Si lo encuentra, te da su posición (0, 1, 2...).
Pero si no lo encuentra, te devuelve siempre un -1.
Como en el App_V02.js inicial pusimos de prueba que Román tenía la etiqueta "Personal", y nuestro catalogoEtiquetas solo conoce ["Móvil", "Casa", "Trabajo", "Otros"], el sistema dijo: "Oye, 'Personal' no existe en mi catálogo, así que te devuelvo -1".
¿Y qué hizo la matemática?$(-1 + 1) \% 4 = 0 \% 4 =$ 0 ➡️ Por eso el sistema, con un comportamiento de autodefensa brillante, transformó el "Personal" de Román en Móvil (posición 0).

¡Tus logs acaban de demostrar que el sistema es robusto y se autorepara ante datos inesperados!


