// src/styles/globalStyles.js
import { StyleSheet } from "react-native";

export const colores = {
  primario: "#1E3A8A", // Azul oscuro corporativo
  secundario: "#2A6F97", // Azul intermedio para botones
  exito: "#09E243", // Verde para el botón +
  peligro: "#EF4444", // Rojo para borrar
  fondo: "#F5F7FA", // Gris claro de fondo limpio
  blanco: "#FFFFFF",
  texto: "#1F2937", // Gris oscuro para lectura clara
  textoMutado: "#6B7280", // Gris medio para etiquetas pequeñas
};

export const globalStyles = {
  container: {
    flex: 1,
    backgroundColor: colores.fondo,
    paddingTop: 30,
    paddingHorizontal: 12,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: colores.primario,
    textAlign: "center",
    marginBottom: 20,
  },
  // Estilos base para la tarjeta que crearemos a continuación
  card: {
    backgroundColor: colores.blanco,
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: colores.primario,
  },
  cardNombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: colores.texto,
    marginBottom: 5,
  },
  filaTelefono: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    width: "100%", // Ocupa todo el ancho disponible del ancho de la tarjeta
  },
  etiquetaTelefono: {
    // 📐 EL TRUCO MAGISTRAL DE ANCHO FIJO:
    width: 75, // Todas las cajas medirán exactamente lo mismo para alinear la columna de etiquetas y por ende el resto
    fontSize: 12,
    fontWeight: "bold",
    color: colores.secundario,
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
    textAlign: "center", // Centra el texto ("Móvil", "Trabajo"...) dentro de la caja
  },
  numeroTelefono: {
    fontSize: 15,
    color: colores.textoMutado,
    // 🚀 EL TRUCO RESPONSIVO:
    flex: 1, // Se estira de forma inteligente según el tamaño de pantalla
  },
};
