const { Router } = require('express');
const router = Router();

// Definicion e importacion del Gestor de Productos.
const ProductManager = require(`${__dirname}/../controllers/productManager`);
const manager = new ProductManager(`${__dirname}/../../db/productos.json`);

router.get('/', async (req, res) => {
    // Obtiene todos los productos.

    // Define el query param "limit" y almacena todos los productos en "productAll"
    const { limit } = req.query;
    const prodcutAll = await manager.getProducts();

    // Si no se envia limit en la query, retorna todos los productos
    if (!limit) {
        res.status(200)
            .json(prodcutAll);
        return;
    }

    // Si limit no es numero, retorna un mensaje de error json
    if (isNaN(Number.parseInt(limit))) {
        res.status(400)
            .json({ error: "Limit is NaN" })
        return;
    }

    // Si limit es negativo, retorna un mensaje de erorr json
    if (limit < 0) {
        res.status(400)
            .json({ error: "limit must be greater than 0" });
        return;
    }

    // Remueve los elementos sobrantes, muestra la cantidad de productos ingresado en limit
    const productLimit = prodcutAll.splice(0, limit)
    res.status(200)
        .json(productLimit);
})

router.get('/:pid', async (req, res) => {
    // Obtiene un producto por el id

    // Intenta obtener el producto y define el status code dependiendo si retorna un arreglo o un json error
    const id = +req.params.pid;
    const product = await manager.getProductById(id);
    const statusCode = (product.error) ? 400 : 200;

    res.status(statusCode)
        .json(product);
})

router.post('/', async (req, res) => {
    // Crea un objeto nuevo

    const { title, code, price, status, stock, category, thumbnails } = req.body

    // Creamos un objeto con las propiedades que obitene en el request.body
    // Agregar un producto nuevo con el objeto credo
    const product = { title, code, price, status, stock, category, thumbnails };
    const newProduct = await manager.addProduct(product);
    const statusCode = (newProduct.error) ? 400 : 200;

    res.status(statusCode)
        .json(newProduct);
})

router.put('/:pid', async (req, res) => {
    // Actualiza un objeto existente (No cambia ID)

    const id = +req.params.pid;
    const newFields = req.body
    const productNew = newFields;

    const productUpdate = await manager.updateProductById(id, productNew);
    const statusCode = (productUpdate.error) ? 400 : 200;

    res.status(statusCode)
        .json(productUpdate);
})

router.delete('/:pid', async (req, res) => {
    // Elimina un producto 

    const id = +req.params.pid
    const deleteProduct = await manager.deleteProductById(id);
    const statusCode = (deleteProduct.error) ? 400 : 200;

    res.status(statusCode)
        .json(deleteProduct);
})

module.exports = router;