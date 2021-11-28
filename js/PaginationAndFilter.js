import Products from "./GetProducts.js";
import { UI,Storage } from "./AddToCart.js";
let dataProduct = JSON.parse(localStorage.getItem("products"));
let perPage = 12;
let currentPage = 1;
let totalPage = Math.ceil(dataProduct.length / perPage);
let start = 0;
let end = perPage;
let itemsPagination = document.querySelectorAll('.pagination__item');
let pageNumbers = Array.prototype.slice.call(itemsPagination, 1, itemsPagination.length - 1);
const btnPrevious = document.querySelector(".prev__btn");
const btnNext = document.querySelector(".next__btn");
const ui = new UI();
let type = "";

function renderProduct() {
    let html = '';
    const content = dataProduct.map((item, index) => {
        if (index >= start && index < end) {
            html += `
            <div class="product__item">
                <a href="../html/ProductDetail.html" class="product-link">
                    <div class="product-img">
                        <img src="${item.img}" alt="">
                    </div>
                    <div class="product-info">
                        <div class="product-name">${item.name}</div>
                        <span class="product-price">${numberWithDots(item.price)}  ₫</span>
                    </div>
                </a>
                <button class="add-cart" data-id=${item.id}>Thêm vào giỏ hàng</button>
            </div>`;
            return html;
        }
    })
    document.querySelector(".products-list").innerHTML = html;
}

renderProduct();
renderListPage();


function renderListPage() {
    let html = '';
    let a = [];
     a = doPaging(currentPage);

    for (let i = 0; i <a.length;i++) {
        if (typeof(a[i]) != 'number') {
            html += `<div class="pagination-number current__page"><span>${(parseInt(a[i]))}</span></div>`;
        }
        else html += `<div class="pagination-number"><span>${(a[i])}</span></div>`;
    }
    document.querySelector(".pagination-total").innerHTML = html;
    changePage();
}
function changePage() {
    const page = document.querySelectorAll(".pagination-number");
    for (let i = 0; i < page.length; i++){
        page[i].addEventListener('click', () => {

            currentPage = page[i].innerText;
            getList(currentPage);
            displayPrevNext();
            renderProduct();
            renderListPage();
            ui.getAddCartBtns();//lay nut moi
            toDetailPage();
            document.documentElement.scrollTop = 0;
        })
    }
}
changePage();
function removeActivePage() {
    const page = document.querySelectorAll(".pagination-number");
    for (let i of page)
        i.classList.remove("current__page");
}
function getList(currentPage) {
    start = (currentPage - 1) * perPage;
    end = currentPage * perPage;
}
function displayPrevNext() {
    btnPrevious.style.display = currentPage == 1 ? "none" : "block";
    btnNext.style.display = currentPage == Math.ceil(dataProduct.length / perPage) ? "none" : "block";
}
function displayPageNumber() {
    for (let item of pageNumbers) {
        item.classList.remove("current__page")
        if (currentPage === item.innerText) item.classList.add("current__page");
    }
}
displayPageNumber();
displayPrevNext();
btnNext.addEventListener("click", function () {
    currentPage++;
    if (currentPage >= totalPage) {
        currentPage = totalPage;
    }
    getList(currentPage);
    renderProduct();
    renderListPage();

    displayPrevNext();
    toDetailPage();
    ui.getAddCartBtns()
    document.documentElement.scrollTop = 0;
})
btnPrevious.addEventListener("click", function () {
    currentPage--;
    if (currentPage <= 1) {
        currentPage = 1;
    }
    getList(currentPage);
    renderProduct();
    renderListPage();

    displayPrevNext();
    toDetailPage();
    ui.getAddCartBtns()
    document.documentElement.scrollTop = 0;
})

function doPaging(current) {
    const paging = [];
    const range = Math.ceil(dataProduct.length / perPage)>5?5: Math.ceil(dataProduct.length / perPage);
    const pages =  Math.ceil(dataProduct.length / perPage);
    const start = 1;
    var i = Math.min(pages + start - range, Math.max(start, current - (range / 2 | 0)));
    const end = i + range;
    while (i < end) { paging.push(i == current ? `${i++}` : i++) }
    return paging;
}


let inputNum = document.querySelectorAll(".filter-price");
inputNum.forEach(item => {
    item.addEventListener("keyup", event =>{
        var regex = new RegExp("[^0-9]");
        var key = event.key;
        if ((regex.test(key) && event.keyCode != 8) || (item.value.length == 0 && key == '0')) {
            event.preventDefault();
            return false;
        } else {
            let value = item.value,
            plain = value.split('.').join(''),
            reversed = reverseNumber(plain),
            reversedWithDots = reversed.match(/.{1,3}/g).join('.'),
            normal = reverseNumber(reversedWithDots);
            item.value = normal;
        }
    })
})
function reverseNumber(input) {
    return [].map.call(input, function(x) {
       return x;
     }).reverse().join('');
   }

let aType =  [];
let cat = localStorage.getItem('type') ? JSON.parse(localStorage.getItem('type')) : null;

function Filter() {
    let checkbox = document.querySelectorAll(".products-checkbox")
    checkbox.forEach(item => {
        if (cat != null && item.value == cat.cat) {
            item.checked = true;
            localStorage.removeItem('type');
            if (item.checked) {
                aType.push(item);
                document.querySelector(".products-list").innerHTML = "";
                currentPage = 1;
                start = 0;
                end = perPage;
            } else {
                aType = aType.filter(type => type.value != item.value);
                currentPage = 1;
                start = 0;
                end = perPage;
            }
            if (aType.length == JSON.parse(localStorage.getItem('category')).length || aType.length == 0) document.querySelector(".products-result__filter").innerText = "Tất cả"
            else {
                let str = aType.map(item => (item.parentNode).querySelector(".product-checkbox__name").innerText);
                // let text = (aType[0].parentNode).querySelector(".product-checkbox__name").innerText;
                document.querySelector(".products-result__filter").innerText =""+ str.join();
            }
            dataProduct = aType.length != 0 ? JSON.parse(localStorage.getItem("products")).filter(product => aType.map(item => item.value).includes(product.type)) : JSON.parse(localStorage.getItem("products"));
            if (returnPrice().length == 1)
                dataProduct = dataProduct.filter(product => product.price > returnPrice()[0]);
            else
                dataProduct = dataProduct.filter(product => product.price >= returnPrice()[0] && product.price <= returnPrice()[1]);

            displayPrevNext();
            changePage();
            renderProduct();
            renderListPage();
            ui.getAddCartBtns();
            toDetailPage();
        }
        item.addEventListener('change', function () {
            if (item.checked) {
                aType.push(item);
                document.querySelector(".products-list").innerHTML = "";
                currentPage = 1;
                start = 0;
                end = perPage;
            } else {
                aType = aType.filter(type => type.value != item.value);
                currentPage = 1;
                start = 0;
                end = perPage;
            }
            if (aType.length == JSON.parse(localStorage.getItem('category')).length || aType.length == 0) document.querySelector(".products-result__filter").innerText = "Tất cả"
            else {
                let str = aType.map(item => (item.parentNode).querySelector(".product-checkbox__name").innerText);
                // let text = (aType[0].parentNode).querySelector(".product-checkbox__name").innerText;
                document.querySelector(".products-result__filter").innerText ="" + str.join();
            }
            dataProduct = aType.length != 0 ? JSON.parse(localStorage.getItem("products")).filter(product => aType.map(item => item.value).includes(product.type)) : JSON.parse(localStorage.getItem("products"));
            if (returnPrice().length == 1)
                dataProduct = dataProduct.filter(product => product.price > returnPrice()[0]);
            else
                dataProduct = dataProduct.filter(product => product.price >= returnPrice()[0] && product.price <= returnPrice()[1]);

            displayPrevNext();
            changePage();
            renderProduct();
            renderListPage();
            ui.getAddCartBtns();
            toDetailPage();

        })
    });
}
function convertNumber(value) {
    return parseInt(value.split('.').join(''));
}
let btnFilterPrice = document.querySelector(".filter-btn");
btnFilterPrice.addEventListener('click', btn => {
    let minPrice = convertNumber(inputNum[0].value);
    let maxPrice = convertNumber(inputNum[1].value);
    if ((minPrice == '' && maxPrice == '') || (maxPrice != '' && minPrice != '')) {

        dataProduct = aType.length != 0 ? JSON.parse(localStorage.getItem("products")).filter(product => aType.map(item => item.value).includes(product.type)) : JSON.parse(localStorage.getItem("products"));
        if (returnPrice().length == 1) {
            dataProduct = dataProduct.filter(product=>product.price > returnPrice()[0]);

        }
        else {
            dataProduct = dataProduct.filter(product => product.price >= returnPrice()[0] && product.price<=returnPrice()[1]);
        }
        currentPage = 1;
        start = 0;
        end = perPage;
        changePage();
        displayPrevNext();
        renderProduct();
        renderListPage();
        ui.getAddCartBtns();
        toDetailPage();
    }
    else {
        btn.disabled = true;
    }
})
function returnPrice() {
    if (inputNum[0].value == '' || inputNum[1].value == '') return [0];
    return [convertNumber(inputNum[0].value),convertNumber(inputNum[1].value)];
}
function toDetailPage() {
    const links = document.querySelectorAll('.product-link');
    links.forEach(link => {
        link.addEventListener('click', ev => {
            let id = link.parentNode.querySelector('.add-cart').dataset.id;
            let product = { ...Storage.getProduct(id),amount:1 };
            localStorage.setItem('detail', JSON.stringify(product));
        })
    })
}
toDetailPage();

function numberWithDots(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

renderFilter();
function renderFilter() {
    localStorage.removeItem('category');
    getAPI('category').then(cats => {
        localStorage.setItem('category', JSON.stringify(cats));
        let listCat = JSON.parse(localStorage.getItem('category'));
        let html = `<h3 class="product-filter__caption">Danh mục</h3>`;
        listCat.forEach(cat => {
            html += `
            <label class="products-checkbox__control">
                <input type="checkbox" class="products-checkbox" name="" value="${cat.id}" id="">
                <span class="product-checkbox__name">${cat.name}</span>
            </label>
            `;
        })
        document.querySelector('.products-filter__item').innerHTML = html;
        Filter();
    })
}

async function getAPI(name) {
    try {
        let result = await fetch("http://localhost:3000/" + name);
        let data = await result.json();
        return data
    } catch (error) {
        console.log(error);
    }
}