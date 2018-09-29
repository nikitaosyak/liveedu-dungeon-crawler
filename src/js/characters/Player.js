import {IAnimated, IVisual} from "../Base";
import {RENDER_LAYER} from "../Renderer";
import {MathUtil} from "../utils/MathUtil";

export const PLAYER_ANIMATION = {IDLE: 'idle', WALK: 'walk', ATTACK: 'attack'}

export const Player = () => {

    const MOVE_SPEED = 120

    let facing = 1
    let currentAnimation = 'idle'

    const leftFlank = new SAT.Vector()
    const rightFlank = new SAT.Vector()

    const self = {
        get leftFlank() {
            leftFlank.x = self.visual.x - 50
            leftFlank.y = self.visual.y
            return leftFlank
        },
        get rightFlank() {
            rightFlank.x = self.visual.x + 50
            rightFlank.y = self.visual.y
            return rightFlank
        },
        update: (dt, velocity, attack) => {
            let newAnimation = currentAnimation

            if (currentAnimation === PLAYER_ANIMATION.ATTACK) {
                if (self.visual.currentFrame === self.visual.totalFrames-1) {
                } else {
                    return
                }
            }

            if (attack) {
                self.visual.loop = false
                newAnimation = PLAYER_ANIMATION.ATTACK
            } else {
                if (MathUtil.approximately(velocity.len2(), 0)) {
                    newAnimation = PLAYER_ANIMATION.IDLE
                } else {
                    newAnimation = PLAYER_ANIMATION.WALK
                    if (!MathUtil.approximately(velocity.x, 0)) {
                        facing = velocity.x
                    }
                    self.visual.x += velocity.x * MOVE_SPEED * dt
                    self.visual.y += velocity.y * MOVE_SPEED * dt
                }
                self.visual.loop = true
            }

            if (newAnimation !== currentAnimation) {
                self.setNewTextures(newAnimation)
                self.visual.play()
                currentAnimation = newAnimation
            }
            self.visual.scale.x = facing > 0 ? -1 : 1
        }
    }

    Object.assign(self, IAnimated('player', currentAnimation)
        .setAnchor(0.5, 0.625)
        .setLayer(RENDER_LAYER.CHARACTERS)
        .setPosition(100, 100)
        .setAnimationSpeed(0.15))


    return self
}