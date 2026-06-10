// src/components/BotonNuevoContacto.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colores } from "../styles/globalStyles";

// Recibe por propiedades (props) la acción que disparará al pulsar el botón
export default function BotonNuevoContacto({ onPresionar }) {
  return (
    <TouchableOpacity 
      style={styles.btnAgregarPrincipal} 
      onPress={() => onPresionar()} // ◄--- Ejecuta la función extendida que le prestó el Padre
    >
      <Text style={styles.textoBtnAgregar}>➕ Nuevo Contacto</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnAgregarPrincipal: {
    backgroundColor: colores.primario,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  textoBtnAgregar: {
    color: colores.blanco,
    fontWeight: "bold",
    fontSize: 16,
  },
});