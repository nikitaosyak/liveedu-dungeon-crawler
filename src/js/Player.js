import {IVisual} from "./Base";
import {RENDER_LAYER} from "./Renderer";


export const Player = () => {

    const self = {
        MOVE_SPEED: 120,
    }

    Object.assign(self, IVisual('player', 'idle_0')
        .setAnchor(0.5, 0.625)
        .setLayer(RENDER_LAYER.CHARACTERS).setPosition(100, 100))


    return self
}