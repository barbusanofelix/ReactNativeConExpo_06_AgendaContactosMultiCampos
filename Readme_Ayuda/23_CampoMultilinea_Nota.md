# AGREGAR EL CAMPO NOTAS ( CAMPO MULTILINEA )

En este campo aplicaremos lo mismo que aplicamos al campo direccion.

Necesitaremos:

- Crear un useState `notas` en ContactoForm.js.
- Añadir el campo en el formulario con su cesta para borrarlo.
- Al presionar el boton de guardar en la funcion presionarGuardar incluir el campo en el contacto que se enviará al padre para guardalo.

## Añadir el campo al formulario

---

```jsx
     {/* SECCION PARA NOTAS */}
        <Text style={styles.seccionTitulo}>Nota (Op)</Text>
        <View style={styles.contenedorInputAccion}>
          <TextInput
            style={[styles.inputFlexible, styles.inputMultiline]} // Combinamos sus estilos con el especial para multilinea
            placeholder="Si quieres, agrega un comentario..."
            placeholderTextColor="#9999"
            value={nota}
            onChangeText={setNota} // va guardando letra a letra .
            multiline={true} // Permite el salto de linea
            numberOfLines={3} // altura visual 3 lineas
            textAlignVertical="top" // Fuerza el texto a ubicarse arriba a la izquierda
          />
          {/* Botón para borrar esta fila específica */}
          {/* MOSTRAMOS LA CESTA SOLO SI HAY TEXTO EN LA NOTA */}
          {nota.trim() !== "" && (
            <TouchableOpacity
              onPress={() => setNota("")} // Vaciamos el estado de correo => re-renderizado
              style={styles.btnEliminarFila}
            >
              <Text style={{ fontSize: 16 }}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
```

---
