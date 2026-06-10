El siguiente paso es preparar la interfaz para la llegada masiva de nuevos campos (correo, empresa, notas) en la futura version V05. 
Para evitar que la pantalla se sature, vamos a programar el mecanismo de la Tarjeta Acordeón o Desplegable dentro de tu componente ContactoCard.js.

## 🧠 El Razonamiento Técnico del Despliegue
Actualmente, ContactoCard es un componente pasivo: recibe un contacto por props y lo pinta completo de golpe (recorriendo todos los teléfonos que tenga).

Para lograr el efecto acordeón, necesitamos que la tarjeta se vuelva activa e inteligente:
1. Un estado interno: 
Añadiremos un estado booleano local llamado expandido (que arrancará en false).

2. Interactividad: 
Envolveremos la tarjeta en un ``<TouchableOpacity>``. Cuando el usuario pulse cualquier parte de la tarjeta, el estado expandido cambiará al valor contrario (!expandido).

3.Renderizado Condicional:
 * Si está contraída (false): 
 Mostrará solo el nombre del contacto, sus botones de editar/borrar y, para dar pistas de que hay más dentro, mostraremos únicamente su primer teléfono.

* Si está expandida (true): 
La tarjeta se abrirá hacia abajo para revelar la lista completa de todos sus teléfonos (y en la V05, los campos de correo, empresa, etc.).

## 🛠️ Paso 1: Modificando la Estructura en ContactoCard.js
1. Mantener la version anterior .Abrimos el archivo src/components/ContactoCard.js. 
* Para no perder la version original, le cambiamos el nombre a ContactoCard_V01.js
* La nueva version mantiene el nombre original, es decir, ContactoCard.js para evitar enredarnos con las referencias y distintas importaciones que apuntan a ContactoCard.js

2. Vamos a importar useState para controlar la apertura y a reestructurar el componente respetando fielmente tus estilos originales.

3. Reemplaza el código actual de tu ContactoCard.js por esta estructura lógica:

---
```jsx
// src/components/ContactoCard.js
import React, { useState } from "react"; // ◄--- Importamos useState para el acordeón
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colores } from "../styles/globalStyles";

export default function ContactoCard({ contacto, onEliminar, onEditar }) {
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
          <TouchableOpacity onPress={() => onEditar(contacto)} style={styles.btnAccion}>
            <Text style={{ fontSize: 20 }}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onEliminar(contacto.id, contacto.nombre)} style={styles.btnAccion}>
            <Text style={{ fontSize: 20 }}>❌</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔽 SECCIÓN INFERIOR DINÁMICA (Cuerpo de la tarjeta) */}
      <View style={styles.cuerpoTarjeta}>
        {!expandido ? (
          // 🔸 VISTA COMPACTA: Muestra solo el primer teléfono
          primerTelefono && (
            <View style={styles.filaTelefonoCompacta}>
              <View style={styles.badgeEtiqueta}>
                <Text style={styles.textoBadge}>{primerTelefono.etiqueta}</Text>
              </View>
              <Text style={styles.numero}>📞 {primerTelefono.numero}</Text>
              
              {/* Indicador visual de que hay más teléfonos dentro */}
              {tieneMasTelefonos && (
                <Text style={styles.indicadorMas}>+{contacto.telefonos.length - 1} más...</Text>
              )}
            </View>
          )
        ) : (
          // 🔹 VISTA EXPANDIDA: Muestra TODOS los teléfonos en una lista limpia
          <View style={styles.contenedorExpandido}>
            <Text style={styles.subtituloSeccion}>📞 Números Registrados:</Text>
            
            {contacto.telefonos.map((tel) => (
              <View key={tel.id} style={styles.filaTelefonoExpandida}>
                <View style={styles.badgeEtiqueta}>
                  <Text style={styles.textoBadge}>{tel.etiqueta}</Text>
                </View>
                <Text style={styles.numero}>📞 {tel.numero}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
```
---

📐 Paso 2: Los Estilos para la Tarjeta Inteligente
Para que visualmente se note el cambio entre estar abierta y cerrada, y mantengamos la simetría perfecta que ya lograste, añade o actualiza los estilos al final del mismo archivo ContactoCard.js:

JavaScript
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
});
⏱️ Parada de Control y Prueba de Fuego
Hagamos una pausa metodológica aquí para que lo pruebes en tu Samsung A34:

Abre la app. Verás que Carlos (que tiene dos teléfonos) ahora se muestra idéntico a Pepe o Petra: ocupando una sola fila compacta muy elegante, con un aviso sutil a la derecha que dice +1 más....

Dale un toque a la tarjeta de Carlos.

Cuéntame qué tal se siente el despliegue, si revela correctamente la lista completa de teléfonos y si se encoge de nuevo al volver a tocarla. ¡Vamos paso a paso!