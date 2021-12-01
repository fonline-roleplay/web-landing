const { Splide, EVENT_SCROLL } = require('@splidejs/splide');

document.addEventListener('DOMContentLoaded', function() {
    for (const el of document.querySelectorAll('.splide')) {
        const slides = el.querySelectorAll('.splide__slide')
        const splide = new Splide(el)
        splide.on('pagination:mounted', function(data) {
            const sidebar = document.createElement('DIV');
            const splide = data.list.parentElement;
            const pagination = data.list;
            sidebar.classList.add('splide__sidebar')
            data.list.classList.add('splide__button-grid');
            data.items.forEach(function(item) {
                const slide = slides[item.page];
                const title = slide.dataset.title || (item.page + 1);
                const icon = slide.dataset.icon;
                if (icon) {
                    item.button.innerHTML = `<div class='btn__header'><div class=title>${title}</div><img class=icon src="${icon}"></div>`;
                } else {
                    item.button.innerHTML = `<div class='btn__header'><div class=title>${title}</div></div>`;
                }
                item.button.parentElement.classList.add('btn')
                item.button.parentElement.classList.add('btn--with-dot')
                item.button.classList.add('btn--transparent')
            });
            splide.appendChild(sidebar);
            for (const block of splide.querySelectorAll('.splide__before-pagination') || []) {
                sidebar.appendChild(block)
            }
            sidebar.appendChild(pagination);

            for (const block of splide.querySelectorAll('.splide__after-pagination') || []) {
                sidebar.appendChild(block)
            }
        });
        splide.mount();
    }

    for (const el of document.querySelectorAll('.splide__slide--video')) {
        el.addEventListener('click', function(e) {
            const targetURL = el.dataset.url;
            for (const target of el.querySelectorAll('iframe')) {
                target.style.visibility = 'visible';
                target.src = targetURL;
            }
            for (const target of el.querySelectorAll('.splide__screen__description')) {
                target.style.display = 'none';
            }
            el.classList.add('is-playing')
        })
    }
});