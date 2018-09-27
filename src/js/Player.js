import {IVisual} from "./Base";
import {RENDER_LAYER} from "./Renderer";


export const Player = () => {

    const self = {

    }

    Object.assign(self, IVisual('player', 'idle_0')
        .setAnchor(0.5, 0.7)
        .setLayer(RENDER_LAYER.CHARACTERS).setPosition(100, 100))


    return self
}