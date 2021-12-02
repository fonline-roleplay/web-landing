const { Splide, EVENT_SCROLL } = require('@splidejs/splide');

const SimpleBar = require('simplebar');

function initSlider(el, isVertical = false) {
    const slides = el.querySelectorAll('.splide__slide')
    const options = {
        wheel: false,
        height: '800px',
    };
    if (isVertical) {
        options['direction'] = 'ttb';
    }
    const splide = new Splide(el, options)
    splide.on('pagination:mounted', function(data) {
        const splide = data.list.parentElement;
        if (splide.classList.contains('--slider')) return;

        const sidebar = document.createElement('DIV');
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
    splide.on('mounted', function(e) {
        for (const cel of splide.root.querySelectorAll('.splide:not(.is-initialized)')) {
            initSlider(cel, false);
        }
        /*
        for (const slider of splide.querySelectorAll('.splide > .splide__track > .splide__list > .splide__slide > .splide')) {
            initSlider(slider);
        }*/
    });
    splide.mount();
}

document.addEventListener('DOMContentLoaded', function() {
    for (const el of document.querySelectorAll('.tool > .splide:not(.is-initialized)')) {
        initSlider(el, true);
    }

    /*for (const el of document.querySelectorAll('.splide__slide--video')) {
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
    }*/

    /*Array.prototype.forEach.call(
        document.querySelectorAll('.--with-scrollbar'),
        el => new SimpleBar()
    );*/

    for (const scrollbar of document.querySelectorAll('.--with-scrollbar')) {
        new SimpleBar(scrollbar)
    }
});