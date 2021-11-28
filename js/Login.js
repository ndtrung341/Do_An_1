import Users from "../js/GetUser.js";
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('.header-icon__user').addEventListener('click', function () {
        document.getElementsByTagName("BODY")[0].classList.add("open-modal");
    })
    document.querySelector('.btn-close').addEventListener('click', () => {
        document.getElementsByTagName("BODY")[0].classList.remove("open-modal");
    })

    document.querySelector('.question-login').addEventListener('click', () => {
        document.querySelector('.signin').style.display = "block";
        document.querySelector('.signup').style.display = "none";
    })
    document.querySelector('.question-signup').addEventListener('click', () => {
        document.querySelector('.signin').style.display = "none";
        document.querySelector('.signup').style.display = "block";
    })
    const listUser = new Users();
    listUser.getUsers().then(users => {
        localStorage.setItem("listUser", JSON.stringify(users));
        if (localStorage.getItem('user')) {
            document.querySelector('.header-user__info').style.display = 'block';
            document.querySelector('.header-icon__user').style.display = 'none';
        }
    }).then(() => {
        document.querySelector('.btn-signin').addEventListener('click', () => {
            let username = document.querySelector('#username').value;
            let pass = document.querySelector('#password').value;
            let list = JSON.parse(localStorage.getItem("listUser"));
            if (list.some(user => user.username == username && user.password == pass)) {

                document.querySelector('.header-user__info').style.display = 'block';
                document.querySelector('.header-icon__user').style.display = 'none';
                document.getElementsByTagName("BODY")[0].classList.remove("open-modal");
                let findUser = list.filter(user => user.username == username)[0];
                let cart = findUser.cart;
                let id = findUser.id;
                localStorage.setItem('user', JSON.stringify({ "id": id, "username": username, "password": pass, "cart": cart }));
                window.location.reload();
            } else if (username == '' || pass == '') {
                document.querySelector('.message').innerHTML = "" + "Không được để trống";
            } else if (list.some(user => user.username == username && user.password != pass)) {
                document.querySelector('.message').innerHTML = "" + "Sai mật khẩu";
            } else {
                document.querySelector('.message').innerHTML = "" + "Tài khoản không tồn tại";
            }
        })
        document.querySelector('.logout').addEventListener('click', () => {
            document.querySelector('.header-user__info').style.display = 'none';
            document.querySelector('.header-icon__user').style.display = 'block';
            let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
            let user = JSON.parse(localStorage.getItem('user'));
            let userCart = cart;
            let userUpdate = { "id": user.id, "username": user.username, "password": user.password, "cart": userCart };
            deleteCartUser(user.id, userUpdate);

            localStorage.removeItem('cart');
            localStorage.removeItem('user');
            window.location.href = "./Home.html";
        })
        document.querySelector('.btn-signup').addEventListener('click', () => {
            let username = document.querySelectorAll('#username')[1].value;
            let pass = document.querySelectorAll('#password')[1].value;
            let repass = document.querySelector('#re-password').value;
            let list = [username, pass, repass];
            let listUser = JSON.parse(localStorage.getItem("listUser"));
            document.querySelector('.message').innerHTML = "" + "Không được để trống";
            if(list.some(item=>item==='')){
                document.querySelectorAll('.message')[1].innerHTML = "" + "Không được để trống";
                console.log(1);
            } else if (listUser.some(user=>user.username==username)) {
                document.querySelectorAll('.message')[1].innerHTML = "" + "Tên đăng nhập đã tồn tại";
            }
            else if (pass != repass) {
                document.querySelectorAll('.message')[1].innerHTML = "" + "Mật khẩu không giống nhau";
            } else {
                let format = {
                    "username": username,
                    "password": pass,
                    "cart": []
                }
                createUser(format);
            }
        })
    })

})
function createUser(data) {
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
        })
}

function deleteCartUser(id, data) {
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
        }).then(function () {
            // if(data){
            //     createCartUser(data);
            // }
        });
}
