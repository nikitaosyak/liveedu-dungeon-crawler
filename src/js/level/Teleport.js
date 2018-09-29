import {IAnimated, ITrigger, ITypedObject, IVisual} from "../Base";
import {RENDER_LAYER} from "../Renderer";
import {OBJECT_TYPE} from "../SImulation";

export const Teleport = (x, y) => {

    const self = {
        _disabled: false
    }

    Object.assign(self, IVisual('level', `tile_5`)
        .setPosition(x, y)
        .setLayer(RENDER_LAYER.LEVEL_BACKGROUND).setName('tile_20'))
    Object.assign(self, ITypedObject(OBJECT_TYPE.TELEPORT))
    Object.assign(self, ITrigger(
        new SAT.Box(new SAT.Vector(10, 20), 44, 24).toPolygon(),
        () => true,
        () => {
            self.leadsTo._disabled = true
        }
    ))

    self.collided = (response, playerPos) => {
        const playerCircle = new SAT.Circle(playerPos, 1)
        response.clear()

        const collision = SAT.testCirclePolygon(playerCircle, self.box, response)
        if (self._disabled && !collision) {
            self._disabled = false
        }
        if (self._disabled) return false
        return collision
    }

    self.visual.addChild(IAnimated('level', 'teleport').setPosition(0, 16).visual)
    return self
}