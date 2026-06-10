// src/components/ContactoCard_V01.js
// Esta es la version original sin cambios en el archivo.
// Para no estar cambiando el enlace de los archivos la nueva version se seguira llamando ContactoCard.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { globalStyles, colores } from "../styles/globalStyles";

export default function ContactoCard({
  contacto,
  onBorrarContacto,
  onEditarSeleccion,
}) {
  return (
    <View style={globalStyles.card}>
      {/* BLOQUE IZQUIERDO: Información del contacto */}
      <View style={{ flex: 1 }}>
        <Text style={globalStyles.cardNombre}>{contacto.nombre}</Text>

        {/* RECORREMOS EL ARRAY DE TELÉFONOS DINÁMICAMENTE */}
        {contacto.telefonos.map((tel) => (
          <View key={tel.id} style={globalStyles.filaTelefono}>
            {/* 1. Pintamos la etiqueta (Móvil, Trabajo...) metida en una pequeña caja */}
            <Text style={globalStyles.etiquetaTelefono}>{tel.etiqueta}</Text>

            {/* 2 Nuevo. El icono 📞 independiente para que sirva de eje de alineacion */}
            <Text style={globalStyles.iconoTelefono}>📞</Text>

            {/* 3 Pintamos el número limpio con el flex responsivo */}
            <Text style={globalStyles.numeroTelefono} numberOfLines={1}>
              {tel.numero}
            </Text>
          </View>
        ))}
      </View>

      {/* BLOQUE DERECHO: Botones de Acción (Lápiz y Cruz) */}
      <View style={{ flexDirection: "row", gap: 15 }}>
        <TouchableOpacity onPress={() => onEditarSeleccion(contacto)}>
          <Text style={{ fontSize: 20 }}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onBorrarContacto(contacto.id, contacto.nombre)}
        >
          <Text style={{ fontSize: 20 }}>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
