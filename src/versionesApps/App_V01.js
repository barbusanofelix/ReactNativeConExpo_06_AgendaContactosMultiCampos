// App_V01.js en 06_AgendaContactosMultiCampos: Version Inicial
import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function App_V01() {
  // NUEVO MODELO DE DATOS: Array de objetos con sub-arrays de teléfonos
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

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📒 Agenda Multi-Campos (Evolución)</Text>

      {/* De momento dejamos este texto para verificar que el proyecto arranca */}
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        Proyecto 06 creado con éxito. Estructura de datos lista en memoria RAM.
      </Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 20,
  },
});
