
[Regresar al anterior: Componente ContactoCard](03_ComponenteContactoCard.md)

# FORMULARIO DINAMICO : MANEJANDO UN ARRAY DENTRO DE OTRO ARRAY.

Ahora que la tarjeta (ContactoCard.js) está lista para pintar múltiples renglones de teléfonos recorriendo el array interno con .map(), vamos al siguiente paso lógico con total paciencia: el formulario dinámico ContactoForm.js.

## 🧠 Comprendiendo la Lógica de un Formulario Dinámico
En tu aplicación anterior, el formulario tenía dos estados simples y fijos de texto plano:

```Jsx
const [nombre, setNombre] = useState("");
const [telefono, setTelefono] = useState("");
```
---

Para esta nueva filosofía de múltiples números, el nombre se queda exactamente igual, pero el teléfono se convierte en un array de objetos dentro del estado del propio formulario:

---
```jsx
const [telefonos, setTelefonos] = useState([
  { id: Date.now().toString(), etiqueta: "Móvil", numero: "" }
]);
```
---


## 🛠️ ¿Cómo manejamos esto en la pantalla?
Pintar las filas: 
Usaremos un bucle para renderizar tantos campos de entrada (TextInput) como objetos tenga el array telefonos.

Botón Añadir (➕): 
Añadiremos un botón que, al pulsarlo, simplemente inyectará un nuevo objeto vacío al array de estados:
 { id: Date.now().toString(), etiqueta: "Móvil", numero: "" }. 
 React Native detectará el cambio y pintará automáticamente una nueva fila en tu móvil.

Modificar el texto: 
Cuando el usuario escriba en una fila específica, necesitaremos saber el id de esa fila para actualizar únicamente ese número sin tocar los demás.

## 🪜 Paso Práctico: Crear src/components/ContactoForm.js
Creamos el archivo src/components/ContactoForm.js , comentado línea por línea para ver la mecánica.

---
```jsx
// src/components/ContactoForm.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { colores } from "../styles/globalStyles";

export default function ContactoForm({ onGuardarContacto, contactoAEditar, onCancelar }) {
  const [nombre, setNombre] = useState(contactoAEditar ? contactoAEditar.nombre : "");
  
  // Inicializamos el estado con una fila vacía si es nuevo, o con los teléfonos del contacto si editamos
  const [telefonos, setTelefonos] = useState(
    contactoAEditar 
      ? contactoAEditar.telefonos 
      : [{ id: Date.now().toString(), etiqueta: "Móvil", numero: "" }]
  );

  // ➕ Función para añadir una nueva fila de teléfono a la pantalla
  const añadirFilaTelefono = () => {
    setTelefonos([
      ...telefonos,
      { id: Date.now().toString(), etiqueta: "Móvil", numero: "" } // Una nueva fila limpia
    ]);
  };

  // 🗑️ Función para eliminar una fila de teléfono específica en el formulario
  const eliminarFilaTelefono = (idFila) => {
    if (telefonos.length === 1) {
      Alert.alert("Aviso", "Un contacto debe tener al menos un número de teléfono.");
      return;
    }
    setTelefonos(telefonos.filter(tel => tel.id !== idFila));
  };

  // ✍️ Función para actualizar el número escrito en una fila específica
  const manejarCambioNumero = (idFila, texto) => {
    const nuevosTelefonos = telefonos.map(tel => {
      if (tel.id === idFila) {
        return { ...tel, numero: texto }; // Actualizamos solo el número de esta fila
      }
      return tel;
    });
    setTelefonos(nuevosTelefonos);
  };

  // 💾 Lógica al presionar Guardar
  const presionarGuardar = () => {
    if (nombre.trim() === "") {
      Alert.alert("Error", "El nombre es obligatorio.");
      return;
    }

    // Validación interna en bucle para comprobar que ningún teléfono esté vacío
    for (let tel of telefonos) {
      if (tel.numero.trim() === "") {
        Alert.alert("Error", `El campo de teléfono con etiqueta [${tel.etiqueta}] está vacío.`);
        return;
      }
    }

    // Si pasa las reglas, disparamos el guardado hacia el Padre
    onGuardarContacto({
      id: contactoAEditar ? contactoAEditar.id : Date.now().toString(),
      nombre: nombre.trim(),
      telefonos: telefonos
    });
  };

  return (
    <View style={styles.formularioCard}>
      <Text style={styles.subtituloForm}>
        {contactoAEditar ? "📝 Editar Contacto" : "👤 Nuevo Contacto"}
      </Text>

      {/* Input de Nombre */}
      <TextInput
        style={styles.input}
        placeholder="Nombre Completo"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.seccionTitulo}>📞 Números de Teléfono</Text>

      {/* RENDERIZADO DINÁMICO DE FILAS DE TELÉFONOS */}
      {telefonos.map((tel, index) => (
        <View key={tel.id} style={styles.filaInput}>
          {/* Un texto fijo de etiqueta por ahora para mantener la simplicidad */}
          <View style={styles.badgeEtiqueta}>
            <Text style={styles.textoBadge}>{tel.etiqueta}</Text>
          </View>

          {/* Campo numérico */}
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Número"
            keyboardType="phone-pad"
            value={tel.numero}
            onChangeText={(texto) => manejarCambioNumero(tel.id, texto)}
          />

          {/* Botón para borrar esta fila específica */}
          <TouchableOpacity onPress={() => eliminarFilaTelefono(tel.id)} style={styles.btnEliminarFila}>
            <Text style={{ fontSize: 16 }}>🗑️</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Botón para agregar más campos de teléfono */}
      <TouchableOpacity onPress={añadirFilaTelefono} style={styles.btnAñadirFila}>
        <Text style={styles.textoBtnAñadir}>➕ Añadir otro teléfono</Text>
      </TouchableOpacity>

      {/* Botonera de guardar y cancelar */}
      <View style={styles.botonera}>
        <TouchableOpacity onPress={presionarGuardar} style={styles.btnGuardar}>
          <Text style={styles.btnTexto}>Guardar</Text>
        </TouchableOpacity>
        {contactoAEditar && (
          <TouchableOpacity onPress={onCancelar} style={styles.btnCancelar}>
            <Text style={[styles.btnTexto, { color: colores.texto }]}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  formularioCard: {
    backgroundColor: colores.blanco,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  subtituloForm: {
    fontSize: 16,
    fontWeight: "bold",
    color: colores.primario,
    marginBottom: 12,
  },
  seccionTitulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: colores.textoMutado,
    marginTop: 10,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    marginBottom: 12,
    fontSize: 15,
  },
  filaInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  badgeEtiqueta: {
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  textoBadge: {
    fontSize: 13,
    fontWeight: "bold",
    color: colores.primario,
  },
  btnEliminarFila: {
    padding: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  btnAñadirFila: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
    marginBottom: 15,
  },
  textoBtnAñadir: {
    fontSize: 13,
    color: colores.secundario,
    fontWeight: "600",
  },
  botonera: {
    flexDirection: "row",
    gap: 10,
    marginTop: 5,
  },
  btnGuardar: {
    flex: 1,
    backgroundColor: colores.secundario,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnCancelar: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnTexto: {
    color: colores.blanco,
    fontWeight: "bold",
    fontSize: 15,
  },
});
```
---

🏁 ¿Qué toca comprobar ahora?
Crear este archivo en su ubicación correspondiente (src/components/ContactoForm.js).
No nos ocupemos de que todavía no esté enlazado con la vista principal de la aplicación; de momento, lo que nos interesa es revisar que la lógica matemática del archivo compile a la perfección.

Cuando estemos listos haremos una copia de src/versionesApps/App_v01.js y crearemos src/versionesApps/App_v02.js 
Cuando me digas que lo tienes listo, daremos el paso definitivo: abrir el archivo src/versionesApps/App_v01.js para conectar la nueva tarjeta y el nuevo formulario, de modo que veas en vivo en tu móvil cómo aparecen y desaparecen filas de teléfono al pulsar los botones.


[Avanzar  al 05_PrimeraCorrida_ResolucionProblemas](05_PrimeraCorrida_ResolucionProblemas.md)


Aqui la version de App_V02.js  ya con los errores resueltos de la seccion 5.
Tambien cree como componente el boton para nuevo contacto ( BotonNuevoContacto.js ) que podemos encontrar en src/components/BotonNuevoContacto.js.

Seguir este link:

[Pasar boton nuevo contacto a Componente](06_PasarInformacionEntrePadresEHijos.md#-EJEMPLO-PRACTICO-PASAR-EL-BOTON-DE-NUEVO-CONTACTO-A-COMPONENTE)

Aqui todo el App_V02.js

```jsx
// App_V02.js en 06_AgendaContactosMultiCampos: Version 002
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { globalStyles, colores } from "../styles/globalStyles";
import ContactoCard from "../components/ContactoCard";
import ContactoForm from "../components/ContactoForm";
import BotonNuevoContacto from "../components/BotonNuevoContacto";
import { StatusBar } from "expo-status-bar";

export default function App_V02() {
  // 1. NUEVO MODELO DE DATOS: Array de objetos con sub-arrays de teléfonos
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

  // 2. ESTADO DE CONTROL DE INTERFAZ (UX)
  const [mostrarFormulario, setMostarFormulario] = useState(false);
  const [contactoAEditar, setContactoAEditar] = useState(null);

  // 💾 FUNCIÓN GLOBAL: Guardar (Sirve tanto para Crear como para Editar)
  const guardarContactoGlobal = (contactoProcesado) => {
    if (contactoAEditar) {
      // Si estamos editando reemplazamos el contacto viejo por el nuevo
      // lo hacemos sobre una lista nueva. Cada contacto es c y el editado es contactoProcesado
      // Si el contactoProcesado.id es el mismo en la lista (c.id) entonces toma el Procesado y sino toma el c
      const listaModificada = listaContactos.map((c) =>
        c.id === contactoProcesado.id ? contactoProcesado : c,
      );
      setListaContactos(listaModificada); // Actualizamos la lista...el useEffect se encargara de guardar en disco
      setContactoAEditar(null); // Ya no entrará por contactoAEditar
    } else {
      // Si el contacto es nuevo, lo inyectamos al inicio de la lista
      setListaContactos([contactoProcesado, ...listaContactos]);
    }
    setMostarFormulario(false); // Cerramos el formulario de edicion/creacion
  };

  // 🗑️ FUNCION GLOBAL : Borrado seguro con alerta contextual

  const eliminarContactoGlobal = (id, nombre) => {
    // Verificamos si lo estamos editando para avisar al usuario
    const estasEditandoEste = contactoAEditar && contactoAEditar.id === id;

    let mensaje = `Seguro quieres eliminar a ${nombre} \n\nNo se puede deshacer ⚠️`;
    if (estasEditandoEste) {
      mensaje = `Seguro quieres eliminar a ${nombre} \n\n⚠️ No se puede deshacer\nTambién estás ✏️ a ${nombre}.\nLa 🗑️ es prioritaria.`;
    }
    Alert.alert("⚠️ Confirmar eliminacion", mensaje, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          // Filtramos la lista para eliminar el contacto
          setListaContactos(listaContactos.filter((c) => c.id !== id));
          // Si era el que se editaba limpiamos la pantalla
          if (estasEditandoEste) {
            setContactoAEditar(null);
            setMostarFormulario(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.titulo}>📒 Agenda Multi-Campos (V02)</Text>

      {/* BOTON DISPARADOR DEL FORMULARIO */}
      {!mostrarFormulario && (
        <BotonNuevoContacto
          onPresionar={() => {
            setContactoAEditar(null);
            setMostarFormulario(true);
          }}
        />
      )}

      {/* COMPONENTE FORMULARIO CONTENIDO EN UN ESTADO CONDICIONAL */}
      {mostrarFormulario && (
        <ContactoForm
          // 🔑 BUENA PRÁCTICA: Si cambia el ID del contacto en edición (o pasa de nuevo a editar),
          // React reiniciará el formulario con los datos limpios y correctos automáticamente.
          key={contactoAEditar ? contactoAEditar.id : "nuevo"}
          onGuardarContacto={guardarContactoGlobal}
          contactoAEditar={contactoAEditar}
          onCancelar={() => {
            setMostarFormulario(false);
            setContactoAEditar(null);
          }}
        />
      )}

      {/* LISTA DE CONTACTOS */}
      <FlatList
        data={listaContactos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ContactoCard
            contacto={item}
            onBorrarContacto={eliminarContactoGlobal}
            // Para que al presionar el lapiz en ContactoCard se empiece a editar el contacto
            // debemos hacer 2 cosas: setContactoAEditar(contacto) , que es lo que hacia la linea
            // original onEditarSeleccion={setContactoAEditar} pero falta que se abra el formulario
            // asi que hay que hacer un setMostrarFormulario(true)
            // El cambio queda asi:
            onEditarSeleccion={(contacto) => {
              setContactoAEditar(contacto);
              setMostarFormulario(true); // Como no lo habiamos activado parecia que no hacia nada
            }}
          />
        )}
        contentContainerStyle={{ paddingBottom: 30 }}
        //MANEJO DE ESTADO VACIO
        ListEmptyComponent={
          <View style={styles.contenedorVacio}>
            <Text style={styles.textoVacio}>
              ✨ Tu agenda está vacía. ¡Toca el botón superior para empezar!
            </Text>
          </View>
        }
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  
  contenedorVacio: {
    padding: 40,
    alignItems: "center",
  },
  textoVacio: {
    fontSize: 15,
    color: colores.textoMutado,
    textAlign: "center",
    fontStyle: "italic",
  },
});

```

[Avanzar a repasar la teoria de pasar propiedades / s¡estados entre Padres e hijos](06_PasarInformacionEntrePadresEHijos.md)
