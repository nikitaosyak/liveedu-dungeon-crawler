import {ITrigger, ITypedObject, IVisual2, IVisual} from "../Base";
import {RENDER_LAYER} from "../Renderer";
import {OBJECT_TYPE} from "../SImulation";


export const Button = (x, y) => {

    let collidedOnce = false
    const buttonUp = IVisual('level', 'floor_button').setAlpha(1)
    const buttonDown = IVisual('level', 'floor_button_pressed').setAlpha(0)

    const self = {}

    Object.assign(self, IVisual2(`level_tile_5`)
        .setPosition(x, y)
        .setLayer(RENDER_LAYER.LEVEL_BACKGROUND))
    Object.assign(self, ITypedObject(OBJECT_TYPE.BUTTON))
    Object.assign(self, ITrigger(
        new SAT.Box(new SAT.Vector(0, 0), 64, 64).toPolygon(),
        () => buttonUp.visual.alpha > 0,
        () => {
            buttonUp.visual.alpha = 0
            buttonDown.visual.alpha = 1
        }
    ))

    self.collided = (response, playerPos) => {
        if (collidedOnce) return false

        const playerCircle = new SAT.Circle(playerPos, 1)
        response.clear()

         if (SAT.testCirclePolygon(playerCircle, self.box, response)) {
             collidedOnce = true
             const s = window.resources.getSFX('sfx_button')
             s.volume = 0.5
             s.play()
             return true
         }
    }

    self.visual.addChild(buttonUp.visual)
    self.visual.addChild(buttonDown.visual)

    return self
}