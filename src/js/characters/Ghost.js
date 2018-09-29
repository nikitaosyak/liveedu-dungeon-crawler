import {IAnimated, IVisual} from "../Base";
import {RENDER_LAYER} from "../Renderer";
import {MathUtil} from "../utils/MathUtil";

export const GHOST_ANIMATION = {WALK: 'walk', ATTACK: 'attack', DEATH: 'death'}
export const GHOST_STATES = {CATCH: 'catch', PATROL: 'patrol'}

export const Ghost = () => {

    const MOVE_SPEED = 90

    let facing = 1
    let currentAnimation = GHOST_ANIMATION.WALK
    let currentState = GHOST_STATES.PATROL
    let currentPOI = new SAT.Vector(NaN, NaN)
    let currentPatrolAngle = new SAT.Vector(Math.random(), Math.random())
    let currentMilage = 0

    const self = {
        update: (dt, player) => {
            let attack = false
            let newState = currentState
            let newAnimation = currentAnimation

            // if (isNaN(currentPOI.len2)) {}
            if (MathUtil.approximately(currentPOI.len2(), 0)) {

            }
            if (currentState === GHOST_STATES.PATROL) {
                const movement = new SAT.Vector(
                    currentPatrolAngle.x * dt * MOVE_SPEED,
                    currentPatrolAngle.y * dt * MOVE_SPEED
                    )
                self.visual.x += movement.x
                self.visual.y += movement.y
                currentMilage += movement.len()

                if (currentMilage > 30) {
                    currentPatrolAngle.rotate(Math.PI / 6)
                    currentMilage = 0
                }

                facing = movement.x > 0 ? 1 : -1
            }

            // let newAnimation = currentAnimation
            //
            // if (currentAnimation === GHOST_ANIMATION.ATTACK) {
            //     if (self.visual.currentFrame === self.visual.totalFrames-1) {
            //     } else {
            //         return
            //     }
            // }
            //
            // if (attack) {
            //     self.visual.loop = false
            //     newAnimation = GHOST_ANIMATION.ATTACK
            // } else {
            //     newAnimation = GHOST_ANIMATION.WALK
            //     if (!MathUtil.approximately(velocity.x, 0)) {
            //         facing = velocity.x
            //     }
            //     self.visual.x += velocity.x * MOVE_SPEED * dt
            //     self.visual.y += velocity.y * MOVE_SPEED * dt
            //     self.visual.loop = true
            // }
            //
            if (newAnimation !== currentAnimation) {
                self.setNewTextures(newAnimation)
                self.visual.play()
                currentAnimation = newAnimation
            }
            self.visual.scale.x = facing > 0 ? -1 : 1
        }
    }

    Object.assign(self, IAnimated('ghost', currentAnimation)
        .setAnchor(0.5, 0.625)
        .setLayer(RENDER_LAYER.CHARACTERS)
        .setPosition(100, 100)
        .setAnimationSpeed(0.15))


    return self
}