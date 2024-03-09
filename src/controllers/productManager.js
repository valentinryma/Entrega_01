const fs = require('node:fs'); // Gestro de Archivos
const { validateFields } = require(`${__dirname}/../utils.js`) // Funcion que valida los campos al crear un producto

// Creacion de una clase encarga de gestionar los productos.
class ProductManager {
    constructor(path) {
        // Ruta donde se almacenan los datos (los productos)
        this._path = path;
    }

    // Método privado encargado de crear un id
    #getNewId = (array) => {
        return array.length > 0 ? array[array.length - 1].id + 1 : 1
    }

    async getProducts() {
        // Retorna todos los productos existentes

        try {
            // Lee el contenido del archivo donde se almacenan los producto y los gurada en un objeto.
            const fileContent = await fs.promises.readFile(this._path);
            const productsAll = JSON.parse(fileContent);

            return productsAll;
        } catch (error) {
            console.error(error);
            return { error: "Error in getProducts" }
        }
    }

    async getProductById(id) {
        // Obtiene un producto por el id

        try {
            // Obtiene todos los productos, para luego realizar una busqueda por el id
            const productsAll = await this.getProducts();
            const productFound = productsAll.find(p => p.id === id)

            // Retorna un mensaje de error json, en caso de no existir el producto
            if (!productFound) {
                return { error: 'Product not found' };
            }

            return productFound
        } catch (error) {
            console.error(error);
            return { error: "Error in getProductById" };
        }
    }

    async addProduct(product) {
        // agrega un producto nuevo al archivo.

        // Funcion encargada de validar los datos del producto por agregar.
        const validation = validateFields(product);


        // Si retorna 1 => Todo Ok.
        // Sino devuelve un objeto con un mensaje de error 
        if (validation != 1) {
            return validation;
        }

        try {
            // Obtiene todos los productos
            const productsAll = await this.getProducts();
            // Crea un objeto nuevo (producto) con los datos ya validados y pasados anterior mente en el req.body.
            const productNew = {
                id: this.#getNewId(productsAll),
                ...product,
            };

            // Agrega el producto (objeto) creado al array con todos los productos
            productsAll.push(productNew);

            // Guarda el contenido del array en un archivo (JSON)
            const fileContent = JSON.stringify(productsAll, null, '\t');
            await fs.promises.writeFile(this._path, fileContent);

            return productNew;

        } catch (error) {
            console.error(error);
            return { error: "Error in addProduct" }
        }
    }

    async updateProductById(id, productNew) {
        // Actualiza los datos de un prudcto existente (seleccionado por el id)
        console.log('Product New Data', productNew);
        try {
            const productsAll = await this.getProducts();
            const index = productsAll.findIndex(p => p.id === id)

            if (index === -1) {
                return { error: "Product not found" };
            }

            const productOld = productsAll[index];
            const productUpdate = {
                ...productOld,
                ...productNew
            }

            productsAll[index] = {
                id,
                ...productUpdate
            };

            // Guarda en el archivo donde se alamacenan los productos, el mismo array de objeto
            // pero con el contenido del solicitado modificado (No es uno nuevo, es el mismo con los datos reasignados)
            const fileContent = JSON.stringify(productsAll, null, '\t');
            await fs.promises.writeFile(this._path, fileContent, (err) => {
                if (err) {
                    throw new Error('Error: ', err);
                }
            })

            return productsAll[index];

        } catch (error) {
            console.error(error);
            return { error: "Error in getProducts" }
        }
    }

    async deleteProductById(id) {
        // Elimina un producto

        const productsAll = await this.getProducts();
        const productDelte = await this.getProductById(id);
        const index = productsAll.findIndex(p => p.id === id);

        if (index === -1) {
            return { error: "Product not found" };
        }

        productsAll.splice(index, 1);

        const fileContent = JSON.stringify(productsAll, null, '\t');
        await fs.promises.writeFile(this._path, fileContent, (err) => {
            if (err) {
                throw new Error('Error: ', err);
            }
        })

        return { message: "Delete product successfully", product: productDelte }
    }
}

module.exports = ProductManager;