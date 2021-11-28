const cartTotal = document.querySelector('.cart-amount');
const cartContent = document.querySelector('.header-cart__list');
// const productDOM = document.querySelector('.home-product__list');
const productDOM = document.querySelector('.product__slick');
const productRecomend = document.querySelector('.recommend-product .home-product__list');
const cartAmount = document.querySelector(".cart-amount");
const cartNonEmpty = document.querySelector(".header-cart__nonempty");
const cartEmpty = document.querySelector(".header-cart__empty");
let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
let count = 0;
let buttonsDOM = [];
//getting products
import Products from "./GetProducts.js";
//display products
class dipslayProducts {
    displayBestProducts(products) {
        let result = '';
        //thêm vào mục nổi bật ở HOME
        products.forEach(product => {
            result += `
                <div class="home-product__item">
                    <a href="../html/ProductDetail.html" class="product-link">
                        <div class="product-img">
                            <img src="${product.img}" alt="">
                        </div>
                        <div class="product-info">
                            <div class="product-name">${product.name}</div>
                            <span class="product-price">${numberWithDots(product.price)} ₫</span>

                        </div>
                    </a>
                    <button class="add-cart" data-id=${product.id}>Thêm vào giỏ hàng</button>
                </div>`;
        });
        $('.product__slick').append(result);
        $('.product__slick')[0].slick.refresh();
    }
    displayRecomendProducts(products) {
        let result = '';
        for (let i = 1; i <= 12; i++) {
            const randIndex = Math.floor(Math.random() * products.length);
            result += `
            <div class="home-product__item">
                <a href="../html/ProductDetail.html" class="product-link">
                    <div class="product-img">
                        <img src="${products[randIndex].img}" alt="">
                    </div>
                    <div class="product-info">
                        <div class="product-name">${products[randIndex].name}</div>
                        <span class="product-price">${numberWithDots(products[randIndex].price)} ₫</span>
                    </div>
                </a>
                <button class="add-cart" data-id=${products[randIndex].id}>Thêm vào giỏ hàng</button>
            </div>`;
        }
        productRecomend.innerHTML = result;
    }
}
export class UI {
    getAddCartBtns(products) {
        const btns = [...document.querySelectorAll(".add-cart")];
        buttonsDOM = btns
        btns.forEach(btn => {
            let id = btn.dataset.id;
            let inCart = cart.find(item => item.id == id)
            if (inCart) btn.disabled = true;
            else {
                btn.addEventListener("click", event => {
                    if (localStorage.getItem('user')==null) {
                        alert('Bạn phải đăng nhập');
                    } else {
                        let btnsDisabled = buttonsDOM.filter(item => item.dataset.id == btn.dataset.id);
                        for (let item of btnsDisabled) {
                            item.innerText = "Đã thêm vào giỏ hàng";
                            item.disabled = true;
                        }
                        //get product from products
                        let number = 1;

                        if (localStorage.getItem('detail')) {
                            let item = JSON.parse(localStorage.getItem('detail'));

                            if (item.id == btn.dataset.id) {
                                number = item.amount;

                            }
                        }
                        let cartListItem = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
                        for (let product of cartListItem) {
                            if (product.id == btn.dataset.id)
                                number = product.amount;
                        }
                        let cartItem = { ...Storage.getProduct(id), amount: number };

                        //add product to cart
                        cart = [...cart, cartItem];
                        //save cart to local storage
                        Storage.saveCart(cart);
                        //set cart value
                        this.setCartValues(cart);
                        //display cart item
                        this.addCartItem(cartItem);
                        let user = JSON.parse(localStorage.getItem('user'));
                        let userCart = cart;
                        localStorage.setItem('user', JSON.stringify({"id":user.id, "username": user.username, "password": user.password, "cart": userCart}));
                        //let userUpdate = {"id":user.id, "username": user.username, "password": user.password, "cart": userCart };
                        //deleteCartUser(user.id, userUpdate);
                    }
                })
            }
        })
    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemTotals = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemTotals++;
        })
        if (itemTotals > 0) {
            cartNonEmpty.classList.remove("hidden");
            cartEmpty.classList.add("hidden");
        } else {
            cartNonEmpty.classList.add("hidden");
            cartEmpty.classList.remove("hidden");
        }
        cartAmount.innerText = itemTotals == 0 ? '' : itemTotals
    }
    addCartItem(item) {
        const li = document.createElement('li');
        li.classList.add("header-cart__item");
        li.innerHTML = `
            <div class="cart-img__product"><img src="${item.img}" alt=""></div>
            <div class="cart-product">
                <h3 class="cart-product__title">${item.name}</h3>
                <span class="cart-product__price">${numberWithDots(item.price)} ₫</span>
                <div class="cart-quantity">
                    <button class="cart-control cart-decrease" data-id=${item.id} >-</button>
                    <input class="cart-control cart-product__amount" type="text" value="${item.amount}" data-id=${item.id}>
                    <button class="cart-control cart-increase" data-id=${item.id}>+</button>
                </div>
            </div>
            <div class="cart-remove__product" data-id=${item.id}>
                <i class="fas fa-window-close"></i>
            </div>`
        cartContent.appendChild(li);
    }
    removeItem(id) {
        cart = cart.filter(item => item.id != id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let btns = buttonsDOM.filter(item => item.dataset.id == id)
        for (let item of btns) {
            item.disabled = false;
            item.innerText = "Thêm vào giỏ hàng";
        }
        let user = JSON.parse(localStorage.getItem('user'));
        let userCart = cart;
        localStorage.setItem('user', JSON.stringify({"id":user.id, "username": user.username, "password": user.password, "cart": userCart}));
    }
    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id == id);
    }
    cartLogic() {
        cartContent.addEventListener("click", event => {
            if (event.target.classList.contains("fa-window-close")) {
                let removeItem = event.target.parentNode;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement);
                this.removeItem(id);
            }
            if (event.target.classList.contains('cart-increase') || event.target.classList.contains('cart-decrease')){
                let btn = event.target;
                let amount = btn.parentNode.querySelector('.cart-product__amount');
                if (btn.classList.contains('cart-increase')) {
                    if (amount.value == 5) btn.disabled = true;
                    else amount.value = parseInt(amount.value) + 1;
                    btn.parentNode.querySelector('.cart-decrease').disabled = false;
                }else if (btn.classList.contains("cart-decrease")) {
                    if (amount.value <= 1) btn.disabled = true;
                    else amount.value = parseInt(amount.value) - 1;
                    btn.parentNode.querySelector('.cart-increase').disabled = false;
                }
                let indexProduct = cart.findIndex(item => item.id == btn.dataset.id);
                cart[indexProduct].amount = parseInt(amount.value);
                localStorage.setItem('cart', JSON.stringify(cart));


                //let userUpdate = {"id":user.id, "username": user.username, "password": user.password, "cart": userCart };
                //deleteCartUser(user.id, userUpdate);
            }
        })
    }
}
//local storage
export class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id == id);
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart(cart) {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const show = new dipslayProducts();
    const products = new Products();
    let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    if (user != null) {
        Storage.saveCart(user.cart);
        cart = user.cart;
        cartContent.innerHTML = "";
        for (let product of cart) {
            ui.addCartItem({ ...Storage.getProduct(product.id), amount: product.amount });
        }
    }
    products.getProducts().then(products => {
        show.displayBestProducts(products);
        show.displayRecomendProducts(products);
        Storage.saveProducts(products);
    }).then(() => {
        ui.getAddCartBtns();
        ui.cartLogic();
        toDetailPage();
    });
    if (cart.length > 0) {
        cartContent.innerHTML = "";
        cartNonEmpty.classList.remove('hidden');
        cartEmpty.classList.add('hidden');
        for (let i = 0; i < cart.length; i++) {
            ui.addCartItem({ ...cart[i], amount: 1 });
        }
        ui.setCartValues(cart);
    } else {
        cartNonEmpty.classList.add('hidden');
        cartEmpty.classList.remove('hidden');
    }
    reloadCart();
})
function toDetailPage() {
    const links = document.querySelectorAll('.product-link');
    links.forEach(link => {
        link.addEventListener('click', ev => {
            let id = link.parentNode.querySelector('.add-cart').dataset.id;
            let product = { ...Storage.getProduct(id), amount: 1 };
            localStorage.setItem('detail', JSON.stringify(product));
        })
    })
}
function reloadCart() {
    let cartList = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    if(cartList.length>0){
        let amountProducts = document.querySelectorAll('.cart-product__amount');
        for (let product of amountProducts) {
            for (let cartItem of cartList) {
                if (cartItem.id == product.dataset.id) {
                    product.value = cartItem.amount;
                    break;
                }
            }
        }
    }
}
//display currency
function numberWithDots(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}



function createCartUser(data,callback) {
    let options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data)
    };
    fetch("http://localhost:3000/account", options)
        .then(function (response) {
            response.json();
        }).then(callback);
        // .then(callback)
}

function deleteCartUser(id,data) {
    let options = {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    fetch("http://localhost:3000/account/" + id, options)
        .then(function (response) {
            response.json();
        }).then(function(){
            if(data){
                createCartUser(data);
            }
        });
}
function loadCart() {

}