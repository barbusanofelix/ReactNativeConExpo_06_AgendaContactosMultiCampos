# # 1. 🌐 Añadir el campo interactivo de "Correo Electrónico"
Ya implemente el módulo para teléfonos y mapas. Nos queda implementar el uso automatico del correo.
Podríamos conectarlo en la Card de contactos usando el mismo linkingHelper.js.

La lógica nativa: Usar el protocolo mailto:correo@ejemplo.com.

El resultado: Al tocar el correo del contacto en la lista, tu Samsung abrirá de inmediato Gmail (o tu cliente de correo predeterminado) con la dirección de la persona ya escrita en el destinatario, lista para redactar el mensaje.

## 2. 📧 Completando el Módulo Nativo: Correo Electrónico
Vamos a expandir el archivo linkingHelper.js.

Abrios el archivo src/utils/linkingHelper.js  y añadimos esta nueva función exportada: `iniciarCorreo`
La funcion recibirá 2 parametros: 
* email : El email al cual se enviará el email. Como queremos que el email venga a nosotros pues, normalmente, el email será nuestro email.
* asunto: Si no colocamos el asunto, lo asigna vacio.

Un ejemplo se la llamada de la funcion es:
 onPress: () => iniciarCorreo("barbusano3@gmail.com","Sugerencia/Soporte-Agenda Contactos")


```jsx
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
        Alert.alert("Error", "No se encontró ninguna aplicación de correo configurada en este dispositivo.");
      } else {
        return Linking.openURL(url);
      }
    })
    .catch((err) => console.error("Error al abrir la app de correo:", err));
};

```
---







