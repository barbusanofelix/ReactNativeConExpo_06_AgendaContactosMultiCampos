// App_V07.js
// Esta version de ordenado y filtrado es muy eficiente porque ordenamos y filtramos solo en memoria. No se guarda a menos que se edite o borre.
// Añadir mas campos a la Base de datos: Empresa, correo, nota
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  TextInput,
  Image, // Para udar imagenes
} from "react-native";
import { globalStyles, colores } from "../styles/globalStyles";
import ContactoCard from "../components/ContactoCard";
import ContactoForm from "../components/ContactoForm";
import BotonNuevoContacto from "../components/BotonNuevoContacto";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ◄--- Importamos el disco
import { iniciarCorreo } from "../utils/linkingHelper"; // Importamos la funcion de iniciar el mailfrom

import { LinearGradient } from "expo-linear-gradient";
import CabeceraGradient from "../components/CabeceraGradient"; // Para probar el componente

// Icono Agregar by Graphicsbay on <a href="https://icon-icons.com/es/authors/374-graphicsbay">Icon-Icons.com</a>
// Icono Doble by khulqi Rosyid on <a href="https://icon-icons.com/es/authors/1410-khulqi-rosyid">Icon-Icons.com</a>

export default function App_V06() {
  // 1. NUEVO MODELO DE DATOS: Array de objetos con sub-arrays de teléfonos
  const [listaContactos, setListaContactos] = useState([]);

  // 2. ESTADO DE CONTROL DE INTERFAZ (UX)
  const [mostrarFormulario, setMostarFormulario] = useState(false);
  const [contactoAEditar, setContactoAEditar] = useState(null);

  // 🔍 NUEVO ESTADO: Guarda el texto de la barra de búsqueda
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  // Para orden de ordenacion
  const [direccionOrden, setDireccionOrden] = useState("ninguno");

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
    const notaContacto = contacto.nota.toLowerCase();

    // Regla 1: ¿El nombre contiene el texto buscado?
    const coincideNombre = nombreContacto.includes(textoUsuario);

    // Regla 2: La nota incluye el texto?
    const coincideNota = notaContacto.includes(textoUsuario);
    // Regla 2: ¿Alguno de sus números de teléfono contiene el texto buscado?
    // Usamos .some() que devuelve true en cuanto uno de los elementos cumpla la condición
    const coincideTelefono = contacto.telefonos.some((tel) =>
      tel.numero.includes(textoUsuario),
    );

    // Si coincide el nombre O coincide el teléfono, el contacto se queda en la lista filtrada
    return coincideNombre || coincideTelefono || coincideNota;
  });

  // Aqui comamos los contactos filtrados y los ordenamos
  const contactosOrdenadosYFiltrados = [...contactosFiltrados].sort((a, b) => {
    if (direccionOrden === "asc") {
      return a.nombre.localeCompare(b.nombre); // Devuelve <0 a va antes de b
    } else if (direccionOrden === "desc") {
      return b.nombre.localeCompare(a.nombre);
    } // devuelve >0 va despues de b
    return 0;
  });

  // Solo Cambiamos la direccion de ordenacion.
  const cambioDireccionOrden = () => {
    //Establecemos el orden en creciente. asc: ascendente, desc: decreciente
    // Cuando iniciamos sin datos la direccion sera 'ninguno'
    if (direccionOrden === "ninguno" || direccionOrden === "desc") {
      setDireccionOrden("asc");
    } else {
      setDireccionOrden("desc");
    }
  };

  const cancelarMostrarFormYEdicion = () => {
    setMostarFormulario(false);
    setContactoAEditar(null);
  };

  const crearContacto = () => {
    //Al cambiar los estados se redibuja el ControlForm y entrar por mostrar formulario
    setContactoAEditar(null);
    setMostarFormulario(true);
  };

  // Funcion expresada de flecha para Editar Contacto : Actualiza el contacto y activa el formulario
  const editarContactoSeleccionado = (contacto) => {
    setContactoAEditar(contacto);
    setMostarFormulario(true);
  };

  const contactarme = () => {
    Alert.alert(
      "Acerca de esta App",
      "Desarrollado por Félix C. López B.\n\nVersión 05 (Estable)\nSi tienes sugerencias, comentarios o deseas contactarme escríbeme a barbusano3@gmail.com",
      [
        { text: "Cerrar", style: "cancel" },
        {
          text: "📧 Contactar",
          onPress: () =>
            iniciarCorreo(
              "barbusano3@gmail.com",
              "Sugerencia/Soporte-Agenda Contactos",
            ),
        },
      ],
    ); // <-- Aquí cierra limpiamente el Alert.alert
  };

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
      <View style={styles.contenedorHeaderPrincipal}>
        {/* <View style={styles.recuadroTituloModerno}> */}
        <LinearGradient
          {...GRADIENTE_TITULO}
          style={styles.recuadroTituloModerno}
        >
          <TouchableOpacity onPress={cambioDireccionOrden}>
            <Image
              source={require("../../assets/ordenar.png")}
              style={styles.flechaOrdenar}
            />
          </TouchableOpacity>
          <Text style={styles.textoTituloPrincipal}>Contactos</Text>
          <Image
            source={require("../../assets/address-book.png")}
            style={styles.iconoPngTitulo}
          />

          {/* <Text style={styles.emojisTitulo}>📇</Text> */}

          <TouchableOpacity
            onPress={() => contactarme()}
            style={styles.btnAyudaFlotante}
          >
            <Image
              source={require("../../assets/contacto.png")}
              style={styles.iconoPngAyuda}
            />
          </TouchableOpacity>
        </LinearGradient>
        {/* </View> */}
      </View>
      {/** contenedorHeaderPrincipal */}
      {/* 🎭 ESCENOGRAFÍA A: Solo se muestra si NO se está editando/añadiendo */}
      {!mostrarFormulario && (
        <>
          {/* 🔍 BARRA DE BÚSQUEDA Y BOTÓN COMPACTO */}
          <View style={styles.contenedorCabeceraAcciones}>
            <TextInput
              style={styles.inputBusqueda}
              placeholder="🔍Buscar por nombre o teléfono o Nota."
              value={filtroBusqueda}
              onChangeText={setFiltroBusqueda}
            />

            <TouchableOpacity
              // style={styles.btnAñadirCorto}
              onPress={crearContacto} // >arriba definido como funcion flecha.
            >
              <Image
                source={require("../../assets/agrerarContacto.png")}
                style={styles.agregarContacto}
              />
              {/* <Text style={styles.textoBtnAñadir}>+</Text> */}
            </TouchableOpacity>
          </View>

          {/* 📜 LISTA DE CONTACTOS */}
          <FlatList
            data={contactosOrdenadosYFiltrados}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ContactoCard
                contacto={item}
                eliminarContactoGlobal={eliminarContactoGlobal}
                editarContactoSeleccionado={(contacto) =>
                  editarContactoSeleccionado(contacto)
                }
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
        <ContactoForm // <-- Recibirá los props de aqui
          key={contactoAEditar ? contactoAEditar.id : "nuevo"}
          guardarContactoGlobal={guardarContactoGlobal} // En ContactoForm se llamará igual. Hijo =Padre
          contactoAEditar={contactoAEditar} // Pasa el valor del Contacto a editar
          cancelarMostrarFormYEdicion={cancelarMostrarFormYEdicion} // Cancela Mostrar Formulario y le edicion de contacto
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedorHeaderPrincipal: {
    width: "100%",
    paddingHorizontal: 1,
    marginTop: 10, // Un poco mas de separacion de la barra de estado
    marginBottom: 8,
    // alignItems: "center", // Centra el recuadro en la pantalla
  },
  recuadroTituloModerno: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    position: "relative", // Nos permite posicionar el boton de forma absoluta
    backgroundColor: "#ffffff",
    paddingVertical: 14, // Mas cuerpo vertical para que respire el texto
    borderRadius: 14, // Bordes bien redondeados y modernos

    // 🌤️ Sombra sutil para darle profundidad (Efecto flotante)

    // shadowColor: "#3b82f6", // Sombra con tono azul vivo
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 10,
    // elevation: 6, // Sombra para Android (tu Samsung)
  },
  iconoPngTitulo: {
    width: 26,
    height: 26,
    marginRight: 10,
    resizeMode: "contain",
  },
  iconoPngAyuda: {
    width: 18,
    height: 18,
    resizeMode: "contain",
    // tintColor:'#ffffff'
  },
  btnAyudaFlotante: {
    position: "absolute",
    right: 5,
    top: 1,
    padding: 2,
  },

  emojisTitulo: {
    fontSize: 24,
    marginRight: 12,
  },
  textoTituloPrincipal: {
    fontSize: 22,
    fontWeight: "900", // Letra imponente y gruesa
    color: "#ffffff", // El azul corporativo elegante que ya usas
    letterSpacing: 1.2, // Un pequeño espacio entre letras premium
    textTransform: "uppercase",
  },

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
    paddingLeft: 3,
    paddingRight: 5,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,

    marginRight: 5,
    elevation: 3,
    // Línea decorativa lateral izquierda (fiel a tu diseño original)
    borderLeftWidth: 5,
    borderLeftColor: colores.primario,
  },
  btnAñadirCorto: {
    width: 45,
    height: "100%",
    backgroundColor: "#3b82f6", // Inicial era colores.primario,
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
  flechaOrdenar: {
    height: 35,
    width: 35,
    marginTop: 4,
    resizeMode: "contain",
    tintColor: "#ffffff",
    paddingHorizontal: 10,
    marginTop: 4,
  },
  agregarContacto: {
    height: 25,
    width: 25,

    resizeMode: "contain",
    tintColor: "#3b82f6",
    paddingHorizontal: 10,
    marginTop: 8,
    marginLeft: 10,
    marginRight: 10,
  },
});

const GRADIENTE_TITULO = {
  colors: ["#1e3a8a", "#3b82f6"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 }, // Gradiente horizontal elegante
};
