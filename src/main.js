import {loadAssets, bgFrames, bat, baseball} from "./lib/assets.js";
import {ballActive, ballX, ballY, ballT, drawBall, hitWindow, targetX, targetY, pitch, startHomeRun, updateBall} from "./lib/ball.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouseX = 0;
let mouseY = 0;
let strikes = 0;
let difficulty = 0;
let pendingResult = null;
let hasClicked = false;
let gameOver = false;

//TODO: perhaps squash or stretch the baseball based on power? ~asrael_io

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
});

canvas.addEventListener('mousedown', () => {
    if (hasClicked || gameOver || !ballActive) return;
    hasClicked = true;

    const size = canvas.width / 32;
    const dist = Math.hypot(mouseX - ballX, mouseY - ballY);

    if (hitWindow && dist < size / 2) {
        pendingResult = 'hit';
        startHomeRun(canvas);
    } else {
        pendingResult = 'miss';
        strikes = Math.min(strikes + 1, 3);
    }
});

window.addEventListener('message', (e) => {
    if(e.data?.op === 'start') {
        difficulty = e.data.difficulty;
        window.parent.postMessage({op: 'started', verb: 'Swing!'});
        startGame();
    }
})

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function startGame() {
    strikes = 0;
    gameOver = false;
    doPitch();
}

function doPitch() {
    hasClicked = false;
    pendingResult = null;
    pitch(canvas, difficulty);
}

function endGame(win) {
    gameOver = true;
    window.parent.postMessage({op: 'done', win})
    strikes = 0;
    pendingResult = null;
    hasClicked = false;
}

function drawBackground() {
    ctx.drawImage(bgFrames[strikes], 0, 0, canvas.width, canvas.height);
}

function drawGhostBall() {
    if (!ballActive) return;

    const alpha = Math.max(0, 1 - (ballT / 0.5));
    if (alpha === 0) return;

    const size = canvas.width / 20;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(baseball, targetX - size / 2, targetY - size / 2, size, size);
    ctx.restore();
}

function drawBat() {
    const batSize = canvas.width / 16;
    ctx.drawImage(bat, mouseX - batSize / 2, mouseY - batSize / 2, batSize, batSize);
}

function gameLoop() {
    const ballStatus = updateBall(canvas, hasClicked);

    //ball has left the strike zone without a click (that's a strike)
    if (ballStatus === 'missed_zone' && pendingResult === null) {
        pendingResult = 'miss';
        hasClicked = true;
        strikes = Math.min(strikes + 1, 3);
    }

    //ball finished traveling; resolve the pending result
    if (ballStatus === 'done') {
        // if no result was registered (ball never entered zone or edge case), treat as miss
        if (pendingResult === null) {
            pendingResult = 'miss';
            strikes = Math.min(strikes + 1, 3);
        }

        const result = pendingResult;
        pendingResult = null;
        if (result === 'hit') {
            setTimeout(() => endGame(true), 1000);
        } else if (strikes >= 3) {
            setTimeout(() => endGame(false), 1000);
        } else {
            setTimeout(doPitch, 1000);
        }
    }

    drawBackground();
    drawGhostBall();
    drawBall(canvas, ctx, baseball);
    drawBat();
    requestAnimationFrame(gameLoop);
}

loadAssets().then(() => {
    window.parent.postMessage({op: 'ready'});
    gameLoop()
});