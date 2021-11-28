import Products from "./GetProducts.js";
const table = document.querySelector('.list-row');
const headerTable = document.querySelector('.row-header');
const listRow = document.querySelector('.list-row');
const infoContent = document.querySelector('.info');
const itemSidebar = document.querySelectorAll('.sidebar-item');
const breadcrumb = document.querySelector('.breadcrumb');
const btnRefresh = document.querySelector('.refresh');
const btnAdd = document.querySelector('.add')
// const btnDeletes = document.querySelector('btn-delete');
// const btnEdit = document.querySelector('edit');
const txtFilter = document.querySelector('.find-text');

txtFilter.addEventListener('keyup', () => {
    const option = document.querySelector('.find-option');
    const breadcrumb = document.querySelector('.breadcrumb');
    const show = new DisplayTable();
    console.log(txtFilter.value.toLowerCase());
    if (txtFilter.value == '') renderInfo(breadcrumb.id, show);
    else {
        if (option.value == 'dog') {
            getAPI(breadcrumb.id).then(list => {
                if (breadcrumb.id == 'items') show.renderProduct(list.filter(item => item.id == txtFilter.value));
                else if (breadcrumb.id == 'category') show.renderCategory(list.filter(item => item.id == txtFilter.value));
                else if (breadcrumb.id == 'account') show.renderAccount(list.filter(item => item.id == txtFilter.value));
                else show.renderBill(list.filter(item => item.id == txtFilter.value));
            })
        } else {
            getAPI(breadcrumb.id).then(list => {
                if (breadcrumb.id == 'items') show.renderProduct(list.filter(item => item.name.toLowerCase().startsWith(txtFilter.value.toLowerCase())));
                else if (breadcrumb.id == 'category') show.renderCategory(list.filter(item => item.name.toLowerCase().startsWith(txtFilter.value.toLowerCase())));
                else if (breadcrumb.id == 'account') show.renderAccount(list.filter(item => item.name.toLowerCase().startsWith(txtFilter.value.toLowerCase())));
                else show.renderBill(list.filter(item => item.name.toLowerCase().startsWith(txtFilter.value.toLowerCase())));
            })
        }
        fillData();
    }
})

const listBtns = [document.querySelector('.add'), document.querySelector('.edit')];
console.log(listBtns);

listBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (breadcrumb.id == 'items') {
            const listTxt = document.querySelectorAll('.info-text');
            let id = listTxt[0].value;
            let name = listTxt[1].value.split(' ').map(w => w.substring(0, 1).toUpperCase() + w.substring(1)).join(' ');
            let price = listTxt[5].value;
            let desc = listTxt[2].value;
            let imgPath = document.querySelector('#product-img').files[0] ? "../img/" + document.querySelector('#product-img').files[0].name : document.querySelector('.show-img').src;
            console.log(document.querySelector('.show-img').src);
            let type = listTxt[3].value;
            let amount = listTxt[4].value;
            let format = {
                "id": parseInt(id),
                "type": type,
                "name": name,
                "price": parseInt(price),
                "desc": desc,
                "img": imgPath,
                "number": parseInt(amount)
            }
            if (btn.classList.contains('add')) AddData(format, 'items');
            else EditData(id, format, 'items');
            renderInfo('items', new DisplayTable());
        } else if (breadcrumb.id == 'category') {
            const listTxt = document.querySelectorAll('.info-text');
            let id = listTxt[0].value;
            let name = listTxt[1].value.split(' ').map(w => w.substring(0, 1).toUpperCase() + w.substring(1)).join(' ');
            let format = {
                "id": id,
                "name": name
            }
            if (btn.classList.contains('add')) AddData(format, 'category');
            else EditData(id, format, 'category');
            renderInfo('category', new DisplayTable());
        }
    })
})


btnRefresh.addEventListener('click', () => {
    const listTxt = document.querySelectorAll('.info-text');
    listTxt.forEach(item => item.value = "");
    if (breadcrumb.id == "items") {
        document.querySelector('.show-img').src = "";
    }
})
function fillData() {
    table.addEventListener('click', evt => {
        if (evt.target.classList.contains('row-item') || evt.target.classList.contains('row-item__desc')) {
            let item = evt.target.parentNode;
            const listTxt = document.querySelectorAll('.info-text');
            console.log(listTxt);
            for (let i = 0; i < listTxt.length; i++) {
                listTxt[i].value = item.querySelectorAll('.row-item')[i].textContent;
            }
            if (breadcrumb.id == "items") {
                GetData(listTxt[0].value, breadcrumb.id);
            }
            document.querySelectorAll('.row').forEach(row => row.classList.remove('row-item__active'));
            item.classList.add('row-item__active');
        }
    })
}
document.addEventListener("DOMContentLoaded", () => {

    fillData();
    const show = new DisplayTable();
    const products = new Products();
    let state = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')).name : "category";
    itemSidebar.forEach(item => {
        item.classList.remove("sidebar-item--active")
        if (item.dataset.id == state) item.classList.add("sidebar-item--active");
    });
    renderInfo(state, show);
    itemSidebar.forEach(item => {

        item.addEventListener('click', function () {
            itemSidebar.forEach(item => item.classList.remove("sidebar-item--active"));
            item.classList.add("sidebar-item--active");
            renderInfo(item.dataset.id, show);
            console.log(breadcrumb.id);
            localStorage.setItem('state', JSON.stringify({ "name": item.dataset.id }));
        })
    })
})
function renderInfo(option, show) {
    let html = ``;
    if (option == 'items') {
        breadcrumb.innerHTML = "Sản phẩm";
        breadcrumb.id = "" + "items";
        html += `
        <h2 class="title">Thông tin chi tiết</h2>
        <div class="info-item info-item__img">
            <h2 class="info-title">Hình sản phẩm</h2>
            <img src="" alt="" style="width: 100px; height: 100px;box-shadow: 0px 2px 4px 2px rgb(15 34 58 / 12%);object-fit: contain;"class="show-img">
            <input type="file" id="product-img" accept="image/x-png,image/gif,image/jpeg">
        </div>
        <div class="info-item">
            <h2 class="info-title">Mã sản phẩm</h2>
            <input type="text" class="info-text" id="product-id">
        </div>
        <div class="info-item">
            <h2 class="info-title">Tên sản phẩm</h2>
            <input type="text" class="info-text" id="product-name">
        </div>
        <div class="info-item">
            <h2 class="info-title">Mô tả</h2>
            <input type="text" class="info-text" id="product-desc">
        </div>
        <div class="info-item">
            <h2 class="info-title">Tên danh mục</h2>
            <select class="info-text" id="product-cat">

            </select>
        </div>
        <div class="info-item">
            <h2 class="info-title">Số lượng tồn kho</h2>
            <input type="text" class="info-text" id="product-amount">
        </div>
        <div class="info-item">
            <h2 class="info-title">Giá</h2>
            <input type="text" class="info-text" id="product-price">
        </div>
        `
        getAPI('category').then((cats) => {
            let temp = ``;
            cats.forEach(cat => {
                temp += `<option value="${cat.id}">${cat.name}</option>`;
            })
            document.querySelector('#product-cat').innerHTML = `<option value="" selected disabled hidden></option>` + temp;
        });
        getAPI('items').then(products => {
            show.renderProduct(products)
        })

    } else if (option == 'category') {
        breadcrumb.innerHTML = "Danh mục";
        breadcrumb.id = "" + "category";
        html += `
        <h2 class="title">Thông tin chi tiết</h2>
        <div class="info-item">
            <h2 class="info-title">Mã danh mục</h2>
            <input type="text" class="info-text" id="category-id">
        </div>
        <div class="info-item">
            <h2 class="info-title">Tên danh mục</h2>
            <input type="text" class="info-text" id="category-name">
        </div>
        `;
        getAPI('category').then(category => {
            show.renderCategory(category)
        })
    } else if (option == 'account') {
        breadcrumb.innerHTML = "Tài khoản";
        breadcrumb.id = "" + "account";
        html += `
        <h2 class="title">Thông tin chi tiết</h2>
        <div class="info-item">
            <h2 class="info-title">Mã tài khoản</h2>
            <input type="text" class="info-text" id="account-id">
        </div>
        <div class="info-item">
            <h2 class="info-title">Tên đăng nhập</h2>
            <input type="text" class="info-text" id="account-name">
        </div>
        <div class="info-item">
            <h2 class="info-title">Mật khẩu</h2>
            <input type="text" class="info-text" id="account-pass">
        </div>
        `;
        getAPI('account').then(acc => {
            show.renderAccount(acc)
        })
    } else {
        breadcrumb.innerHTML = "Hóa đơn";
        breadcrumb.id = "" + "bills";
        html += `
        <h2 class="title">Thông tin chi tiết</h2>
        <div class="info-item">
            <h2 class="info-title">Mã hóa đơn</h2>
            <input type="text" class="info-text" id="bill-id">
        </div>
        <div class="info-item">
            <h2 class="info-title">Tên khách hàng</h2>
            <input type="text" class="info-text" id="bill-namecustomer">
        </div>
        <div class="info-item">
            <h2 class="info-title">Số điện thoại</h2>
            <input type="text" class="info-text" id="bill-phone">
        </div>
        <div class="info-item">
            <h2 class="info-title">Địa chỉ</h2>
            <input type="text" class="info-text" id="bill-adress">
        </div>
        <div class="info-item">
            <h2 class="info-title">Thành tiền</h2>
            <input type="text" class="info-text" id="bill-price">
        </div>
        <div class="info-item">
            <h2 class="info-title">Ngày mua</h2>
            <input type="date" class="info-text" id="bill-date">
        </div>
        `;
        getAPI('bills').then(bills => {
            show.renderBill(bills)
        })
    }
    infoContent.innerHTML = html;
    if (breadcrumb.id == 'items') {
        document.querySelector('#product-img').addEventListener('change', () => {
            document.querySelector('.show-img').src = "../img/" + document.querySelector('#product-img').files[0].name;
        })
    }
}

class DisplayTable {
    renderProduct(products) {
        let html = `
            <div class="row-header__item">Mã</div>
            <div class="row-header__item">Tên sản phẩm</div>
            <div class="row-header__item">Mô tả</div>
            <div class="row-header__item">Mã danh mục</div>
            <div class="row-header__item">Số lượng</div>
            <div class="row-header__item">Giá</div>
            <div class="row-header__item">Thao tác</div>`;
        headerTable.innerHTML = html;
        headerTable.style.gridTemplateColumns = "50px repeat(5, 1fr) 100px";

        let row = ``;
        listRow.innerHTML = row;
        products.forEach(product => {
            const div = document.createElement('div');
            div.classList.add("row");
            div.style.gridTemplateColumns = "50px repeat(5, 1fr) 100px";
            div.innerHTML = `
                <div class="row-item">${product.id}</div>
                <div class="row-item">${product.name}</div>
                <div class="row-item"><p class="row-item__desc">${product.desc}</p></div>
                <div class="row-item">${product.type}</div>
                <div class="row-item">${product.number}</div>
                <div class="row-item">${numberWithDots(product.price)}</div>
                <div class="row-item">
                    <i class="fas fa-trash btn-delete " data-id=${product.id}></i>
                    <i class="fas fa-edit btn-edit"  data-id=${product.id}></i>
                </div>
            `;
            listRow.appendChild(div);
        })
        document.querySelectorAll('.btn-delete').forEach(btnDels => {
            btnDels.addEventListener('click', () => {
                let id = btnDels.parentNode.parentNode.querySelectorAll('.row-item')[0].textContent;
                DeleteData(id, 'items');
                renderInfo('items', new DisplayTable());
            })
        })
    }
    renderCategory(category) {
        let html = `
            <div class="row-header__item">Mã</div>
            <div class="row-header__item">Tên danh mục</div>
            <div class="row-header__item">Thao tác</div>`;
        headerTable.innerHTML = html;
        headerTable.style.gridTemplateColumns = "150px repeat(1, 1fr) 100px";

        let row = ``;
        listRow.innerHTML = row;
        category.forEach(cat => {
            const div = document.createElement('div');
            div.classList.add("row");
            div.style.gridTemplateColumns = "150px repeat(1, 1fr) 100px";
            div.innerHTML = `
                <div class="row-item">${cat.id}</div>
                <div class="row-item">${cat.name}</div>
                <div class="row-item">
                    <i class="fas fa-trash btn-delete " data-id=${cat.id}></i>
                    <i class="fas fa-edit btn-edit"  data-id=${cat.id}></i>
                </div>
            `;
            listRow.appendChild(div);
        })
        document.querySelectorAll('.btn-delete').forEach(btnDels => {
            btnDels.addEventListener('click', () => {
                let id = btnDels.parentNode.parentNode.querySelectorAll('.row-item')[0].textContent;
                DeleteData(id, 'category');
            })
        })
    }
    renderAccount(acc) {
        let html = `
            <div class="row-header__item">Mã tài khoản</div>
            <div class="row-header__item">Tên đăng nhập</div>
            <div class="row-header__item">Mật khẩu</div>
            <div class="row-header__item">Thao tác</div>`;
        headerTable.innerHTML = html;
        headerTable.style.gridTemplateColumns = "100px repeat(2, 1fr) 100px";

        let row = ``;
        listRow.innerHTML = row;
        acc.forEach(acc => {
            const div = document.createElement('div');
            div.classList.add("row");
            div.style.gridTemplateColumns = "100px repeat(2, 1fr) 100px";
            div.innerHTML = `
                <div class="row-item">${acc.id}</div>
                <div class="row-item">${acc.username}</div>
                <div class="row-item">${acc.password}</div>
                <div class="row-item">
                    <i class="fas fa-trash btn-delete " data-id=${acc.id}></i>
                    <i class="fas fa-edit btn-edit"  data-id=${acc.id}></i>
                </div>
            `;
            listRow.appendChild(div);
        })
        document.querySelectorAll('.btn-delete').forEach(btnDels => {
            btnDels.addEventListener('click', () => {
                let id = btnDels.parentNode.parentNode.querySelectorAll('.row-item')[0].textContent;
                DeleteData(id, 'account');
            })
        })
    }
    renderBill(bills) {
        let html = `
            <div class="row-header__item">Mã hóa đơn</div>
            <div class="row-header__item">Tên khách hàng</div>
            <div class="row-header__item">Số điện thoại</div>
            <div class="row-header__item">Địa chỉ</div>
            <div class="row-header__item">Tổng tiền</div>
            <div class="row-header__item">Ngày mua</div>
            <div class="row-header__item">Thao tác</div>`;
        headerTable.innerHTML = html;
        headerTable.style.gridTemplateColumns = "100px repeat(5, 1fr) 100px";

        let row = ``;
        listRow.innerHTML = row;
        bills.forEach(bill => {
            const div = document.createElement('div');
            div.classList.add("row");
            div.style.gridTemplateColumns = "100px repeat(5, 1fr) 100px";
            div.innerHTML = `
                <div class="row-item">${bill.id}</div>
                <div class="row-item">${bill.nameCustomer}</div>
                <div class="row-item">${bill.phone}</div>
                <div class="row-item">${bill.adress}</div>
                <div class="row-item">${numberWithDots(bill.total)}</div>
                <div class="row-item">${bill.date}</div>
                <div class="row-item">
                    <i class="fas fa-trash btn-delete " data-id=${bill.id}></i>
                    <i class="fas fa-edit btn-edit"  data-id=${bill.id}></i>
                </div>
            `;
            listRow.appendChild(div);
        })
        document.querySelectorAll('.btn-delete').forEach(btnDels => {
            btnDels.addEventListener('click', () => {
                let id = btnDels.parentNode.parentNode.querySelectorAll('.row-item')[0].textContent;
                DeleteData(id, 'bills');
            })
        })
    }
}
//display currency
function numberWithDots(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

function GetData(id, name) {
    let options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    fetch("http://localhost:3000/" + name + "/" + id, options)
        .then(function (response) {
            return response.json();
        }).then(data => {
            document.querySelector('.show-img').src = data.img;
            console.log(data);
        });
}

function AddData(data, name) {
    let options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data)
    };
    fetch("http://localhost:3000/" + name, options)
        .then(function (response) {
            response.json();
        }).then(callback);
}

function DeleteData(id, name) {
    let options = {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    fetch("http://localhost:3000/" + name + "/" + id, options)
        .then(function (response) {
            response.json();
        })
}

function EditData(id, data, name) {
    let options = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data)
    };
    fetch("http://localhost:3000/" + name + "/" + id, options)
        .then(function (response) {
            response.json();
        })
}