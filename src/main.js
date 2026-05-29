const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouseX = 0;
let mouseY = 0;
let loaded = 0;

const bg = new Image();
bg.src = new URL('./assets/background.png', import.meta.url).href;
bg.onload = () => { loaded++; if (loaded === 2) loop(); };

const bat = new Image();
bat.src = new URL('./assets/bat.png', import.meta.url).href;
bat.onload = () => { loaded++; if (loaded === 2) loop(); };

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function loop() {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    const batSize = canvas.width / 16;
    ctx.drawImage(bat, mouseX - batSize / 2, mouseY - batSize / 2, batSize, batSize);
    requestAnimationFrame(loop);
}
