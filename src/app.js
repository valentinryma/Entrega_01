const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importamos los Routers
const routerProducts = require(`${__dirname}/routes/products`);
const routerCarts = require(`${__dirname}/routes/carts`);
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    const mensaje = `
        <h1> Primera entrega: Proyecto Final</h1>
        <h3> Rutas: (Unicamente GETs)</h3>
        <h3> Postman: <a href="https://bold-shuttle-355224.postman.co/workspace/New-Team-Workspace~8c97ea5a-157a-4297-95ad-898e284a0d41/collection/31523825-c84f981d-f00f-4f4c-a98d-c0db7de70595?action=share&creator=31523825">Collection Entrega 01</a> (POSTs y GETs)</h3>
        <h4> Productos: </h4>
        <ul>
            <li><a href="http://localhost:${PORT}/api/products/">Listar todos los productos</a></li>
            <li><a href="http://localhost:${PORT}/api/products?limit=3">Listar primero 3 productos (limit)</a></li>
            <li><a href="http://localhost:${PORT}/api/products/1">GET Producto por ID</a></li>
        </ul

        <h4> Carritos: </h4>
        <ul>
            <li><a href="http://localhost:${PORT}/api/carts/1">Listar Carrito por ID</a></li>
        </ul

        <h5> Comandos: </h5>
        <ul>
            <li><code>npm start</code>: Inicia el serivdor</li>
            <li><code>npm run reset</code>: Resetea los archivos iniciales (productos.json & carritos.json)</li>
        </ul>
    `

    res.send(mensaje)
});

app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`);
});