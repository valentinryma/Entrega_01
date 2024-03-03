const fs = require('fs');

// Valida los campos al crear un nuevo producto, Retorna: 1 ✔ o json error con el campo/s faltante/s.
const validateFields = (product) => {
    const undefinedKey = []; // Arreglo que contrendrá los campos obligatorios faltantes.

    // Setea por defecto el campo "status" en "true"
    for (const key in product) {
        if (key == 'status') {
            if (!product[key]) {
                product[key] = true;
            }
        }

        // Si falta un campo, lo pushea al arreglo de campos faltantes || thumbnails es opcional
        if (!product[key] && key != 'thumbnails') {
            undefinedKey.push(key);
        }
    }

    if (undefinedKey.length > 0) {
        return { error: `the fields [ ${undefinedKey} ] cannot be empty` }
    } else {
        return 1;
    }
}

// Copia el contnido de un archivo en otro: Lo uso para resetear los archivos carritos.json y productos.json
const resetDB = async (from, to) => {
    await fs.copyFile(from, to, (err) => {
        if (err) {
            console.error(`Error: ${err.message}`);
            return
        }
    });
}

module.exports = { validateFields, resetDB };


