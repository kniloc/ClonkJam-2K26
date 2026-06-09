const game = document.getElementById('game');
const diffDisplay = document.getElementById('difficulty-display');
let difficulty = 1.0;

function updateDisplay() {
    diffDisplay.textContent = 'difficulty: ' + difficulty;
}
updateDisplay();

window.addEventListener('message', (e) => {
    console.log('harness received:', e.data);
    switch (e.data.op) {
        case 'ready':
            game.contentWindow.postMessage({ op: 'start', difficulty });
            break;
        case 'started':
            console.log('game started, verb:', e.data.verb);
            break;
        case 'done':
            if (e.data.win) {
                difficulty === 1 ? difficulty = 5 : difficulty += 5;
            } else {
                difficulty = 1;
            }
            updateDisplay();
            setTimeout(() => {
                game.contentWindow.postMessage({ op: 'start', difficulty });
            }, 3000);
            break;
    }
});
