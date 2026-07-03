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
  Image,
} from "react-native";
import { colores } from "../styles/globalStyles";

//Icono Salvar archivo disquete abierto by Custom Icon Design on <a href="https://icon-icons.com/es/authors/9-custom-icon-design">Icon-Icons.com</a>
// Icono Guardar by Custom Icon Design on <a href="https://icon-icons.com/es/authors/9-custom-icon-design">Icon-Icons.com</a>
//Icono Guardar by Custom Icon Design on <a href="https://icon-icons.com/es/authors/9-custom-icon-design">Icon-Icons.com</a>

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
  // Para Si ya exite , al estado le asignamos la direccion y sino le asignamos ""
  const [correo, setCorreo] = useState(
    contactoAEditar && contactoAEditar.correo ? contactoAEditar.correo : "",
  );

  const [direccion, setDireccion] = useState(
    contactoAEditar && contactoAEditar.direccion
      ? contactoAEditar.direccion
      : "",
  );

  const [nota, setNota] = useState(
    contactoAEditar && contactoAEditar.nota ? contactoAEditar.nota : "",
  );

  // Para ocultar o mostrar en el formulario o ocultar los campos ( Idea central = No mostrar campos vacios)
  const [verEmpresa, setVerEmpresa] = useState(empresa.trim() !== "");
  const [verCorreo, setVerCorreo] = useState(correo.trim() !== "");
  const [verDireccion, setVerDireccion] = useState(direccion.trim() !== "");
  const [verNota, setVerNota] = useState(nota.trim() !== "");

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
    // ✉️ EXPRESIÓN REGULAR PARA CORREO ELECTRÓNICO ESTÁNDAR
    const regexCorreoValido =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const correoLimpio = correo.trim();

    // 🎯 REGLA: Solo validamos si el usuario escribió algo en el campo
    if (correoLimpio !== "") {
      if (!regexCorreoValido.test(correoLimpio)) {
        Alert.alert(
          "Error de Formato",
          "El correo electrónico ingresado no es válido.\n\nEjemplo correcto: usuario@dominio.com",
        );
        return; // 🛑 Frenamos el guardado de inmediato si el correo está mal escrito
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
      direccion: direccion.trim(), // Añadimos la direccion
      nota: nota.trim(), // Añadimos la nota, sin espacion vacios antes o despues de todo el texto.
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
          <View style={styles.contenedorGuardarSalir}>
            <TouchableOpacity onPress={presionarGuardar}>
              <Image
                source={require("../../assets/guardar.png")}
                style={styles.btnGuardar}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={cancelarMostrarFormYEdicion}
              style={styles.btnCerrarSuperior}
            >
              <Text>❌</Text>
            </TouchableOpacity>
          </View>
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

        {/* 🏢 EMPRESA */}
        {!verEmpresa ? (
          <TouchableOpacity
            style={styles.btnAñadirSeccionExtra}
            onPress={() => setVerEmpresa(true)}
          >
            <Text style={styles.textoBtnExtra}>➕ Añadir Empresa</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.bloqueCampoAbierto}>
            <Text style={styles.label}>Empresa (Opcional):</Text>
            <View style={styles.contenedorInputAccion}>
              <TextInput
                style={styles.inputFlexible}
                placeholder="Ej: Roca, Google..."
                placeholderTextColor="#999"
                value={empresa}
                onChangeText={setEmpresa}
              />
              {/* 🎯 CONDICIÓN: Solo se muestra si el campo NO está vacío */}
              {empresa.trim() !== "" && (
                <TouchableOpacity
                  style={styles.btnEliminarFila}
                  onPress={() => {
                    setEmpresa("");
                    setVerEmpresa(false);
                  }}
                >
                  <Text style={{ fontSize: 16 }}>🗑️</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* ✉️ CORREO ELECTRÓNICO */}
        {!verCorreo ? (
          <TouchableOpacity
            style={styles.btnAñadirSeccionExtra}
            onPress={() => setVerCorreo(true)}
          >
            <Text style={styles.textoBtnExtra}>
              ➕ Añadir Correo Electrónico
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.bloqueCampoAbierto}>
            <Text style={styles.label}>Correo (Opcional):</Text>
            <View style={styles.contenedorInputAccion}>
              <TextInput
                style={styles.inputFlexible}
                placeholder="Ej: pepito@correo.com"
                placeholderTextColor="#999"
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {/* 🎯 CONDICIÓN: Solo se muestra si el campo NO está vacío */}
              {correo.trim() !== "" && (
                <TouchableOpacity
                  style={styles.btnEliminarFila}
                  onPress={() => {
                    setCorreo("");
                    setVerCorreo(false);
                  }}
                >
                  <Text style={{ fontSize: 16 }}>🗑️</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* 🏠 DIRECCIÓN */}
        {!verDireccion ? (
          <TouchableOpacity
            style={styles.btnAñadirSeccionExtra}
            onPress={() => setVerDireccion(true)}
          >
            <Text style={styles.textoBtnExtra}>➕ Añadir Dirección</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.bloqueCampoAbierto}>
            <Text style={styles.label}>Dirección (Opcional):</Text>
            <View style={styles.contenedorInputAccion}>
              <TextInput
                style={[styles.inputFlexible, styles.inputMultiline]}
                placeholder="Ej: Av. Atlántico, #10..."
                placeholderTextColor="#999"
                value={direccion}
                onChangeText={setDireccion}
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
              />
              {/* 🎯 CONDICIÓN: Solo se muestra si el campo NO está vacío */}
              {direccion.trim() !== "" && (
                <TouchableOpacity
                  style={styles.btnEliminarFila}
                  onPress={() => {
                    setDireccion("");
                    setVerDireccion(false);
                  }}
                >
                  <Text style={{ fontSize: 16 }}>🗑️</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* 📝 NOTA */}
        {!verNota ? (
          <TouchableOpacity
            style={styles.btnAñadirSeccionExtra}
            onPress={() => setVerNota(true)}
          >
            <Text style={styles.textoBtnExtra}>➕ Añadir Nota</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.bloqueCampoAbierto}>
            <Text style={styles.label}>Nota (Opcional):</Text>
            <View style={styles.contenedorInputAccion}>
              <TextInput
                style={[styles.inputFlexible, styles.inputMultiline]}
                placeholder="Si quieres, agrega un comentario..."
                placeholderTextColor="#999"
                value={nota}
                onChangeText={setNota}
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
              />
              {/* 🎯 CONDICIÓN: Solo se muestra si el campo NO está vacío */}
              {nota.trim() !== "" && (
                <TouchableOpacity
                  style={styles.btnEliminarFila}
                  onPress={() => {
                    setNota("");
                    setVerNota(false);
                  }}
                >
                  <Text style={{ fontSize: 16 }}>🗑️</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Botonera de guardar y cancelar */}
        {/* <View style={styles.botonera}>
          <TouchableOpacity
            onPress={presionarGuardar}
            style={styles.btnGuardar}
          >
            <Image source={require("../../assets/guardar.png")} />
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
        </View> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  cabeceraForm: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contenedorGuardarSalir: {
    flexDirection: "row",
    gap: 8,

    // alignSelf:'auto',
    alignItems: "center",
  },
  btnCerrarSuperior: {
    // color: "#d8d2d2",
    padding: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#edcaca",
    marginBottom: 4,
    marginTop: 3,
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
    alignSelf: "auto",
    marginBottom: 0,
    marginTop: 9,
  },
  seccionTitulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: colores.textoMutado,
    marginTop: 5,
    marginBottom: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    marginBottom: 1,
    fontSize: 13,
  },

  inputFlexible: {
    borderWidth: 1,
    backgroundColor: "#ffff",
    paddingHorizontal: 12,
    // height: 45,
    borderRadius: 8,
    borderColor: "#ccc",
    marginBottom: 1,
    fontSize: 13,
    flex: 1,
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
    borderColor: "#edcaca",
  },
  btnAñadirFila: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
    marginBottom: 5,
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
    paddingTop: 2,
    width: 35,
    height: 35,
    resizeMode: "contain",
    alignSelf: "auto",
    // flex: 1,
    // backgroundColor: colores.secundario,
    padding: 12,
    // borderRadius: 8,
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
  inputMultiline: {
    height: 80, // 🚀 Le damos más altura para que quepan holgadamente las líneas
    paddingTop: 10, // Espacio interno arriba para que el texto no choque con el borde
  },
  btnAñadirSeccionExtra: {
    backgroundColor: "#f8fafc", // Fondo grisáceo muy suave
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "dashed", // 🚀 Efecto punteado clásico de "añadir elemento opcional"
    alignItems: "flex-start",
    marginVertical: 6,
  },
  textoBtnExtra: {
    color: "#3b82f6", // Azul bonito institucional
    fontWeight: "bold",
    fontSize: 14,
    fontWeight: "600",
  },
  bloqueCampoAbierto: {
    marginVertical: 6,
  },
});
