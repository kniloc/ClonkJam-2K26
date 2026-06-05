export const bgFrames = [new Image(), new Image(), new Image(), new Image()];
export const bat = new Image();
export const baseball = new Image();

const srcs = [
    ['../assets/background.png', bgFrames[0]],
    ['../assets/background-1.png', bgFrames[1]],
    ['../assets/background-2.png', bgFrames[2]],
    ['../assets/background-3.png', bgFrames[3]],
    ['../assets/baseball.png', baseball],
    ['../assets/bat.png', bat]
];

export function loadAssets() {
    return Promise.all(
        srcs.map(([src, img]) => new Promise(resolve => {
            img.src = new URL(src, import.meta.url).href;
            img.onload = resolve;
        }))
    );
}