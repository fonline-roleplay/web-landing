const { Splide } = require('@splidejs/splide');

document.addEventListener('DOMContentLoaded', function() {
    for (const el of document.querySelectorAll('.splide')) {
        const slides = el.querySelectorAll('.splide__slide')
        const splide = new Splide(el)
        splide.on('pagination:mounted', function(data) {
            data.list.classList.add('splide__pagination--titles');
            data.items.forEach(function(item) {
                const slide = slides[item.page];
                const title = slide.dataset.title || (item.page + 1);
                const icon = slide.dataset.icon;
                //item.button.textContent = String(`<span>${title}</span>`);
                item.button.innerHTML = `<div class=title>${title}</div><img class=icon src="${icon}">`;
            });
        });
        splide.mount();
    }

    for (const el of document.querySelectorAll('.js-play')) {
        el.addEventListener('click', function(e) {
            el.classList.add('is-active');
            const targetSelector = el.dataset.target;
            const targetURL = el.dataset.url;
            for (const target of document.querySelectorAll(targetSelector)) {
                target.style.visibility = 'visible';
                target.src = targetURL;
            }
        })
    }
});