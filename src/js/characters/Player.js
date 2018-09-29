import {IAnimated, IVisual} from "../Base";
import {RENDER_LAYER} from "../Renderer";
import {MathUtil} from "../utils/MathUtil";

export const PLAYER_ANIMATION = {IDLE: 'idle', WALK: 'walk', ATTACK: 'attack', DEATH: 'death'}

export const Player = () => {

    const MOVE_SPEED = 120

    let facing = 1
    let currentAnimation = 'idle'

    const leftFlank = new SAT.Vector()
    const rightFlank = new SAT.Vector()

    let dieCounter = 0

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
        update: (dt, velocity, attack, die) => {
            let newAnimation = currentAnimation

            if (die) {
                newAnimation = PLAYER_ANIMATION.DEATH
                self.setAnimationSpeed(0.07)
                self.visual.loop = false

                if (currentAnimation === PLAYER_ANIMATION.DEATH) {
                    if (self.visual.currentFrame === self.visual.totalFrames-1) {
                        dieCounter += 1
                        if (dieCounter > 200) {
                            window.location.href = window.location.origin
                        }
                    }
                }
            } else {
                if (currentAnimation === PLAYER_ANIMATION.ATTACK) {
                    if (self.visual.currentFrame === self.visual.totalFrames-1) {
                    } else {
                        return
                    }
                }

                // if (attack) {
                //     self.visual.loop = false
                //     newAnimation = PLAYER_ANIMATION.ATTACK
                // } else {
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
                // }
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

    self.visual.onFrameChange = () => {
        if (currentAnimation === PLAYER_ANIMATION.WALK) {
            if (self.visual.currentFrame === 1) {
                const s = window.resources.getSFX('sfx_step0')
                s.volume = 0.1
                s.play()
            }
            if (self.visual.currentFrame === 3) {
                const s = window.resources.getSFX('sfx_step1')
                s.volume = 0.1
                s.play()
            }
        }

        if (currentAnimation === PLAYER_ANIMATION.DEATH) {
            if (self.visual.currentFrame === 2) {
                window.resources.getSFX('sfx_player_death').play()
            }
        }
    }


    return self
}