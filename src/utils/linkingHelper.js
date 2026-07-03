import { Linking, Alert } from "react-native";

export const iniciarLlamada = (numero) => {
  if (!numero) return;
  const numeroLimpio = numero.replace(/[\s-]/g, "");
  const url = `tel:${numeroLimpio}`;

  // Lanzamos la llamada directamente
  Linking.openURL(url).catch((err) => {
    console.error("Error en llamada:", err);
    Alert.alert("Error", "Este dispositivo no soporta realizar llamadas.");
  });
};

export const abrirEnMaps = (direccion) => {
  if (!direccion || direccion.trim() === "") return;

  const direccionCodificada = encodeURIComponent(direccion.trim());

  // 🎯 URL UNIVERSAL OFICIAL: Funciona en PC, Android, Navegadores y APKs nativas
  const url = `https://www.google.com/maps/search/?api=1&query=${direccionCodificada}`;

  // Disparamos directamente para saltar las restricciones de privacidad de la APK
  Linking.openURL(url).catch((err) => {
    console.error("Error al abrir mapas:", err);
    Alert.alert("Error", "No se pudo abrir la aplicación de mapas.");
  });
};

export const iniciarCorreo = (email, asunto = "") => {
  if (!email || email.trim() === "") return;

  const url = `mailto:${email.trim()}?subject=${encodeURIComponent(asunto)}`;

  // Saltamos el filtro de privacidad y forzamos a Android a mostrar las apps de correo
  Linking.openURL(url).catch((err) => {
    console.error("Error al abrir correo:", err);
    Alert.alert(
      "Aviso",
      `No se pudo abrir la app de correo.\n\nDirección: ${email.trim()}`,
    );
  });
};
