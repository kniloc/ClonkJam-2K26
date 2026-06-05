const Mound = [0.4869, 0.5156];

const Cells = [
    [0.4441, 0.6154], [0.4823, 0.6154], [0.5205, 0.6154],
    [0.4441, 0.6898], [0.4823, 0.6898], [0.5205, 0.6898],
    [0.4441, 0.7643], [0.4823, 0.7643], [0.5205, 0.7643],
];


export let ballX = 0, ballY = 0;
export let ballActive = false;
export let hitWindow = false;
export let targetX = 0, targetY = 0;
export let ballT = 0;

let startX, startY, ctrlX, ctrlY;
let t = 0, speed = 0;
let wasInHitWindow = false;
let missRegistered = false;
let isHomeRun = false;
let hrVx = 0, hrVy = 0;

export function pitch(canvas, difficulty) {
    const cell = Cells[Math.floor(Math.random() * 9)];
    startX = canvas.width * Mound[0];
    startY = canvas.height * Mound[1];
    targetX = canvas.width * cell[0];
    targetY = canvas.height * cell[1];

    const curve = canvas.width * (0.03 + 0.05 * (difficulty / 20));
    ctrlX = (startX + targetX) / 2 + (Math.random() - 0.5) * 2 * curve;
    ctrlY = (startY + targetY) / 2 + (Math.random() - 0.5) * 2 * curve;

    t = 0;
    speed = 0.012 + (difficulty / 20) * 0.015;
    ballActive = true;
    hitWindow = false;
    wasInHitWindow = false;
    missRegistered = false;
    isHomeRun = false;
}

export function startHomeRun(canvas) {
    isHomeRun = true;
    hrVx = canvas.width * 0.001;
    hrVy = -(canvas.height * 0.05);
}

export function updateBall(canvas, hasClicked) {
    if (!ballActive) return null;

    // home run arc takes over ball movement entirely
    if (isHomeRun) {
        hrVx += canvas.width * 0.0002;
        hrVy += 0.3 * (canvas.height / 500);
        ballX += hrVx;
        ballY += hrVy;

        if (ballY < 0 || ballX > canvas.width) {
            ballActive = false;
            isHomeRun = false;
            return 'done';
        }
        return null;
    }

    wasInHitWindow = hitWindow;
    t += speed;
    ballT = t;

    ballX = (1-t)**2 * startX + 2*(1-t)*t * ctrlX + t**2 * targetX;
    ballY = (1-t)**2 * startY + 2*(1-t)*t * ctrlY + t**2 * targetY;

    const dx = ballX - targetX;
    const dy = ballY - targetY;
    hitWindow = Math.sqrt(dx*dx + dy*dy) < canvas.width * 0.04 && t > 0.85;

    // ball just left strike zone without a click
    if (wasInHitWindow && !hitWindow && !hasClicked && !missRegistered) {
        missRegistered = true;
        return 'missed_zone';
    }

    // ball has traveled past target
    if (t >= 1.5) {
        ballActive = false;
        return 'done';
    }

    return null;
}

export function drawBall(canvas, ctx, img) {
    if (!ballActive) return;

    const minSize = canvas.width / 48;
    const maxSize = canvas.width / 20;
    const minY = canvas.height * 0.5156;

    const t = Math.max(0, Math.min(1, (ballY - minY) / (targetY - minY)));
    const size = minSize + t * (maxSize - minSize);

    ctx.drawImage(img, ballX - size / 2, ballY - size / 2, size, size);
}
