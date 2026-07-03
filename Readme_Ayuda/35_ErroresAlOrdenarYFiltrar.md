# COMPARAR App_CR_D_NoPersistencia.js, del proyecto 05_AgendaContactos versus App_V06.js, de V06_AgendaContactosMultiCampos

Comparar estas versiones, App_CR_D_NoPersistencia.js y App_V06.js, nos permite ver una lección magistral de por qué pequeños detalles en la lógica de estados cambian por completo la seguridad de una base de datos.

Sí, en la versión App_V06.js, los datos se preservan en el disco al filtrar o al ordenar, pero la estrategia de ordenación sigue siendo ineficiente e inestable, aunque por motivos diferentes a los de la versión anterior, App_CR_D_NoPersistencia.js

Vamos a desglosar exactamente qué está pasando bajo el capó en esta versión con respecto al filtrado y a la ordenación:#

## 🔍 1. El Filtrado en App_V06:

Por qué SÍ es seguro en ambas versiones
Tanto en la versión anterior, como en este código, el filtrado está bien hecho `porque utiliza el estado intermedio textoBusqueda y calcula la proyección al vuelo`:

---

```jsx
const contactosFiltrados = listaContactos.filter((contacto) =>
  contacto.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()),
);
```

---

## El disco está a salvo:

Al escribir en el `TextInput, solo muta textoBusqueda`.
La variable original listaContactos permanece intacta con el 100% de tus contactos guardados.
Como listaContactos no cambia, la tubería del useEffect de guardado no se dispara, protegiendo tu almacenamiento de borrados accidentales.

## 🔤 2. La Ordenación:

¿Qué diferencia hay con la versión anterior?
Aquí es donde ocurre la magia (y el peligro). Analicemos la función conmutadorOrden de este archivo App_CR_D_NoPersistencia.js

---

```jsx
const conmutadorOrden = () => {
  const copiaLista = [...listaContactos]; // ◄--- ¡Clave 1: Copia la base de datos completa!

  if (direccionOrden === "ninguno" || direccionOrden === "desc") {
    copiaLista.sort((a, b) => a.nombre.localeCompare(b.nombre));
    setListaContactos(copiaLista); // ◄--- Clave 2: Sobreescribe TODA la base de datos ordenada
    setDireccionOrden("asc");
  } else {
    // ... invierte el orden ...
    setListaContactos(copiaLista);
    setDireccionOrden("desc");
  }
};
```

---

🟩 Lo que SÍ hace bien esta versión, App_CR_D_NoPersistencia.js (Preserva los datos):
En la versión anterior (App_V06), cometías el error de copiar contactosFiltrados.

Estaba mal definida `const copiaContactosFiltrados = [...contactosFiltrados];`

- Si tenías la lista filtrada con 2 personas y ordenabas, machacabas tu estado con solo 2 personas y el disco borraba las otras 8.

En este archivo, clonamos listaContactos (la base de datos completa con los 10 contactos).
Al ordenarlos alfabéticamente y hacer setListaContactos(copiaLista), el estado sigue manteniendo los 10 contactos.
El disco se reescribe de inmediato mediante el useEffect, pero escribe la lista completa (simplemente reorganizada alfabéticamente).
No pierdes información.

## 🟨 Lo que hace MAL esta versión (Ineficiencia y volatilidad):

Aunque los datos no se borren, `esta forma de ordenar se considera una mala práctica` de arquitectura por dos razones técnicas:

- Escritura innecesaria en disco (Desgaste de memoria):
  Cada vez que el usuario pulsa el botón de ordenar, el useEffect se despierta y vuelve a reescribir todo el archivo de texto en el almacenamiento del teléfono. Si tienes 500 contactos, reescribir el almacenamiento físico solo por cambiar la vista de la pantalla ralentiza la app y consume recursos innecesarios.
- El orden es "frágil" frente a nuevos contactos:
  Si ordenas la lista de la A a la Z y luego agregas un contacto que se llama "Alberto", tu función agregarContactoGlobal ejecuta esto:

`setListaContactos([...listaContactos, nuevoContacto]);`

¡"Alberto" se guardará al final de la lista! Rompiendo la ordenación alfabética instantáneamente hasta que el usuario vuelva a pulsar el botón de ordenar manualmente.
