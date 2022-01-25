// const hostURL = 'http://127.0.0.1:5510/'                        // localhost
const hostURL = 'http://192.168.1.128:5510/'                    // my LAN
// const hostURL = 'https://wetalk021.herokuapp.com/'              // production



document.querySelector(".collapsible").addEventListener("click", function () {
    var navbar = document.querySelector(".menu");
    if (navbar.style.left == '0px') {
        navbar.style.left = '-225px'
        navbar.querySelector("#arrow").src = "public/icons/angle-right-solid.svg"
    } else {
        navbar.style.left = '0px'
        navbar.querySelector("#arrow").src = "public/icons/angle-left-solid.svg"
    }
})


document.querySelector(".sub-navs").addEventListener("click", function () {
    var navbar = document.querySelector(".menu");
    if (navbar.style.left == '0px') {
        navbar.style.left = '-225px'
        navbar.querySelector("#arrow").src = "public/icons/angle-right-solid.svg"
    } else {
        navbar.style.left = '0px'
        navbar.querySelector("#arrow").src = "public/icons/angle-left-solid.svg"
    }
})


document.querySelector(".logoimage").addEventListener("click", function () {
    window.location.href = "/home"
})