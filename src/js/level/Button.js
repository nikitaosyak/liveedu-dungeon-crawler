import {ITrigger, ITypedObject, IVisual} from "../Base";
import {RENDER_LAYER} from "../Renderer";
import {OBJECT_TYPE} from "../SImulation";


export const Button = (x, y) => {

    const buttonUp = IVisual('level', 'floor_button').setAlpha(1)
    const buttonDown = IVisual('level', 'floor_button_pressed').setAlpha(0)

    const self = {}

    Object.assign(self, IVisual('level', `tile_5`)
        .setPosition(x, y)
        .setLayer(RENDER_LAYER.LEVEL_BACKGROUND).setName('tile_30'))
    Object.assign(self, ITypedObject(OBJECT_TYPE.BUTTON))
    Object.assign(self, ITrigger(
        new SAT.Box(new SAT.Vector(0, 0), 64, 64).toPolygon(),
        () => buttonUp.visual.alpha > 0,
        () => {
            buttonUp.visual.alpha = 0
            buttonDown.visual.alpha = 1
        }
    ))

    self.visual.addChild(buttonUp.visual)
    self.visual.addChild(buttonDown.visual)

    return self
}