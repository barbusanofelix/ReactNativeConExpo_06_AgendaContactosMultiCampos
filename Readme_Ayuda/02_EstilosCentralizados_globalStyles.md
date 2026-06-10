[Ir a anterior: 01_CrearEntornoTrabajo](01_CrearEntornoTrabajo_ControlVersiones.md)

# CREACION DE ESTILOS CENTRALIZADOS.

1. Centralizamos los Estilos: src/styles/globalStyles.js

- Crea este archivo.
  - Aquí unificaremos los colores y el diseño de las tarjetas limpias.

Este archivo tiene 2 exports: colores y globalStyles.
* export const colores
* export const globalStyles

Simplemente hacemos un import de ellos para usarlos en otro archivo.

---

```jsx
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
    paddingTop: 60,
    paddingHorizontal: 20,
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
    marginTop: 3,
  },
  etiquetaTelefono: {
    fontSize: 12,
    fontWeight: "bold",
    color: colores.primario,
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  numeroTelefono: {
    fontSize: 14,
    color: colores.textoMutado,
  },
};
```

---

[Avanzar al Componente ContactoCard en  03_ComponeteContactoCard.md](03_ComponeteContactoCard.md)