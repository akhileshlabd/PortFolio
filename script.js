// GSAP for complex animations
// gsap.to(".hero-title", { 
//     duration: 2, 
//     textShadow: "0px 0px 20px #39ff14",
//     repeat: -1,
//     yoyo: true
// });

// gsap.to(".hero-subtitle", { 
//     duration: 2, 
//     x: 20, 
//     ease: "power1.inOut", 
//     repeat: -1, 
//     yoyo: true 
// });

// Parallax Effect
// document.addEventListener('mousemove', (e) => {
//     const layers = document.querySelectorAll('.hero-title, .hero-subtitle');
//     layers.forEach(layer => {
//         const speed = layer.getAttribute('data-speed');
//         const x = (window.innerWidth - e.pageX * speed) / 100;
//         const y = (window.innerHeight - e.pageY * speed) / 100;
//         layer.style.transform = `translateX(${x}px) translateY(${y}px)`;
//     });
// });

// GSAP for complex animations
// gsap.to(".hero-title", { 
//     duration: 2, 
//     textShadow: "0px 0px 20px #39ff14",
//     repeat: -1,
//     yoyo: true
// });

// gsap.to(".hero-subtitle", { 
//     duration: 2, 
//     x: 20, 
//     ease: "power1.inOut", 
//     repeat: -1, 
//     yoyo: true 
// });

// Parallax Effect
// document.addEventListener('mousemove', (e) => {
//     const layers = document.querySelectorAll('.hero-title, .hero-subtitle');
//     layers.forEach(layer => {
//         const speed = layer.getAttribute('data-speed') || 1; // Default to 1 if not set
//         const x = (window.innerWidth - e.pageX * speed) / 100;
//         const y = (window.innerHeight - e.pageY * speed) / 100;
//         layer.style.transform = `translateX(${x}px) translateY(${y}px)`;
//     });
// });

document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter-number');

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const increment = target / 200;
        
        const updateCount = () => {
            if (count < target) {
                count += increment;
                counter.innerText = Math.ceil(count);
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target;
            }
        };

        updateCount();
    });
});

