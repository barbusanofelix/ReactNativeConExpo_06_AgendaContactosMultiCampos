// Modulo para activar llamadas y ubicacion.
// Ver archivo 28_HacerLLamadas_y_Ubicacion.md del pruecto 06_AgendaContactosMultiCampos
import { Linking, Alert } from "react-native";

/**
 * Abre el marcador telefónico nativo con el número provisto.
 * @param {string} numero - Número de teléfono a marcar.
 */
export const iniciarLlamada = (numero) => {
  if (!numero) return;

  // Limpiamos espacios en blanco o guiones por seguridad
  const numeroLimpio = numero.replace(/[\s-]/g, "");
  const url = `tel:${numeroLimpio}`;

  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        Alert.alert(
          "Error",
          "Este dispositivo no soporta realizar llamadas telefónicas.",
        );
      } else {
        return Linking.openURL(url);
      }
    })
    .catch((err) => console.error("Error al abrir la app de teléfono:", err));
};

/**
 * Abre la aplicación de mapas nativa (Google Maps) con la dirección provista.
 * @param {string} direccion - Dirección o coordenadas a buscar.
 */
export const abrirEnMaps = (direccion) => {
  if (!direccion || direccion.trim() === "") return;

  // Codificamos los caracteres especiales para que viaje seguro en la URL
  // Si usamos la siguiente linea, con el geo, mostrara las opciones de software que pueden abrir la ubucacion
  //   const url = `geo:0,0?q=${encodeURIComponent(direccion.trim())}`;

  // 🎯 En lugar de 'geo:', usamos el Deep Link oficial de Google Maps
  // FORZAR A ABRIR DIRECTAMENTE A MAPS.                   // Usamos la siguiente linea
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion.trim())}`;

  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        Alert.alert("Error", "No se puede abrir el mapa en este dispositivo.");
      } else {
        return Linking.openURL(url);
      }
    })
    .catch((err) => console.error("Error al abrir mapas:", err));
};

/**
 * Abre el cliente de correo nativo (como Gmail) listo para redactar.
 * @param {string} email - Destinatario del correo.
 * @param {string} asunto - Asunto predefinido (opcional).
 */
export const iniciarCorreo = (email, asunto = "") => {
  if (!email || email.trim() === "") return;

  // Construimos la URL usando el protocolo estándar mailto
  const url = `mailto:${email.trim()}?subject=${encodeURIComponent(asunto)}`;

  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        Alert.alert(
          "Error",
          "No se encontró ninguna aplicación de correo configurada en este dispositivo.",
        );
      } else {
        return Linking.openURL(url);
      }
    })
    .catch((err) => console.error("Error al abrir la app de correo:", err));
};
