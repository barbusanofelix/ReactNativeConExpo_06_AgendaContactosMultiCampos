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
  // Para mostrar la ayuda
  Share, // Para compartir por whatsapp...contactos individuales
} from "react-native";
import { Modal, ScrollView } from "react-native";
import { globalStyles, colores } from "./src/styles/globalStyles";
import ContactoCard from "./src/components/ContactoCard";
import ContactoForm from "./src/components/ContactoForm";
// import BotonNuevoContacto from "../components/BotonNuevoContacto";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ◄--- Importamos el disco
import { iniciarCorreo } from "./src/utils/linkingHelper"; // Importamos la funcion de iniciar el mailfrom

import { LinearGradient } from "expo-linear-gradient";
import { exportarContactos, importarContactos } from "./src/utils/fileHelper";
import * as Clipboard from "expo-clipboard";

// import CabeceraGradient from "../components/CabeceraGradient"; // Para probar el componente

// Icono Agregar by Graphicsbay on <a href="https://icon-icons.com/es/authors/374-graphicsbay">Icon-Icons.com</a>
// Icono Doble by khulqi Rosyid on <a href="https://icon-icons.com/es/authors/1410-khulqi-rosyid">Icon-Icons.com</a>
//Icono Estado de metro pregunta ayuda by chrisbanks2 on <a href="https://icon-icons.com/es/authors/29-chrisbanks2">Icon-Icons.com</a>
//<a href="https://www.flaticon.es/iconos-gratis/compartir" title="compartir iconos">Compartir iconos creados por Freepik - Flaticon</a>
//<a href="https://www.flaticon.es/iconos-gratis/atajo" title="atajo iconos">Atajo iconos creados por Kiranshastry - Flaticon</a>

export default function App_V07() {
  // 1. NUEVO MODELO DE DATOS: Array de objetos con sub-arrays de teléfonos
  const [listaContactos, setListaContactos] = useState([]);

  // 2. ESTADO DE CONTROL DE INTERFAZ (UX)
  const [mostrarFormulario, setMostarFormulario] = useState(false);
  const [contactoAEditar, setContactoAEditar] = useState(null);

  // 🔍 NUEVO ESTADO: Guarda el texto de la barra de búsqueda
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  // Para orden de ordenacion
  const [direccionOrden, setDireccionOrden] = useState("ninguno");

  // Mostrar ayuda con un Modal al hacer clip en ? del titulo principal
  const [mostrarAyuda, setMostrarAyuda] = useState("false");

  //Mostrar Ajustes
  const [mostrarAjustes, setMostrarAjustes] = useState(false);

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
  // 💾 FUNCIÓN GLOBAL: Guardar (Sirve tanto para Crear como para Editar)
  const guardarContactoGlobal = (contactoProcesado) => {
    // Función auxiliar para limpiar teléfonos (solo números y el símbolo +)
    const limpiarTextoTelefono = (tel) =>
      tel ? String(tel).replace(/[^0-9+]/g, "") : "";

    // 1. 🧼 LIMPIEZA INTERNA DEL FORMULARIO: Quita repetidos en el propio formulario
    const telefonosUnicosFormulario = [];
    const numerosVistosFormulario = new Set();

    (contactoProcesado.telefonos || []).forEach((tel) => {
      const numLimpio = limpiarTextoTelefono(tel.numero);
      if (numLimpio !== "" && !numerosVistosFormulario.has(numLimpio)) {
        numerosVistosFormulario.add(numLimpio);
        telefonosUnicosFormulario.push(tel);
      }
    });

    contactoProcesado.telefonos = telefonosUnicosFormulario;

    // Extraemos en un array limpio todos los números que el usuario quiere guardar ahora
    const numerosNuevosAGuardar = telefonosUnicosFormulario.map((t) =>
      limpiarTextoTelefono(t.numero),
    );

    if (contactoAEditar) {
      // 📝 MODO EDICIÓN: Validar que los números no existan en OTROS contactos
      let numeroConflictivoEdicion = "";

      const contactoPropietarioEdicion = listaContactos.find((cExistente) => {
        if (cExistente.id === contactoProcesado.id) return false;

        const numerosDeOtro = (cExistente.telefonos || []).map((t) =>
          limpiarTextoTelefono(t.numero),
        );

        // Buscamos cuál es el número exacto que coincide
        const coincidencia = numerosNuevosAGuardar.find((num) =>
          numerosDeOtro.includes(num),
        );
        if (coincidencia) {
          numeroConflictivoEdicion = coincidencia;
          return true;
        }
        return false;
      });

      if (contactoPropietarioEdicion) {
        Alert.alert(
          "Número ya registrado",
          `El número ${numeroConflictivoEdicion} ya pertenece al contacto "${contactoPropietarioEdicion.nombre}".\n\nPor favor, revísalo.`,
        );
        return; // 🛑 Bloqueo en edición
      }

      const listaModificada = listaContactos.map((c) =>
        c.id === contactoProcesado.id ? contactoProcesado : c,
      );
      setListaContactos(listaModificada);
      setContactoAEditar(null);
    } else {
      // 👤 MODO CREACIÓN: Dos comprobaciones (Duplicado en otro contacto o fusión)

      let numeroConflictivoCreacion = "";

      // 🚨 FILTRO DE SEGURIDAD GLOBAL: ¿El número ya es de otra persona?
      const contactoPropietarioDelNumero = listaContactos.find((cExistente) => {
        const nombreDiferente =
          cExistente.nombre?.trim().toLowerCase() !==
          contactoProcesado.nombre?.trim().toLowerCase();

        if (!nombreDiferente) return false;

        const numerosExistentes = (cExistente.telefonos || []).map((t) =>
          limpiarTextoTelefono(t.numero),
        );

        // Buscamos el número exacto que está causando el choque
        const coincidencia = numerosNuevosAGuardar.find((num) =>
          numerosExistentes.includes(num),
        );
        if (coincidencia) {
          numeroConflictivoCreacion = coincidencia;
          return true;
        }
        return false;
      });

      if (contactoPropietarioDelNumero) {
        // 🛑 Mensaje detallado con el número y el dueño actual
        Alert.alert(
          "Conflicto de Teléfono",
          `El número [${numeroConflictivoCreacion}] ya está registrado bajo el contacto "${contactoPropietarioDelNumero.nombre}".\n\nCorrige el número o el nombre para continuar.`,
        );
        return;
      }

      // Buscamos si ya existe un contacto con el mismo nombre exacto para fusionar
      const contactoExistenteIndex = listaContactos.findIndex(
        (c) =>
          c.nombre?.trim().toLowerCase() ===
          contactoProcesado.nombre?.trim().toLowerCase(),
      );

      if (contactoExistenteIndex !== -1) {
        // 🧠 FUSIÓN INTELIGENTE
        const contactoExistente = listaContactos[contactoExistenteIndex];

        const numerosExistentesLimpios = (
          contactoExistente.telefonos || []
        ).map((t) => limpiarTextoTelefono(t.numero));

        const telefonosNuevosFiltrados = contactoProcesado.telefonos.filter(
          (tNuevo) => {
            const numNuevoLimpio = limpiarTextoTelefono(tNuevo.numero);
            return !numerosExistentesLimpios.includes(numNuevoLimpio);
          },
        );

        const contactoFusionado = {
          ...contactoExistente,
          telefonos: [
            ...(contactoExistente.telefonos || []),
            ...telefonosNuevosFiltrados,
          ],
        };

        const listaFucionada = [...listaContactos];
        listaFucionada[contactoExistenteIndex] = contactoFusionado;

        setListaContactos(listaFucionada);
      } else {
        // 🆕 CONTACTO NUEVO REAL
        setListaContactos([contactoProcesado, ...listaContactos]);
      }
    }

    setMostarFormulario(false);
  };

  // ******** Fin GuardarContactoGlobal ***************************

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

  // 🔗 FUNCIÓN PARA COMPARTIR UN CONTACTO INDIVIDUAL COMO TEXTO
  const compartirContactoIndividual = async (contacto) => {
    try {
      // 1. Formateamos la lista de teléfonos de manera ordenada
      const textoTelefonos = (contacto.telefonos || [])
        .map((t) => `• ${t.etiqueta || "Móvil"}: ${t.numero}`)
        .join("\n");

      // 2. Construimos el bloque de texto con los datos existentes
      let mensaje = `👤 Contacto: ${contacto.nombre}\n`;

      if (textoTelefonos) mensaje += `📱 Teléfonos:\n${textoTelefonos}\n`;
      if (contacto.empresa) mensaje += `🏢 Empresa: ${contacto.empresa}\n`;
      if (contacto.correo) mensaje += `✉️ Correo: ${contacto.correo}\n`;
      if (contacto.direccion)
        mensaje += `📍 Dirección: ${contacto.direccion}\n`;
      if (contacto.nota) mensaje += `📝 Nota: ${contacto.nota}\n`;

      // 3. Invocamos la ventana nativa de compartir del móvil
      await Share.share({
        message: mensaje,
        title: `Compartir contacto - ${contacto.nombre}`, // Para sistemas que lo soporten
      });
    } catch (error) {
      Alert.alert("Error", "No se pudo compartir el contacto.");
    }
  };

  // 📋 FUNCIÓN PARA IMPORTAR UN ÚNICO CONTACTO DESDE EL PORTAPAPELES
  const importarDesdePortapapeles = async () => {
    try {
      // 1. Leer el contenido del portapapeles
      const textoCopiado = await Clipboard.getStringAsync();

      if (!textoCopiado || !textoCopiado.includes("👤 Contacto:")) {
        Alert.alert(
          "Portapapeles vacío o no válido",
          "No hemos detectado un contacto válido copiado. Primero copia el mensaje de WhatsApp e inténtalo de nuevo.",
        );
        return;
      }

      // 2. Procesar el texto línea por línea con expresiones regulares básicas
      const lineas = textoCopiado.split("\n");
      let nombreExtraido = "";
      let telefonosExtraidos = [];

      lineas.forEach((linea) => {
        // Extraer Nombre
        if (linea.includes("👤 Contacto:")) {
          nombreExtraido = linea.replace("👤 Contacto:", "").trim();
        }
        // Extraer Teléfonos (líneas que empiezan con el punto •)
        if (linea.trim().startsWith("•")) {
          // Separamos la etiqueta del número buscando los dos puntos (:)
          const partes = linea.replace("•", "").split(":");
          if (partes.length >= 2) {
            const etiqueta = partes[0].trim();
            const numero = partes[1].trim();
            if (numero) {
              telefonosExtraidos.push({
                id: Date.now().toString() + Math.random().toString(),
                etiqueta: etiqueta || "Móvil",
                numero: numero,
              });
            }
          }
        }
      });

      if (!nombreExtraido) {
        Alert.alert("Error", "No se pudo identificar el nombre del contacto.");
        return;
      }

      // 3. Construir el objeto de contacto estructurado
      const contactoProcesado = {
        id: Date.now().toString(), // ID temporal si es nuevo
        nombre: nombreExtraido,
        telefonos: telefonosExtraidos,
        empresa: textoCopiado.match(/🏢 Empresa:\s*(.*)/)?.[1]?.trim() || "",
        correo: textoCopiado.match(/✉️ Correo:\s*(.*)/)?.[1]?.trim() || "",
        direccion:
          textoCopiado.match(/📍 Dirección:\s*(.*)/)?.[1]?.trim() || "",
        nota: textoCopiado.match(/📝 Nota:\s*(.*)/)?.[1]?.trim() || "",
      };

      // 4. 🧠 LA MAGIA: Se lo pasamos a tu validador global para que aplique los filtros
      // Pasamos un clon para que actúe igual que el formulario
      guardarContactoGlobal(contactoProcesado);

      Alert.alert(
        "¡Logrado! 🎉",
        `El contacto "${nombreExtraido}" ha sido procesado y verificado con éxito.`,
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Hubo un fallo al leer el portapapeles.");
    }
  };

  // ***********************************     RENDERIZADO     ****************************************************
  return (
    <View style={globalStyles.container}>
      {/* 🌟 El título se queda fijo arriba siempre */}
      <View style={styles.contenedorHeaderPrincipal}>
        {/* <View style={styles.recuadroTituloModerno}> */}
        <LinearGradient
          {...GRADIENTE_TITULO}
          style={styles.recuadroTituloModerno}
        >
          {/* 🔘 BOTÓN FLOTANTE DEL ENGRANAJE (Abajo a la izquierda) */}
          <TouchableOpacity
            style={styles.iconoEngranaje}
            onPress={() => setMostrarAjustes(true)}
          >
            <Text style={{ fontSize: 15 }}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={cambioDireccionOrden}>
            <Image
              source={require("./assets/ordenar.png")}
              style={styles.flechaOrdenar}
            />
          </TouchableOpacity>
          <Text style={styles.textoTituloPrincipal}>Contactos</Text>
          <TouchableOpacity onPress={() => setMostrarAyuda(true)}>
            <Image
              source={require("./assets/ayuda.png")}
              style={styles.iconoPngTitulo}
            />
          </TouchableOpacity>
          {/* <Text style={styles.emojisTitulo}>📇</Text> */}
          <TouchableOpacity
            onPress={() => contactarme()}
            style={styles.btnAyudaFlotante}
          >
            <Image
              source={require("./assets/contacto.png")}
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
                source={require("./assets/agrerarContacto.png")}
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
                compartirContactoIndividual={compartirContactoIndividual} // <--- ¡Añadimos esta línea!
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
      {/* 🙋‍♂️ VENTANA EMERGENTE DE AYUDA */}
      <Modal
        animationType="slide" // Hace que la pantalla suba elegantemente desde abajo
        transparent={true} // Permite que el fondo de la app se intuya detrás con opacidad
        visible={mostrarAyuda}
        onRequestClose={() => setMostrarAyuda(false)} // Controla el botón "atrás" físico de Android
      >
        <View style={styles.contenedorCentradoModal}>
          <View style={styles.tarjetaAyuda}>
            {/* Cabecera de la ventana de ayuda */}
            <View style={styles.cabeceraModal}>
              <TouchableOpacity onPress={() => setMostrarAyuda(false)}>
                <View style={styles.subCabecera}>
                  <Text style={styles.tituloModal}>❓ Guía de Uso Rápido</Text>
                  <Text style={styles.botonCerrarModal}>❌</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Cuerpo de la ayuda con Scroll por si el texto crece */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.subtituloAyuda}>
                🔤 Ordenación de Contactos
              </Text>
              <Text style={styles.textoAyuda}>
                Toca las flechas (↕) en la cabecera para alternar el orden, por
                nombre, de tus contactos de la A-Z o de la Z-A.
              </Text>
              <Text style={styles.subtituloAyuda}>🔍 Búsqueda Inteligente</Text>
              <Text style={styles.textoAyuda}>
                Escribe en la barra superior. El filtro buscará simultáneamente
                por Nombre, Teléfono o las Notas que hayas guardado.
              </Text>
              <Text style={styles.subtituloAyuda}>
                👨‍💻 Gestión de edición, borrar o crear.
              </Text>
              <Text style={styles.textoAyuda}>
                Usa el ✏️ para editar los datos de un contacto o la ❌ para
                eliminarlo, o cerrar una ventana. Con el ➕ agrega un nuevo
                contacto.
              </Text>
              <Text style={styles.subtituloAyuda}>
                🔓 Expansión de un Contacto
              </Text>
              <Text style={styles.textoAyuda}>
                Haz clic en área vacía de la tarjeta de un contacto, para
                expandirla o contraerla y ver toda la info del contacto.
              </Text>
              <Text style={styles.subtituloAyuda}>📞 Llamadas Directas</Text>
              <Text style={styles.textoAyuda}>
                Toca directamente el número de teléfono subrayado para iniciar
                llamada. Al crear, incluye el código de área, antes del nùmero,
                ej: +34
              </Text>

              <Text style={styles.subtituloAyuda}>📞 Multi-teléfonos</Text>
              <Text style={styles.textoAyuda}>
                Puedes añadir los teléfonos que necesites por contacto. Tocando
                la etiqueta del tipo de teléfono (Móvil, Casa, Trabajo, Otros...
                se repiten) estas cambiaran para que asignes la más conveniente.
              </Text>

              <Text style={styles.subtituloAyuda}>📧 Correo Directo</Text>
              <Text style={styles.textoAyuda}>
                Clic sobre la dirección del email guardado, para abrir la
                aplicación de correo con ese destinatario.
              </Text>
              <Text style={styles.subtituloAyuda}>📍Dirección en Maps</Text>
              <Text style={styles.textoAyuda}>
                Si colocas una dirección que Maps reconozca, te la mostrará en
                el mapa, al hacer clic en ella.
              </Text>

              <Text style={styles.subtituloAyuda}>🗒️ Nota por contacto</Text>
              <Text style={styles.textoAyuda}>
                En cada contacto puedes agregar, si lo deseas, una nota o
                detalle que consideres.
              </Text>

              <Text style={styles.subtituloAyuda}>🔘 Campos opcionales</Text>
              <Text style={styles.textoAyuda}>
                El nombre y un telefono son obligatorios. Resto son opcionales.
              </Text>

              <Text style={styles.versionApp}>
                Versión 1.0.0 • Desarrollada por Félix C. López B.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* ⚙️ MODAL DE AJUSTES GLOBALES (IMPORTAR / EXPORTAR BD) */}
      <Modal
        visible={mostrarAjustes}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMostrarAjustes(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)", // Fondo oscurecido
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: "80%",
              padding: 20,
              borderRadius: 12,
              elevation: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
                ⚙️ Ajustes de Copias
              </Text>
              <TouchableOpacity onPress={() => setMostrarAjustes(false)}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>❌</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: "#28a745",
                padding: 14,
                borderRadius: 8,
                alignItems: "center",
                marginBottom: 12,
              }}
              onPress={() => {
                setMostrarAjustes(false);
                exportarContactos(); // Exportar BD completa
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                📤 Exportar Base de Datos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#007bff",
                padding: 14,
                borderRadius: 8,
                alignItems: "center",
              }}
              onPress={() => {
                setMostrarAjustes(false);
                importarContactos(setListaContactos); // Importar BD completa
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                📥 Importar Base de Datos
              </Text>
            </TouchableOpacity>
            {/* Botón nuevo: Importar Individual */}
            <TouchableOpacity
              style={{
                backgroundColor: "#17a2b8", // Un bonito color turquesa/info
                padding: 14,
                borderRadius: 8,
                alignItems: "center",
                marginTop: 12, // Más separación para marcar que es diferente a la BD completa
              }}
              onPress={() => {
                setMostrarAjustes(false);
                importarDesdePortapapeles(); // <--- Llamada a la nueva función
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                📋 Importar desde Portapapeles
              </Text>
            </TouchableOpacity>

            {/* Separador visual fino */}
            <View
              style={{ height: 1, backgroundColor: "#eee", marginBottom: 20 }}
            />
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}

// **********************    FIN  RENDERIZADO     ************************************

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
  iconoEngranaje: {
    position: "absolute",
    top: 1, // Ajusta esta altura para alinearlo con tu botón "+"
    left: 3,
    width: 25,
    height: 25,
    padding: 2,
  },
  iconoPngAyuda: {
    width: 18,
    height: 18,
    resizeMode: "contain",
    // tintColor:'#ffffff'
  },
  btnAyudaFlotante: {
    position: "absolute",
    right: 3,
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
    paddingLeft: 8,
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
  contenedorCentradoModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro semitransparente que resalta el modal
    padding: 3,
  },
  tarjetaAyuda: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxHeight: "80%", // Evita que se coma toda la pantalla en dispositivos pequeños
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Sombra para Android
  },
  // cabeceraModal: {
  //   // flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   borderBottomWidth: 1,
  //   borderBottomColor: "#e2e8f0",
  //   paddingBottom: 12,
  //   marginBottom: 15,
  // },
  subCabecera: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 10,
  },
  tituloModal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  botonCerrarModal: {
    fontSize: 18,
    padding: 4,
  },
  subtituloAyuda: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e40af",
    marginTop: 12,
    marginBottom: 4,
  },
  textoAyuda: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
    marginBottom: 8,
  },
  versionApp: {
    fontSize: 11,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 25,
    fontStyle: "italic",
  },
});

const GRADIENTE_TITULO = {
  colors: ["#1e3a8a", "#3b82f6"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 }, // Gradiente horizontal elegante
};
