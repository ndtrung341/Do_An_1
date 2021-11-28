function renderCart() {
    let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    let html = '';
    if (cart.length != 0) {
        const div = document.createElement('div');
        div.classList.add("cart-list");
        cart.forEach(item => {
            html += `
            <div class="cart-item" data-id=${item.id}>
                <a href="../html/ProductDetail.html" class="product-img">
                    <img src="${item.img}" alt="">
                </a>
                <div class="product-info">
                    <a href="../html/ProductDetail.html" class="product-name">${item.name}</a>

                    <span class="product-price">${numberWithDots(item.price)} ₫</span>
                    <div class="remove-product" data-id=${item.id}>Xóa</div>
                </div>
                <div class="product-quantity">
                    <button class="product-control quantity-decrease" data-id=${item.id}><img src="https://frontend.tikicdn.com/_desktop-next/static/img/pdp_revamp_v2/icons-remove.svg"></button>
                    <input type="text" value=${item.amount} class="number product-control">
                    <button class="product-control quantity-increase" data-id=${item.id}><img src="https://frontend.tikicdn.com/_desktop-next/static/img/pdp_revamp_v2/icons-add.svg"></button>
                </div>
            </div> `
        });
        div.innerHTML = html;
        document.querySelector('.cart-left').appendChild(div) ;
    }
}
renderCart();
const priceLabel = document.querySelector(".price-total");
let removeBtns = document.querySelectorAll(".remove-product");
removeBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
        let id = btn.dataset.id;
        cart = cart.filter(item => item.id != id);
        localStorage.setItem("cart", JSON.stringify(cart));
        document.querySelector('.cart-list').removeChild(btn.parentNode.parentNode);
        if (document.querySelectorAll('.cart-item').length == 0) document.querySelector('.cart-list').remove();
        checkPrice();
        if (cart.length == 0) document.querySelector('.cart-left').innerHTML = `<img src="../img/empty.png" alt="">`;
    })
})
function checkPrice() {
    let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    let price = 0;
    if (cart.length != 0) {
        cart.forEach(product => price += product.price*parseInt(product.amount));
    }
    priceLabel.innerHTML = "" + numberWithDots(price)+ " ₫";
}
checkPrice();
let btnControlQuantity = document.querySelectorAll('.product-control');
btnControlQuantity.forEach(btn => {
    btn.addEventListener('click', function () {
        let amount = btn.parentNode.querySelector('.number');
        if (btn.classList.contains("quantity-decrease")) {
            if (amount.value <= 1) btn.disabled = true;
            else amount.value = parseInt(amount.value) - 1;
            btn.parentNode.querySelector('.quantity-increase').disabled = false;
        } else if(btn.classList.contains("quantity-increase")) {
            if (amount.value >= 5) btn.disabled = true;
            else amount.value = parseInt(amount.value) + 1;
            btn.parentNode.querySelector('.quantity-decrease').disabled = false;
        }
        let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
        let indexProduct = cart.findIndex(item => item.id == btn.dataset.id);
        cart[indexProduct].amount = parseInt(amount.value);
        localStorage.setItem('cart', JSON.stringify(cart));
        checkPrice();
    })
})
function numberWithDots(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function toDetailPage() {
    const linkTitle = document.querySelectorAll('.product-name');
    const linkImage = document.querySelectorAll('.product-img');
    linkTitle.forEach(link => {
        link.addEventListener('click', ev => {
            let id = link.parentNode.parentNode.dataset.id;
            products = JSON.parse(localStorage.getItem('products'));
            products = products.find(product => product.id == id)
            let product = { ...products, amount: 1 };
            localStorage.setItem('detail', JSON.stringify(product));
        })
    })
    linkImage.forEach(link => {
        link.addEventListener('click', ev => {
            let id = link.parentNode.dataset.id;
            products = JSON.parse(localStorage.getItem('products'));
            products = products.find(product => product.id == id)
            let product = { ...products, amount: 1 };
            localStorage.setItem('detail', JSON.stringify(product));
        })
    })
}
toDetailPage();

document.querySelector('.checkout-btn').addEventListener('click', function () {
    document.getElementsByTagName("BODY")[0].classList.add("open-checkout");
})
document.querySelector('.btn-closeCheck').addEventListener('click', () => {
    document.getElementsByTagName("BODY")[0].classList.remove("open-checkout");
})

const btnBuy = document.querySelector('.btn-buy');
btnBuy.addEventListener('click', function () {
    if (document.querySelector('#name').value == '' || document.querySelector('#adress').value == '' ||
            document.querySelector('#phone').value == '') {
        alert('Không được để trống');
    } else {
        let format = {
            "nameCustomer": document.querySelector('#name').value,
            "phone": document.querySelector('#phone').value,
            "adress": document.querySelector('#adress').value,
            "total": document.querySelector('.price-total').innerHTML.split(' ₫')[0],
            "date": new Date().toISOString().slice(0, 10),
            "products": JSON.parse(localStorage.getItem('user')).cart
        }
        let user = JSON.parse(localStorage.getItem('user'));
        localStorage.removeItem('cart');
        let UpdateUser = { "id": user.id, "username": user.username, "password": user.password, "cart": [] };
        localStorage.setItem('user', JSON.stringify(UpdateUser));
        AddData(format, UpdateUser, user.id);
        location.href = "../html/Home.html";
    }
})
function AddData(data,datauser,id) {
    let options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data)
    };
    fetch("http://localhost:3000/bills", options)
        .then(function (response) {
            response.json();
        }).then(EditCartUser(id,datauser));
}
function EditCartUser(id,data) {
    let options = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data)
    };
    fetch("http://localhost:3000/account/" + id, options)
        .then(function (response) {
            response.json();
        })
}