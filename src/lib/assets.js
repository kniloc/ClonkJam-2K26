import bg0 from '../assets/background.png';
import bg1 from '../assets/background-1.png';
import bg2 from '../assets/background-2.png';
import bg3 from '../assets/background-3.png';
import bgLoseSrc from '../assets/background-L.png';
import bgWinSrc from '../assets/background-W.png';
import baseballSrc from '../assets/baseball.png';
import batSrc from '../assets/bat.png';

export const bgFrames = [new Image(), new Image(), new Image(), new Image()];
export const bgLose = new Image();
export const bgWin = new Image();
export const bat = new Image();
export const baseball = new Image();

export function loadAssets() {
    const srcs = [
        [bg0, bgFrames[0]],
        [bg1, bgFrames[1]],
        [bg2, bgFrames[2]],
        [bg3, bgFrames[3]],
        [bgLoseSrc, bgLose],
        [bgWinSrc, bgWin],
        [baseballSrc, baseball],
        [batSrc, bat],
    ];
    return Promise.all(
        srcs.map(([src, img]) => new Promise(resolve => {
            img.src = src;
            img.onload = resolve;
        }))
    );
}