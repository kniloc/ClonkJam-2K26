import { loadAssets, bgFrames, bat } from "./lib/assets.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouseX = 0;
let mouseY = 0;
let strikes = 0;

//TODO: perhaps squash or stretch the baseball based on power? ~asrael_io

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
});

canvas.addEventListener('mousedown', () => {
    strikes = Math.min(strikes + 1, 3);
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function drawBackground() {
    ctx.drawImage(bgFrames[strikes], 0, 0, canvas.width, canvas.height);
}

function drawBat() {
    const batSize = canvas.width / 16;
    ctx.drawImage(bat, mouseX - batSize / 2, mouseY - batSize / 2, batSize, batSize);
}

function gameLoop() {
    drawBackground();
    drawBat();
    requestAnimationFrame(gameLoop);
}

loadAssets().then(() => gameLoop());