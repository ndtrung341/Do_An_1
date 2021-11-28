function changeImg() {
    thumbnails = document.querySelectorAll(".product-thumbnail__item");
    thumbnails.forEach(element => {
        element.addEventListener('click', ev => {
            document.querySelector(".product__img").children[0].src = ev.target.src;
            removeSelected();
            ev.target.parentNode.classList.add("product-thumbnail__item--selected");
        })
    });
}
window.addEventListener("load",function() {
    changeImg();
  });
function removeSelected() {
    thumbnails.forEach(element => {
        element.classList.remove("product-thumbnail__item--selected");
    })
}
const product = localStorage.getItem('detail') ? JSON.parse(localStorage.getItem('detail')) : product;
function renderInforProduct() {
    let product = JSON.parse(localStorage.getItem('detail'));
    let html = `
        <h2 class="product-name">${product.name}</h2>
        <p class="product-desc">${product.desc}</p>
        <div class="product-price">${numberWithDots(product.price)} ₫</div>
        <div class="product-quantity">
            <span class="label-control">Số lượng</span>
            <button class="product-control quantity-decrease"><img src="https://frontend.tikicdn.com/_desktop-next/static/img/pdp_revamp_v2/icons-remove.svg"></button>
            <input type="text" value="1" class="number product-control">
            <button class="product-control quantity-increase"><img src="https://frontend.tikicdn.com/_desktop-next/static/img/pdp_revamp_v2/icons-add.svg"></button>
        </div>
        <button class="add-cart" data-id=${product.id}>Thêm vào giỏ hàng</button>
    `;
    document.querySelector(".product-content").innerHTML = html;
}
function renderImg() {
    let product = JSON.parse(localStorage.getItem('detail'));
    let html = `
        <div class="product__img">
            <img src="${product.img}" alt="">
        </div>
        <div class="product-thumbnail__list">
            <div class="product-thumbnail__item product-thumbnail__item--selected">
                <img src="${product.img}" alt="">
            </div>
            <div class="product-thumbnail__item">
                <img src="../img/hamster.png" alt="">
            </div>
            <div class="product-thumbnail__item">
                <img src="../img/bunny.png" alt="">
            </div>
        </div>
    `
    document.querySelector(".product-group__img").innerHTML = html;

}
renderImg();
function renderRelatedProduct() {
    let product = JSON.parse(localStorage.getItem('detail'));
    let realatedProducts = JSON.parse(localStorage.getItem('products')).filter(item => item.type == product.type && item.id != product.id);
    let html = '';
    let len = (realatedProducts.length >= 5)? 5: realatedProducts.length;
    for (let i = 0; i < len; i++) {
        html += `
            <div class="product-related__item">
                <a href="./productdetail.html" class="product-link">
                    <div class="product-img">
                        <img src="${realatedProducts[i].img}" alt="">
                    </div>
                    <div class="product-info">
                        <div class="product-name">${realatedProducts[i].name}</div>
                        <span class="product-price">${numberWithDots(realatedProducts[i].price)} ₫</span>

                    </div>
                    </a>
                <button class="add-cart" data-id=${realatedProducts[i].id}>Thêm vào giỏ hàng</button>
            </div>
        `;
    }
    document.querySelector(".product-related__list").innerHTML = html;
    toDetailPage();
}
renderRelatedProduct();
renderInforProduct();
let btnControlQuantity = document.querySelectorAll('.product-control');
btnControlQuantity.forEach(btn => {
    let amount = document.querySelector('.number');
    btn.addEventListener('click', function () {
        if (btn.classList.contains("quantity-decrease")) {
            if (amount.value <= 1) btn.disabled = true;
            else amount.value = parseInt(amount.value) - 1;
            document.querySelector('.quantity-increase').disabled = false;
        } else if (btn.classList.contains("quantity-increase")) {
            if (amount.value >= 5) btn.disabled = true;
            else amount.value = parseInt(amount.value) + 1;
            document.querySelector('.quantity-decrease').disabled = false;
        }
        product.amount = parseInt(amount.value);
        localStorage.setItem('detail', JSON.stringify(product));
    })
})
function toDetailPage() {
    const links = document.querySelectorAll('.product-link');
    links.forEach(link => {
        link.addEventListener('click', function () {
            let id = link.parentNode.querySelector('.add-cart').dataset.id;
            products = JSON.parse(localStorage.getItem('products'));
            products = products.find(product => product.id == id)
            let product = { ...products, amount: 1 };
            localStorage.setItem('detail', JSON.stringify(product));
        })
    })
}
function numberWithDots(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
document.title = JSON.parse(localStorage.getItem('detail')).name;