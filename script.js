// ====================
// ヘッダー背景切り替え
// ====================

const header = document.querySelector(".header");

function updateHeaderBg() {
    header.classList.toggle("scrolled", window.scrollY > 40);
}

window.addEventListener("scroll", updateHeaderBg);
updateHeaderBg();

// ====================
// ハンバーガーメニュー
// ====================

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    nav.classList.toggle("active");
    menuBtn.classList.toggle("active");
});

nav.addEventListener("click", (e) => {
    e.stopPropagation();
});

document.addEventListener("click", () => {
    nav.classList.remove("active");
    menuBtn.classList.remove("active");
});


// ====================
// 班紹介カルーセル
// ====================

const cards = document.querySelectorAll(".card");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let current = 0;

function updateCarousel() {

    cards.forEach(card => {
        card.classList.remove(
            "center",
            "card-left",
            "card-right",
            "hidden"
        );
    });

    const left =
        (current - 1 + cards.length) % cards.length;

    const right =
        (current + 1) % cards.length;

    cards[current].classList.add("center");
    cards[left].classList.add("card-left");
    cards[right].classList.add("card-right");

    cards.forEach((card, index) => {
        if (
            index !== current &&
            index !== left &&
            index !== right
        ) {
            card.classList.add("hidden");
        }
    });
}

nextBtn.addEventListener("click", () => {
    current = (current + 1) % cards.length;
    updateCarousel();
});

prevBtn.addEventListener("click", () => {
    current =
        (current - 1 + cards.length) %
        cards.length;

    updateCarousel();
});

updateCarousel();

// ====================
// Fade In
// ====================

const fades = document.querySelectorAll(".fade");

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{
    threshold:0.2
});

fades.forEach(item=>{
    observer.observe(item);
});

// ==========================
// Hero 背景フェード
// ==========================

const heroSlides = document.querySelectorAll(".hero-bg-slide");

if (heroSlides.length > 0) {

    let heroCurrent = 0;

    heroSlides[heroCurrent].classList.add("active");

    setInterval(() => {

        heroSlides[heroCurrent].classList.remove("active");

        heroCurrent = (heroCurrent + 1) % heroSlides.length;

        heroSlides[heroCurrent].classList.add("active");

    }, 5000);

}