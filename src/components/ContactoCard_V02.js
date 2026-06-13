// Este archivo ContactoCard_V02 es la copia de ContactoCard, antes de implementar las llamadas al numero.
// src/components/ContactoCard_V02.js
import React, { useState } from "react"; // ◄--- Importamos useState para el acordeón
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colores } from "../styles/globalStyles";
import { iniciarLlamada, abrirEnMaps } from "../utils/linkingHelper"; // Importamos los modulos para llamar y ubicacion en maps



export default function ContactoCard({
  contacto,
  eliminarContactoGlobal,
  editarContactoSeleccionado,
}) {
  // 🔑 ESTADO LOCAL: Controla si esta tarjeta específica está abierta o cerrada
  const [expandido, setExpandido] = useState(false);

  // Tomamos el primer teléfono de la lista para la vista compacta
  const primerTelefono = contacto.telefonos[0];
  // Averiguamos si tiene más de un teléfono guardado
  const tieneMasTelefonos = contacto.telefonos.length > 1;

  return (
    // 🔘 Toda la tarjeta ahora es un botón que conmuta el estado expandido
    <TouchableOpacity
      style={styles.tarjeta}
      onPress={() => setExpandido(!expandido)}
      activeOpacity={0.8} // Evita que parpadee demasiado al pulsar
    >
      {/* LÍNEA SUPERIOR: Nombre y Botones de Acción */}
      <View style={styles.filaSuperior}>
        <Text style={styles.nombre}>{contacto.nombre}</Text>

        {/* Botonera lateral (Detenemos la propagación para que al pulsar el lápiz o la X no se cierre la tarjeta) */}
        <View style={styles.botoneraLateral}>
          <TouchableOpacity
            onPress={() => editarContactoSeleccionado(contacto)} // Lo lanza para la funcion del padre editarConactoSeleccionado
            style={styles.btnAccion}
          >
            <Text style={{ fontSize: 20 }}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => eliminarContactoGlobal(contacto.id, contacto.nombre)}
            style={styles.btnAccion}
          >
            <Text style={{ fontSize: 20 }}>❌</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔽 SECCIÓN INFERIOR DINÁMICA (Cuerpo de la tarjeta) */}
      <View style={styles.cuerpoTarjeta}>
        {!expandido ? (
          // 🔸 VISTA COMPACTA: Muestra solo el primer teléfono (Interactiva)
          primerTelefono && (
            <View style={styles.filaTelefonoCompacta}>
              <View style={styles.badgeEtiqueta}>
                <Text style={styles.textoBadge}>{primerTelefono.etiqueta}</Text>
              </View>

              {/* 🎯 LOGICA: Al tocar el número llama directamente SIN expandir la tarjeta */}
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation(); // 🛑 ¡Freno de mano! Evita que la tarjeta se expanda al llamar
                  iniciarLlamada(primerTelefono.numero);
                }}
                style={styles.btnLinkLlamada}
              >
                <Text style={styles.textoTelefonoInteractivo}>
                  📞 {primerTelefono.numero}
                </Text>
              </TouchableOpacity>

              {/* Indicador visual de que hay más teléfonos dentro */}
              {tieneMasTelefonos && (
                <Text style={styles.indicadorMas}>
                  +{contacto.telefonos.length - 1} más...
                </Text>
              )}
            </View>
          )
        ) : (
          // 🔹 VISTA EXPANDIDA: Muestra TODOS los teléfonos y cada uno puede llamar de forma independiente
          <View style={styles.contenedorExpandido}>
            <Text style={styles.subtituloSeccion}>📞 Números Registrados:</Text>

            {/* 📞 SECCIÓN DE TELÉFONOS REALINEADA EN FILA INTERACTIVA */}
            {contacto.telefonos.map((tel) => (
              <View key={tel.id} style={styles.filaTelefonoExpandida}>
                <View style={styles.badgeEtiqueta}>
                  <Text style={styles.textoBadge}>{tel.etiqueta}</Text>
                </View>

                {/* 🎯 LOGICA: Cada teléfono de la lista es un gatillo de llamada individual */}
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation(); // Por seguridad, también detenemos la propagación aquí
                    iniciarLlamada(tel.numero);
                  }}
                  style={styles.btnLinkLlamada}
                >
                  <Text style={styles.textoTelefonoInteractivo}>
                    📞 {tel.numero}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* ... (Aquí abajo siguen tus bloques de Empresa, Correo, Dirección y Nota) ... */}

            {/* 🏢 SECCIÓN: EMPRESA (Solo si existe y no está vacía) */}
            {contacto.empresa && contacto.empresa.trim() !== "" && (
              <View style={styles.filaDatoExtra}>
                <Text style={styles.iconoExtra}>🏢</Text>
                <View>
                  <Text style={styles.labelExtra}>Empresa</Text>
                  <Text style={styles.textoExtra}>{contacto.empresa}</Text>
                </View>
              </View>
            )}

            {/* ✉️ SECCIÓN: CORREO (Solo si existe y no está vacío) */}
            {contacto.correo && contacto.correo.trim() !== "" && (
              <View style={styles.filaDatoExtra}>
                <Text style={styles.iconoExtra}>✉️</Text>
                <View>
                  <Text style={styles.labelExtra}>Correo Electrónico</Text>
                  <Text style={styles.textoExtra}>{contacto.correo}</Text>
                </View>
              </View>
            )}

            {/* 🏠 SECCIÓN: DIRECCIÓN (Solo si existe y no está vacía) */}
            {contacto.direccion && contacto.direccion.trim() !== "" && (
              <View style={styles.filaDatoExtra}>
                <Text style={styles.iconoExtra}>🏠</Text>
                <View style={styles.contenedorTextoLargo}>
                  <Text style={styles.labelExtra}>Dirección</Text>
                  <Text style={styles.textoExtra}>{contacto.direccion}</Text>
                </View>
              </View>
            )}

            {/* 📝 SECCIÓN: NOTAS (Solo si existe y no está vacía) */}
            {contacto.nota && contacto.nota.trim() !== "" && (
              <View style={styles.filaDatoExtra}>
                <Text style={styles.iconoExtra}>📝</Text>
                <View style={styles.contenedorTextoLargo}>
                  <Text style={styles.labelExtra}>Notas</Text>
                  <Text style={styles.textoExtra}>{contacto.nota}</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    // Sombra suave para Android
    elevation: 3,
    // Línea decorativa lateral izquierda (fiel a tu diseño original)
    borderLeftWidth: 5,
    borderLeftColor: colores.primario,
  },
  filaSuperior: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    flex: 1, // Permite que el nombre ocupe su espacio sin empujar los botones
  },
  botoneraLateral: {
    flexDirection: "row",
    gap: 15,
  },
  btnAccion: {
    padding: 4,
  },
  cuerpoTarjeta: {
    marginTop: 4,
  },
  // Estilos Vista Compacta
  filaTelefonoCompacta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  indicadorMas: {
    fontSize: 12,
    color: colores.textoMutado,
    fontStyle: "italic",
    marginLeft: "auto", // Lo empuja al extremo derecho de la tarjeta
  },
  // Estilos Vista Expandida
  contenedorExpandido: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee", // Una línea sutil de separación interna
    gap: 10,
  },
  subtituloSeccion: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  filaTelefonoExpandida: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 2,
  },
  // Badges y textos (fieles a tu geometría original)
  badgeEtiqueta: {
    backgroundColor: "#e1e7fc",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 70,
    alignItems: "center",
  },
  textoBadge: {
    color: colores.primario,
    fontSize: 13,
    fontWeight: "600",
  },
  numero: {
    fontSize: 15,
    color: "#444",
  },
  // 🌟 ESTILOS PARA LOS CAMPOS EXTRA DE LA V05:
  filaDatoExtra: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9", // Una línea divisoria muy sutil entre datos
  },
  iconoExtra: {
    fontSize: 18,
    marginRight: 12,
    marginTop: 2, // Alinea un poco el emoji con el título
  },
  labelExtra: {
    fontSize: 12,
    color: "#64748b", // Gris azulado elegante para el título del campo
    fontWeight: "600",
  },
  textoExtra: {
    fontSize: 15,
    color: "#1e293b", // Negro suave para el contenido real
    marginTop: 2,
  },
  contenedorTextoLargo: {
    flex: 1, // 🚀 OBLIGATORIO: Evita que si la dirección o nota son muy largas, se salgan de la tarjeta
  },
});
