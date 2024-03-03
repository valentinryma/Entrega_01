// Importamos un gestor de archivos: FileSystem nativo de node.
const fs = require('node:fs');

// Definimos la clase CartManager encargada de gestionar los carritos.
class CartManager {
    constructor(path) {
        // Ruta del archivo json con los carritos
        this._path = path
    }

    #getNewId = (array) => {
        // Método privado encargado de generar un id 
        return array.length > 0 ? array[array.length - 1].id + 1 : 1
    }

    async getCart() {
        // Retorna todos los carritos en un objeto. (El contenido del json como db)
        try {
            // Lee el contenido del archivo "db json" y lo almacena en un objeto
            const fileContent = await fs.promises.readFile(this._path);
            const cartsAll = JSON.parse(fileContent);

            return cartsAll;
        } catch (error) {
            console.error(error);
            return { error: "Error in getCar" }
        }
    }

    async getCartById(id) {
        // Obtiene un carrito por el id.
        try {
            const cartsAll = await this.getCart();
            const cartFound = cartsAll.find(c => c.id === id);

            if (!cartFound) {
                return { error: "Cart not found" };
            }

            return cartFound;

        } catch (error) {
            console.error(error);
            return { error: "Error in getCar" }
        }
    }

    async addCart() {
        // Crea, agrega y retorna un carrito vacio

        try {
            const cartAll = await this.getCart();

            // Crea un objeto carrito || Id asignada automaticamente || productos con un arreglo vacio por defecto.
            const newCart = {
                id: this.#getNewId(cartAll),
                products: []
            };

            // Agrega el carrito creado al objeto con todos los carritos
            cartAll.push(newCart);

            // Escribe el archivo json db, con todos los carritos (agregando el creado)
            const fileContent = JSON.stringify(cartAll, null, '\t');
            await fs.promises.writeFile(this._path, fileContent);

            return newCart;

        } catch (error) {
            console.error(error);
            return { error: "Error in addCart" };
        }
    }

    // Recibe dos parametros  cid: id del carrito al cual se le agregara el producto || product: el producto (objeto)
    async addProductCart(cid, product) {
        // Agrega un producto a un carrito en especifico

        try {
            const cartsAll = await this.getCart();
            const index = cartsAll.findIndex(c => c.id === cid);

            if (index === -1) {
                return { error: "Cart not found" };
            }


            // Verifica que el producto exista en la json db.
            const idProductAdd = product.productId;

            const productfileContent = await fs.promises.readFile(`${__dirname}/../../db/productos.json`);
            const productsAll = JSON.parse(productfileContent);
            const productFound = productsAll.find(p => p.id === idProductAdd);

            if (!productFound) {
                return { error: "Error: The product you are trying to add does not exist." };
            }

            // Banderea: 1: El producto no existe || 0: El producto ya existe
            let flag = 1;

            // Recorre los productos del carrito al que se le agregará el nuevo producto, corroborando si ya existe en el carrito
            cartsAll[index].products.forEach(p => {
                // Si el producto por agregar ya existe en el carrito y quantity tiene valor, se le sumara al que ya estaba
                // si no tenia valor o no fue enviado quantity por los req.params, por defecto le agregara 1 a la cantidad.
                if (p.productId === idProductAdd) {
                    p.quantity += product.quantity || 1;

                    flag = 0;
                }
            })

            if (flag) {
                if (isNaN(product.quantity)) {
                    // Si no posee "quantity" en el body, por defecto agregará una unidad del producto.
                    product.quantity = 1;
                }
                cartsAll[index].products.push(product);
            }

            // Escribe le archivo con el archivo con los cambios realizados anteriormente en el carrito. 
            // (Agrego de producto o quantity de uno ya existente)
            const fileContent = JSON.stringify(cartsAll, null, '\t');
            await fs.promises.writeFile(this._path, fileContent);

            return cartsAll[index];

        } catch (error) {
            console.error(error);
            return { error: "Error in addProductCart" };
        }
    }
}

module.exports = CartManager;