// App_V04.js en 06_AgendaContactosMultiCampos: Version 04
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { globalStyles, colores } from "../styles/globalStyles";
import ContactoCard from "../components/ContactoCard";
import ContactoForm from "../components/ContactoForm";
import BotonNuevoContacto from "../components/BotonNuevoContacto";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ◄--- Importamos el disco

export default function App_V04() {
  // 1. NUEVO MODELO DE DATOS: Array de objetos con sub-arrays de teléfonos
  const [listaContactos, setListaContactos] = useState([]);

  // 2. ESTADO DE CONTROL DE INTERFAZ (UX)
  const [mostrarFormulario, setMostarFormulario] = useState(false);
  const [contactoAEditar, setContactoAEditar] = useState(null);

  // 🔍 NUEVO ESTADO: Guarda el texto de la barra de búsqueda
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  // 🔑 Clave única para identificar los datos de nuestra agenda en el disco del móvil
  const STORAGE_KEY = "@agenda_multicampos_v03";

  // 📥 EFECTO 1: Cargar los contactos del disco cuando la App se arranca por primera vez
  useEffect(() => {
    const cargarContactosDelDisco = async () => {
      try {
        const datosSerializados = await AsyncStorage.getItem(STORAGE_KEY);
        if (datosSerializados !== null) {
          // Si había datos guardados, los transformamos de texto a Array de objetos de JS
          setListaContactos(JSON.parse(datosSerializados));
        }
      } catch (error) {
        Alert.alert(
          "Error de lectura",
          "No se pudieron cargar los contactos guardados.",
        );
        console.log("Error al leer de AsyncStorage:", error);
      }
    };

    cargarContactosDelDisco();
  }, []); // Array vacío = Solo se ejecuta una vez al montar el componente

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

  // 🔍 FILTRADO DINÁMICO: Evaluamos la búsqueda antes de pintar la lista
  const contactosFiltrados = listaContactos.filter((contacto) => {
    // Si la barra está vacía, pasa el contacto directo sin filtrar
    if (filtroBusqueda.trim() === "") return true;

    const textoUsuario = filtroBusqueda.toLowerCase().trim();
    const nombreContacto = contacto.nombre.toLowerCase();

    // Regla 1: ¿El nombre contiene el texto buscado?
    const coincideNombre = nombreContacto.includes(textoUsuario);

    // Regla 2: ¿Alguno de sus números de teléfono contiene el texto buscado?
    // Usamos .some() que devuelve true en cuanto uno de los elementos cumpla la condición
    const coincideTelefono = contacto.telefonos.some((tel) =>
      tel.numero.includes(textoUsuario),
    );

    // Si coincide el nombre O coincide el teléfono, el contacto se queda en la lista filtrada
    return coincideNombre || coincideTelefono;
  });

  // 📤 EFECTO 2: Guardar automáticamente en el disco cada vez que la lista cambie
  useEffect(() => {
    const guardarContactosEnDisco = async () => {
      try {
        // Transformamos el Array de objetos a una cadena de texto plana (JSON)
        const datosSerializados = JSON.stringify(listaContactos);
        await AsyncStorage.setItem(STORAGE_KEY, datosSerializados);
      } catch (error) {
        Alert.alert(
          "Error de guardado",
          "Los cambios no se pudieron escribir en el almacenamiento.",
        );
        console.log("Error al escribir en AsyncStorage:", error);
      }
    };

    guardarContactosEnDisco();
  }, [listaContactos]); // Se dispara mágicamente CADA VEZ que 'listaContactos' mute (crear, editar o borrar)

  return (
    <View style={globalStyles.container}>
      {/* 🌟 El título se queda fijo arriba siempre */}
      <Text style={globalStyles.titulo}>📒 Agenda Multi-Campos (V04)</Text>

      {/* 🎭 ESCENOGRAFÍA A: Solo se muestra si NO se está editando/añadiendo */}
      {!mostrarFormulario && (
        <>
          {/* 🔍 BARRA DE BÚSQUEDA Y BOTÓN COMPACTO */}
          <View style={styles.contenedorCabeceraAcciones}>
            <TextInput
              style={styles.inputBusqueda}
              placeholder="Buscar por nombre o telefono..."
              value={filtroBusqueda}
              onChangeText={setFiltroBusqueda}
            />

            <TouchableOpacity
              style={styles.btnAñadirCorto}
              onPress={() => {
                setContactoAEditar(null);
                setMostarFormulario(true);
              }}
            >
              <Text style={styles.textoBtnAñadir}>+</Text>
            </TouchableOpacity>
          </View>

          {/* 📜 LISTA DE CONTACTOS */}
          <FlatList
            data={contactosFiltrados}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ContactoCard
                contacto={item}
                onBorrarContacto={eliminarContactoGlobal}
                onEditarSeleccion={(contacto) => {
                  setContactoAEditar(contacto);
                  setMostarFormulario(true);
                }}
              />
            )}
            contentContainerStyle={{ paddingBottom: 30 }}
            ListEmptyComponent={
              <View style={styles.contenedorVacio}>
                <Text style={styles.textoVacio}>
                  ✨ Tu agenda está vacía. ¡Toca el botón superior para empezar!
                </Text>
              </View>
            }
          />
        </>
      )}

      {/* 🎭 ESCENOGRAFÍA B: COMPONENTE FORMULARIO CONDICIONAL (Solo si mostrarFormulario es true) */}
      {mostrarFormulario && (
        <ContactoForm
          key={contactoAEditar ? contactoAEditar.id : "nuevo"}
          onGuardarContacto={guardarContactoGlobal}
          contactoAEditar={contactoAEditar}
          onCancelar={() => {
            setMostarFormulario(false);
            setContactoAEditar(null);
          }}
        />
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedorVacio: {
    padding: 20,
    alignItems: "center",
  },
  textoVacio: {
    fontSize: 15,
    color: colores.textoMutado,
    textAlign: "center",
    fontStyle: "italic",
  },

  // 🌟 Nuevos estios para la cabecera del inputText y + ( nuevo contacto )
  contenedorCabeceraAcciones: {
    flexDirection: "row", // Para colocar el input busqueda y el + , en la linea
    height: 45, //
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 0,
    fontSize: 15,
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inputBusqueda: {
    flex: 1, // Ocupa todo el espacio que puede.
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 3,
  },
  btnAñadirCorto: {
    width: 45,
    height: "100%",
    backgroundColor: colores.primario, // Mantener el azul original
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  textoBtnAñadir: {
    fontSize: 35,
    paddingBottom: 0,
    color: "#faf6f6",
    fontWeight: "bold",
  },
});
