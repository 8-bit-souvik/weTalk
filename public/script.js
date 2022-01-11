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

