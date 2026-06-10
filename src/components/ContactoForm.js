// src/components/ContactoForm.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView, // 📜 ¡Nuevo!
  KeyboardAvoidingView, // ⌨️ ¡Nuevo!
  Platform, // 📱 ¡Nuevo! para detectar si es Android
} from "react-native";
import { colores } from "../styles/globalStyles";

export default function ContactoForm({
  guardarContactoGlobal,
  contactoAEditar,
  cancelarMostrarFormYEdicion,
}) {
  const [nombre, setNombre] = useState(
    contactoAEditar ? contactoAEditar.nombre : "",
  );

  // Inicializamos el estado con una fila vacía si es nuevo, o con los teléfonos del contacto si editamos
  const [telefonos, setTelefonos] = useState(
    contactoAEditar
      ? contactoAEditar.telefonos
      : [{ id: Date.now().toString(), etiqueta: "Móvil", numero: "" }],
  );

  const [empresa, setEmpresa] = useState(
    contactoAEditar && contactoAEditar.empresa ? contactoAEditar.empresa : "",
  );

  const [correo, setCorreo] = useState(
    contactoAEditar && contactoAEditar.correo ? contactoAEditar.correo : "",
  );

  // ➕ Función para añadir una nueva fila de teléfono a la pantalla
  const añadirFilaTelefono = () => {
    setTelefonos([
      ...telefonos,
      { id: Date.now().toString(), etiqueta: "Móvil", numero: "" }, // Una nueva fila limpia
    ]);
  };

  // 🗑️ Función para eliminar una fila de teléfono específica en el formulario
  const eliminarFilaTelefono = (idFila) => {
    if (telefonos.length === 1) {
      Alert.alert(
        "Aviso",
        "Un contacto debe tener al menos un número de teléfono.",
      );
      return;
    }
    setTelefonos(telefonos.filter((tel) => tel.id !== idFila));
  };

  // ✍️ Función para actualizar el número escrito en una fila específica
  const manejarCambioNumero = (idFila, texto) => {
    const nuevosTelefonos = telefonos.map((tel) => {
      if (tel.id === idFila) {
        return { ...tel, numero: texto }; // Actualizamos solo el número de esta fila
      }
      return tel;
    });
    setTelefonos(nuevosTelefonos);
  };

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
    };

    // Mandamos al Padre el cpontactoListo
    guardarContactoGlobal(contactoListo); //
  };

  return (
    // Evitar que teclado tape los campos: Ver 20_Resolver_Teclado_Tapa_El_Campo_con_Foco.md
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {/* paso 2: Permite deslizar libremente los campos si la pantalla es corta */}
      <ScrollView
        contentContainerStyle={styles.scrollFormulario}
        showsVerticalScrollIndicator={false} // Oculta la  barra lateral
      >
        {/* <View style={styles.formularioCard}> */}
        <View style={styles.cabeceraForm}>
          <Text style={styles.subtituloForm}>
            {contactoAEditar ? "📝 Editar Contacto" : "👤 Nuevo Contacto"}
          </Text>
          <TouchableOpacity
            onPress={cancelarMostrarFormYEdicion}
            style={styles.btnCerrarSuperior}
          >
            <Text>❌</Text>
          </TouchableOpacity>
        </View>
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
            {/* Un texto fijo de etiqueta por ahora para mantener la simplicidad: VERSION ORIGINAL */}
            {/* <View style={styles.badgeEtiqueta}>
            <Text style={styles.textoBadge}>{tel.etiqueta}</Text>
          </View> */}
            {/* 🌟º ANTES ERA UN TEXTO FIJO.AHORA ES U BOTON DINAMICO INTERACTIVO DE ROTACION */}
            <TouchableOpacity
              style={styles.badgeEtiqueta}
              onPress={() => rotarEtiqueta(tel.id)} // <--Pasamos el id de la fila a modificar
            >
              <Text style={styles.textoBadge}> {tel.etiqueta}</Text>
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
        ))}

        {/* Botón para agregar más campos de teléfono */}
        <TouchableOpacity
          onPress={añadirFilaTelefono}
          style={styles.btnAñadirFila}
        >
          <Text style={styles.textoBtnAñadir}>➕ Añadir otro teléfono</Text>
        </TouchableOpacity>

        {/* AÑADIR/EDITAR EMPRESA */}
        <Text style={styles.seccionTitulo}>Empresa ( Opcional) </Text>
        <View style={styles.contenedorInputAccion}>
          <TextInput
            style={styles.inputFlexible}
            placeholder="Nombre de Empresa"
            placeholderTextColor="#c1bfbf"
            value={empresa}
            onChangeText={setEmpresa} // Guarda cada letra que se va tipeando ( renderizado nuevo)}
          />

          {/* Botón para borrar esta fila específica */}
          {/* MOSTRAMOS LA CESTA SOLO SI HAY TEXTO */}
          {empresa.trim() !== "" && (
            <TouchableOpacity
              onPress={() => setEmpresa("")} // Vaciamos el estado, La Empresa para eliminarla y pasara vacio hacia guardado
              style={styles.btnEliminarCampo}
            >
              <Text style={{ fontSize: 20 }}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Botonera de guardar y cancelar */}
        <View style={styles.botonera}>
          <TouchableOpacity
            onPress={presionarGuardar}
            style={styles.btnGuardar}
          >
            <Text style={styles.btnTexto}>Guardar</Text>
          </TouchableOpacity>
          {contactoAEditar && (
            <TouchableOpacity
              onPress={cancelarMostrarFormYEdicion}
              style={styles.btnCancelar}
            >
              <Text style={[styles.btnTexto, { color: colores.texto }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {/* </View> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  cabeceraForm: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnCerrarSuperior: {
    color: "#f40505",
    padding: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    marginBottom: 5,
  },

  formularioCard: {
    backgroundColor: colores.blanco,
    padding: 10,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  subtituloForm: {
    fontSize: 16,
    fontWeight: "bold",
    color: colores.primario,
    marginBottom: 0,
    marginTop: 5,
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

  inputFlexible: {
    flex: 1,
    height: 45,
    backgroundColor: "#ffff",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ccc",
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
  contenedorInputAccion: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  btnEliminarCampo: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fee2e2", // Un fondo rojo muy sutil para que haga juego con el borrado
    borderRadius: 8,
  },
  scrollFormulario: {
    paddingBottom: 40, // 🚀 TRUCO: Deja un colchón de espacio abajo para que el último campo (Empresa) suba cómodamente
  },
});
