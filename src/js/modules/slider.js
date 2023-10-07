new Swiper('.swiper-container', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    simulateTouch: true,
    touchRatio: 0.5,
    touchAngle: 35,
    grabCursor: true,
    slidesPerView: 2,
    watchOverflow: true,
    spaceBetween: 16,
    slidesPerGroup: 1,
    freeMode: true,
    speed: 800,
});