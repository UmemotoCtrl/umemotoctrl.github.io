document.addEventListener("DOMContentLoaded", () => {
    const burger = document.querySelector(".navbar-burger");
    const menu = document.getElementById(burger?.dataset.target);
    burger?.addEventListener("click", () => {
        const isActive = burger.classList.toggle("is-active");
        menu?.classList.toggle("is-active", isActive);
        burger.setAttribute("aria-expanded", String(isActive));
    });
});

function adjustBodyPadding() {
    const navbar = document.querySelector(".navbar.is-fixed-top");
    if (navbar) document.body.style.paddingTop = `${navbar.offsetHeight}px`;
}

document.addEventListener("DOMContentLoaded", adjustBodyPadding);
window.addEventListener("resize", adjustBodyPadding);
