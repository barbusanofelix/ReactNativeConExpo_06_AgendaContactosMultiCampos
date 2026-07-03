// CabeceraGradient.js
import React from "react";
// Antes hay que instalar la libreria en el proyecto: "npx expo install expo-linear-gradient"
import { LinearGradient } from "expo-linear-gradient";

// Children son los hijos que envolvera CabeceraGradient
// style: Lee el style junto a la llamada de CabeceraGradient
export default function CabeceraGradient({ children, style }) {
  return (
    <LinearGradient
      colors={["#1e3a8a", "#3b82f6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={style}
    >
      {/*  Aqui estaran los hijos , que son las etiuetas envueltas por CaberaGradient */}
      {children}
    </LinearGradient>
  );
}
