const { Router } = require('express');
const router = Router();

// Definicion e importacion del Gestor de Carritos.
const CartManager = require(`${__dirname}/../controllers/cartManager.js`)
const manager = new CartManager(`${__dirname}/../../db/carritos.json`);

router.get('/:cid', async (req, res) => {
    // Obtiene un carrito por el id.

    const cid = +req.params.cid;
    const cartFound = (await manager.getCartById(cid)).products;
    const statusCode = (cartFound.error) ? 400 : 200;

    res.status(statusCode)
        .json(cartFound);
})

router.post('/', async (req, res) => {
    // Agrega un nuevo carrito vacio

    const cartNew = await manager.addCart();
    const statusCode = (cartNew.error) ? 400 : 200;

    res.status(statusCode)
        .json(cartNew);
})

router.post('/:cid/product/:pid', async (req, res) => {
    // Agrega un producto por el id, a un carrito seleccionado por el id

    // Obteneoms el id del carrito y producto, a traves de los request paramaters
    const cid = +req.params.cid
    const pid = +req.params.pid

    // Obtenemos qunatiy de los query parameters
    const quantity = +req.body.quantity

    // si el id del producto no es un numero o es negativo, devuelve un json con un mensaje de error.
    // (El id del carrito es validado en CartManager)
    if (pid < 0 || isNaN(pid)) {
        res.status(400)
            .json({ error: "Product not found" })
    }

    // Creamos el nuevo producto (objeto) manteniendo el id y con el quantity ya validado (Paso los if)
    const productToAdd = { productId: pid, quantity };

    // Agrega el producto recien creado a un carrito seleccionado por el id como primer parametro, retorna el carrito completo
    const cart = await manager.addProductCart(cid, productToAdd);

    res.status(200)
        .json(cart.products); // Muestra unicamente los productos que contiene el carrito.
})

module.exports = router;