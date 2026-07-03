import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

const STORAGE_KEY = "@agenda_multicampos_v03";

/**
 * 📤 EXPORTAR CONTACTOS (Ya funcionando)
 */
export const exportarContactos = async () => {
  try {
    const datosCrudos = await AsyncStorage.getItem(STORAGE_KEY);
    if (!datosCrudos) {
      Alert.alert("Aviso", "No tienes ningún contacto para exportar.");
      return;
    }
    const contactosObjeto = JSON.parse(datosCrudos);
    if (contactosObjeto.length === 0) {
      Alert.alert("Aviso", "La agenda está vacía.");
      return;
    }

    const textoNormalizado = JSON.stringify(contactosObjeto);
    const rutaArchivo = `${FileSystem.documentDirectory}copia_agenda_contactos.json`;

    await FileSystem.writeAsStringAsync(rutaArchivo, textoNormalizado, {
      encoding: "utf8",
    });

    const sePuedeCompartir = await Sharing.isAvailableAsync();
    if (sePuedeCompartir) {
      await Sharing.shareAsync(rutaArchivo, {
        dialogTitle: "Exportar mi Agenda de Contactos",
        mimeType: "application/json",
      });
    } else {
      Alert.alert("Error", "Tu dispositivo no permite compartir archivos.");
    }
  } catch (error) {
    console.error("Error al exportar:", error);
    Alert.alert("Error", "Ocurrió un fallo al exportar.");
  }
};

/**
 * 📥 IMPORTAR CONTACTOS (Cerebro Inteligente Anti-Duplicados)
 */
// 🎯 CAMBIO 1: Ahora la función recibe "setListaContactos" desde la App.js
export const importarContactos = async (setListaContactos) => {
  try {
    // 1. Abrir el selector de archivos nativo para buscar el archivo JSON
    const resultado = await DocumentPicker.getDocumentAsync({
      type: "application/json",
      copyToCacheDirectory: true,
    });

    if (
      resultado.canceled ||
      !resultado.assets ||
      resultado.assets.length === 0
    ) {
      return;
    }

    const URIArchivo = resultado.assets[0].uri;

    // 2. Leer el contenido del archivo JSON seleccionado
    const contenidoTexto = await FileSystem.readAsStringAsync(URIArchivo, {
      encoding: "utf8",
    });
    const contactosEntrantes = JSON.parse(contenidoTexto);

    if (!Array.isArray(contactosEntrantes)) {
      Alert.alert("Error", "El formato del archivo de respaldos no es válido.");
      return;
    }

    // 3. Leer los contactos que ya existen en el teléfono actual
    const datosLocalesCrudos = await AsyncStorage.getItem(STORAGE_KEY);
    let contactosLocales = datosLocalesCrudos
      ? JSON.parse(datosLocalesCrudos)
      : [];

    let contadorActualizados = 0;
    let contadorInsertados = 0;

    // Función auxiliar para limpiar teléfonos (solo números y +)
    const limpiarTextoTelefono = (tel) =>
      tel ? String(tel).replace(/[^0-9+]/g, "") : "";

    // 4. 🧠 EL MOTOR DE IMPORTACIÓN INTELIGENTE
    contactosEntrantes.forEach((contactoNuevo) => {
      // A. 🧼 Limpieza del contacto entrante (evitar repetidos dentro de su propio array)
      const telefonosUnicosNuevos = [];
      const numerosVistosNuevos = new Set();

      (contactoNuevo.telefonos || []).forEach((tel) => {
        const numLimpio = limpiarTextoTelefono(tel.numero);
        if (numLimpio !== "" && !numerosVistosNuevos.has(numLimpio)) {
          numerosVistosNuevos.add(numLimpio);
          telefonosUnicosNuevos.push({
            ...tel,
            numero: tel.numero.trim(),
          });
        }
      });

      // Si el contacto del archivo no trae teléfonos válidos, saltamos al siguiente
      if (telefonosUnicosNuevos.length === 0) return;

      const numerosNuevosAGuardar = telefonosUnicosNuevos.map((t) =>
        limpiarTextoTelefono(t.numero),
      );

      // B. 🚨 CONTROL DE CONFLICTO: ¿Alguno de estos números ya le pertenece a OTRA persona localmente?
      const perteneceAOtro = contactosLocales.some((cLocal) => {
        const nombreDiferente =
          cLocal.nombre?.trim().toLowerCase() !==
          contactoNuevo.nombre?.trim().toLowerCase();

        if (!nombreDiferente) return false;

        const numerosLocales = (cLocal.telefonos || []).map((t) =>
          limpiarTextoTelefono(t.numero),
        );
        return numerosNuevosAGuardar.some((num) =>
          numerosLocales.includes(num),
        );
      });

      // Si el número ya está registrado a nombre de otra persona diferente, ignoramos el contacto para no corromper la agenda
      if (perteneceAOtro) {
        return;
      }

      // C. 🔍 BUSQUEDA POR NOMBRE: ¿Ya existe este contacto en la agenda?
      const indiceLocalPorNombre = contactosLocales.findIndex(
        (cLocal) =>
          cLocal.nombre?.trim().toLowerCase() ===
          contactoNuevo.nombre?.trim().toLowerCase(),
      );

      if (indiceLocalPorNombre !== -1) {
        // 🧠 ¡FUSIÓN!: El nombre coincide, añadimos solo los teléfonos que no tenga
        const contactoLocalExistente = contactosLocales[indiceLocalPorNombre];

        const numerosLocalesLimpios = (
          contactoLocalExistente.telefonos || []
        ).map((t) => limpiarTextoTelefono(t.numero));

        // Filtramos para dejar solo los números del archivo que la ficha local NO tenga
        const telefonosNuevosFiltrados = telefonosUnicosNuevos.filter(
          (tNuevo) => {
            const numNuevoLimpio = limpiarTextoTelefono(tNuevo.numero);
            return !numerosLocalesLimpios.includes(numNuevoLimpio);
          },
        );

        // Si hay números nuevos que agregar, actualizamos la ficha local
        if (telefonosNuevosFiltrados.length > 0) {
          contactosLocales[indiceLocalPorNombre] = {
            ...contactoLocalExistente,
            telefonos: [
              ...(contactoLocalExistente.telefonos || []),
              ...telefonosNuevosFiltrados,
            ],
          };
          contadorActualizados++;
        }
      } else {
        // 🆕 NUEVO CONTACTO ABSOLUTO: No existe el nombre ni chocan los números
        const nuevoContactoFormateado = {
          ...contactoNuevo,
          id:
            contactoNuevo.id ||
            Date.now().toString() + Math.random().toString(),
          nombre: contactoNuevo.nombre?.trim(),
          telefonos: telefonosUnicosNuevos,
          empresa: contactoNuevo.empresa?.trim() || "",
          correo: contactoNuevo.correo?.trim() || "",
          direccion: contactoNuevo.direccion?.trim() || "",
          nota: contactoNuevo.nota?.trim() || "",
        };

        contactosLocales.push(nuevoContactoFormateado);
        contadorInsertados++;
      }
    });

    // 5. Guardar la lista unificada y limpia de vuelta en el disco duro
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(contactosLocales));

    // 🎯 CAMBIO 2: Pintar la nueva lista unificada en la pantalla de inmediato
    setListaContactos(contactosLocales);

    // 6. Reporte de éxito al usuario
    Alert.alert(
      "Importación Exitosa 🎉",
      `Proceso completado:\n• ${contadorInsertados} contactos nuevos añadidos.\n• ${contadorActualizados} contactos existentes actualizados con nuevos números.`,
    );
  } catch (error) {
    console.error("Error al importar contactos:", error);
    Alert.alert("Error", "No se pudo leer o procesar el archivo de contactos.");
  }
};
