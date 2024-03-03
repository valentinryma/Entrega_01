const carrito = [
    {
        "id": 1,
        "products": [
            {
                "productId": 1,
                "quantity": 30
            },
            {
                "productId": 3,
                "quantity": 2
            }
        ]
    },
    {
        "id": 2,
        "products": [
            {
                "productId": 5,
                "quantity": 23
            }
        ]
    },
    {
        "id": 3,
        "products": [
            {
                "productId": 3,
                "quantity": 2
            },
            {
                "productId": 4,
                "quantity": 5
            }
        ]
    }
]

let cart = carrito[1];
console.log(carrito[1]);
console.log(cart);




// const productoAdd = { "product": 1, "quantity": 30 }
// const idPAdd = productoAdd.product

// console.log(carrito.products);
// carrito.products.forEach(p => {
//     if (p.product === idPAdd) {
//         p.quantity += 1;
//     }
// })
// console.log(carrito.products);
