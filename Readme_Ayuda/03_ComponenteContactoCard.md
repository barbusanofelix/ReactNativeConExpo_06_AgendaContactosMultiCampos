[regresar al anterior: 02_EstilosCentralizados_globalStyles](02_EstilosCentralizados_globalStyles.md)

# El Componente: ContactoCard ( src/components/ContactoCard.js )
Ahora vamos a crear la tarjeta de visualización. Esta tarjeta recibirá el objeto del contacto por propiedades (props). 
Ahora item.telefonos es un array, usaremos .map() para dibujar tantas líneas de teléfono como tenga guardadas el contacto.

Crea el archivo src/components/ContactoCard.js con este código fácil de entender:

---
```jsx
// src/components/ContactoCard.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { globalStyles, colores } from "../styles/globalStyles";

export default function ContactoCard({ contacto, onBorrarContacto, onEditarSeleccion }) {
  return (
    <View style={globalStyles.card}>
      {/* BLOQUE IZQUIERDO: Información del contacto */}
      <View style={{ flex: 1 }}>
        <Text style={globalStyles.cardNombre}>{contacto.nombre}</Text>
        
        {/* RECORREMOS EL ARRAY DE TELÉFONOS DINÁMICAMENTE */}
        {contacto.telefonos.map((tel) => (
          <View key={tel.id} style={globalStyles.filaTelefono}>
            {/* Pintamos la etiqueta (Móvil, Trabajo...) metida en una pequeña caja */}
            <Text style={globalStyles.etiquetaTelefono}>{tel.etiqueta}</Text>
            {/* Pintamos el número al lado */}
            <Text style={globalStyles.numeroTelefono}>📞 {tel.numero}</Text>
          </View>
        ))}
      </View>

      {/* BLOQUE DERECHO: Botones de Acción (Lápiz y Cruz) */}
      <View style={{ flexDirection: "row", gap: 15 }}>
        <TouchableOpacity onPress={() => onEditarSeleccion(contacto)}>
          <Text style={{ fontSize: 20 }}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onBorrarContacto(contacto.id, contacto.nombre)}>
          <Text style={{ fontSize: 20 }}>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```
---

[Avanzar a siguiente: Componente Formulario  04_FormularioDinamico_Contacto](04_FormularioDinamico_Contacto.md)