const { resetDB } = require(`${__dirname}/utils.js`)
const backUpCarrito = `${__dirname}/../db/bk/cbk.json`;
const carritoFile = `${__dirname}/../db/carritos.json`;

const backUpProductos = `${__dirname}/../db/bk/pbk.json`;
const productosFile = `${__dirname}/../db/productos.json`;

console.log('Reset in progress...')
resetDB(backUpCarrito, carritoFile);
resetDB(backUpProductos, productosFile);
console.log('Reset completed ✔')
