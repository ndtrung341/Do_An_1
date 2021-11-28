import { UI, Storage } from "./AddToCart.js";
import Products from "./GetProducts.js";
let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    products.getProducts().then(products => {
        Storage.saveProducts(products);
    }).then(() => {
        ui.getAddCartBtns();
        ui.cartLogic();
    });
})


