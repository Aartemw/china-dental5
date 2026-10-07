// Проверяем, что JavaScript подключился
console.log("Сайт ChinaStom запущен");


// ==============================
// ПЛАВНАЯ ПРОКРУТКА
// ==============================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (event) {

        const targetId = this.getAttribute("href");

        if (targetId === "#") return;

        const target = document.querySelector(targetId);

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

    });

});


// ==============================
// МОБИЛЬНОЕ МЕНЮ
// ==============================

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuToggle && nav) {

    menuToggle.addEventListener("click", function () {
    nav.classList.toggle("active");
    menuToggle.classList.toggle("active");
});

    nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function () {
        nav.classList.remove("active");
        menuToggle.classList.remove("active");
    });
});

}


// ==============================
// ФОРМА
// ==============================

const phoneInput = document.querySelector("#phone");

if (phoneInput) {
    phoneInput.addEventListener("input", function () {

        // Сразу убираем старую ошибку
        this.setCustomValidity("");

        let digits = this.value.replace(/\D/g, "");

        // 8XXXXXXXXXX → 7XXXXXXXXXX
        if (digits.startsWith("8")) {
            digits = "7" + digits.slice(1);
        }

        // Разрешаем только российский номер
        if (digits.length > 0 && !digits.startsWith("7")) {
            digits = "";
        }

        // Максимум 11 цифр
        digits = digits.slice(0, 11);

        if (digits.length === 0) {
            this.value = "";
            return;
        }

        let formatted = "+7";

        if (digits.length > 1) {
            formatted += " (" + digits.slice(1, 4);
        }

        if (digits.length >= 4) {
            formatted += ") " + digits.slice(4, 7);
        }

        if (digits.length >= 7) {
            formatted += "-" + digits.slice(7, 9);
        }

        if (digits.length >= 9) {
            formatted += "-" + digits.slice(9, 11);
        }

        this.value = formatted;
    });
}

const form = document.querySelector("#contact-form");

if (form) {

    form.addEventListener("submit", async function (event) {

        const phone = form.querySelector("#phone");

if (phone) {
    const digits = phone.value.replace(/\D/g, "");

    if (digits.length !== 11 || !digits.startsWith("7")) {
        event.preventDefault();

        phone.setCustomValidity(
            "Введите полный номер телефона в формате +7 (XXX) XXX-XX-XX"
        );

        phone.reportValidity();

        return;
    }

    phone.setCustomValidity("");
}

        event.preventDefault();

        const button = form.querySelector('button[type="submit"]');

        if (button) {
            button.textContent = "Отправляем...";
            button.disabled = true;
        }

        try {

            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.ok) {

                form.innerHTML = `
                    <div class="form-success">
                        <div class="form-success__icon">✓</div>

                        <h3>Спасибо за заявку!</h3>

                        <p>
                            Мы получили ваши данные.
                            Свяжемся с вами в ближайшее время
                            и ответим на все вопросы.
                        </p>

                        <a href="#services" class="form-success__link">
                            Вернуться к услугам
                        </a>
                    </div>
                `;

            } else {

                throw new Error("Ошибка отправки");

            }

        } catch (error) {

            if (button) {
                button.textContent = "Попробовать снова";
                button.disabled = false;
            }

            alert("Не удалось отправить заявку. Попробуйте ещё раз.");

        }

    });

}

// ==============================
// ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ПРИ ПРОКРУТКЕ
// ==============================

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                revealObserver.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.15
    }
);


revealElements.forEach(function (element) {
    revealObserver.observe(element);
});

/* =========================================
   REVIEWS — CUSTOM SCROLLBAR
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const reviewsGrid = document.querySelector(".reviews__grid");
    const scrollbar = document.querySelector(".reviews__scrollbar");
    const scrollbarTrack = document.querySelector(".reviews__scrollbar-track");
    const scrollbarThumb = document.querySelector(".reviews__scrollbar-thumb");

    if (!reviewsGrid || !scrollbar || !scrollbarTrack || !scrollbarThumb) {
        return;
    }

    function updateScrollbar() {

        const visibleWidth = reviewsGrid.clientWidth;
        const totalWidth = reviewsGrid.scrollWidth;

        if (totalWidth <= visibleWidth) {
            scrollbar.style.display = "none";
            return;
        }

        scrollbar.style.display = "";

        const thumbWidth =
            (visibleWidth / totalWidth) * 100;

        scrollbarThumb.style.width =
            Math.max(20, thumbWidth) + "%";

        const maxScroll =
            totalWidth - visibleWidth;

        const maxThumbMove =
            scrollbarTrack.clientWidth -
            scrollbarThumb.offsetWidth;

        const scrollPercent =
            reviewsGrid.scrollLeft / maxScroll;

        scrollbarThumb.style.transform =
            `translateX(${maxThumbMove * scrollPercent}px)`;
    }


    /* Прокрутка отзывов колесом мыши */

    reviewsGrid.addEventListener("wheel", function (event) {

        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {

            event.preventDefault();

            reviewsGrid.scrollLeft += event.deltaY;
        }

    }, { passive: false });


    /* Синхронизация ползунка */

    reviewsGrid.addEventListener("scroll", updateScrollbar);


    /* Клик по дорожке */

    scrollbarTrack.addEventListener("click", function (event) {

        if (event.target === scrollbarThumb) {
            return;
        }

        const rect =
            scrollbarTrack.getBoundingClientRect();

        const clickPosition =
            event.clientX - rect.left;

        const percent =
            clickPosition / rect.width;

        const maxScroll =
            reviewsGrid.scrollWidth -
            reviewsGrid.clientWidth;

        reviewsGrid.scrollLeft =
            maxScroll * percent;

    });


    /* Перетаскивание ползунка */

    let isDragging = false;
    let startX = 0;
    let startScroll = 0;


    scrollbarThumb.addEventListener("mousedown", function (event) {

        isDragging = true;

        startX = event.clientX;

        startScroll =
            reviewsGrid.scrollLeft;

        document.body.style.userSelect = "none";

        scrollbarThumb.style.cursor = "grabbing";

        event.preventDefault();

    });


    document.addEventListener("mousemove", function (event) {

        if (!isDragging) {
            return;
        }

        const deltaX =
            event.clientX - startX;

        const trackWidth =
            scrollbarTrack.clientWidth;

        const thumbWidth =
            scrollbarThumb.offsetWidth;

        const availableWidth =
            trackWidth - thumbWidth;

        const maxScroll =
            reviewsGrid.scrollWidth -
            reviewsGrid.clientWidth;

        const scrollMove =
            deltaX / availableWidth;

        reviewsGrid.scrollLeft =
            startScroll +
            scrollMove * maxScroll;

    });


    document.addEventListener("mouseup", function () {

        if (!isDragging) {
            return;
        }

        isDragging = false;

        document.body.style.userSelect = "";

        scrollbarThumb.style.cursor = "grab";

    });


    /* Пересчитываем при изменении размера окна */

    window.addEventListener("resize", updateScrollbar);


    /* Первый запуск */

    updateScrollbar();

});