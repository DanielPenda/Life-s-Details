"use strict"

// GSAP Animations
gsap.from('.navbar-brand', { duration: 1, y: -50, opacity: 0, delay: 0.5 });
gsap.from('.carousel-caption', { duration: 1, y: 50, opacity: 0, delay: 1 });
gsap.from('.service-card', { duration: 1, opacity: 0, y: 50, stagger: 0.3, delay: 1.5 });


// Animate Services Section
gsap.from('.service-card', {
    scrollTrigger: {
        trigger: '.services-section',
        start: 'top 80%',
    },
    opacity: 0,
    y: 50,
    stagger: 0.3,
    duration: 1,
});

// Animate Testimonials Section
gsap.from('.testimonial-item', {
    scrollTrigger: {
        trigger: '.testimonials-section',
        start: 'top 80%',
    },
    opacity: 0,
    y: 50,
    stagger: 0.3,
    duration: 1,
});

// Animate Contact Section
gsap.from('.contact-info', {
    scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 80%',
    },
    opacity: 0,
    x: -50,
    duration: 1,
});

gsap.from('.map-container', {
    scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 80%',
    },
    opacity: 0,
    x: 50,
    duration: 1,
});