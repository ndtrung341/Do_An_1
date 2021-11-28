function openCloseDropdown(event) {
    let catList = document.querySelector(".header-category__list");
    if (!event.target.matches(".header-selected__text")) {
        catList.classList.remove("cat-show");
    } else {
        catList.classList.toggle("cat-show");
    }
}
window.onclick = function (event) {
    openCloseDropdown(event);
}
let catItems = document.querySelectorAll(".header-category__item");
function removeStatusItem() {
    for (item of catItems) {
        item.classList.remove("header-category__item--select");
    }
}
removeStatusItem();
catItems.forEach(item => {
    item.addEventListener("click", function () {
        removeStatusItem();
        let itemSelect = document.querySelector(".header-selected__text");
        itemSelect.textContent = "" + item.textContent;
        item.classList.add("header-category__item--select");
    })
})
