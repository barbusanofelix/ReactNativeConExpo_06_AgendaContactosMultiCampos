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
