
function renderCategory() {
    getAPI('category').then(cats => {
        let html = ``;
        const list = document.querySelector('.header-product__list');
        cats.forEach(cat => {
            html += `
                <li class="header-product__item" data-cat="${cat.id}" onclick="location.href='./products.html'">${cat.name}</li>
            `;
        })
        list.innerHTML = html;
        let listCats = document.querySelectorAll('.header-product__item');
        listCats.forEach(cat => {
            cat.addEventListener('click', function () {
                let catStore = { 'cat': cat.dataset.cat };
                localStorage.setItem('type', JSON.stringify(catStore));
            })
        })
    })
}
renderCategory();
async function getAPI(name) {
    try {
        let result = await fetch("http://localhost:3000/" + name);
        let data = await result.json();
        return data
    } catch (error) {
        console.log(error);
    }
}