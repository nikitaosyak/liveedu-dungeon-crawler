import {IAnimated, IEmitter, IVisual} from "../Base";
import {RENDER_LAYER} from "../Renderer";
import {MathUtil} from "../utils/MathUtil";

export const GHOST_ANIMATION = {WALK: 'walk', ATTACK: 'attack', DEATH: 'death'}
export const GHOST_STATES = {CHASE: 'CHASE', ATTACK: 'ATTACK', PATROL: 'PATROL', RETURN_TO_PATROL: 'RETURN_TO_PATROL'}

export const Ghost = () => {

    const PATROL_SPEED = 60 + MathUtil.randomRange(-5, 5)
    const CHASE_SPEED = 90 + MathUtil.randomRange(-5, 5)
    const RETURN_TO_PATROL_SPEED = 70 + MathUtil.randomRange(-5, 5)

    let facing = 1
    let currentAnimation = GHOST_ANIMATION.WALK
    let currentState = GHOST_STATES.PATROL
    let currentPatrolAngle = new SAT.Vector(Math.random(), Math.random())
    currentPatrolAngle.normalize()
    let currentMilage = 0

    let chaseStart = new SAT.Vector()
    const updateMovement = new SAT.Vector()
    const self = {
        update: (dt, player) => {
            const distanceFrom = poi => {
                const poiDistance = new SAT.Vector(poi.x, poi.y)
                poiDistance.sub(new SAT.Vector(self.visual.x, self.visual.y))
                return poiDistance.len()
            }

            const playerWithinChaseRange = () => {
                if (distanceFrom(player.visual) < 200) {
                    chaseStart.x = self.visual.x
                    chaseStart.y = self.visual.y
                    currentState = GHOST_STATES.CHASE
                }
            }

            const moveTowards = (destination, speed) => {
                updateMovement.x = destination.x - self.visual.x
                updateMovement.y = destination.y - self.visual.y
                updateMovement.normalize()
                updateMovement.x *= dt * speed
                updateMovement.y *= dt * speed
            }

            let attack = false
            let newAnimation = currentAnimation

            updateMovement.x = updateMovement.y = 0

            if (currentState === GHOST_STATES.PATROL) {
                if (playerWithinChaseRange()) return

                updateMovement.x = currentPatrolAngle.x * dt * PATROL_SPEED
                updateMovement.y = currentPatrolAngle.y * dt * PATROL_SPEED
                facing = updateMovement.x > 0 ? 1 : -1

                if (currentMilage > 30) {
                    currentPatrolAngle.rotate(Math.PI / 6)
                    currentMilage = 0
                }
            }

            if (currentState === GHOST_STATES.CHASE) {

                if (distanceFrom(player.visual) < 50) {
                    let chosenFlank = null
                    if (distanceFrom(player.rightFlank) < distanceFrom(player.leftFlank)) {
                        moveTowards(player.rightFlank, CHASE_SPEED)
                        chosenFlank = player.rightFlank
                    } else {
                        moveTowards(player.leftFlank, CHASE_SPEED)
                        chosenFlank = player.leftFlank
                    }

                    if (distanceFrom(chosenFlank) < 5) {
                        // console.log('ATTACK')
                        currentState = GHOST_STATES.ATTACK
                        self.setAnimationSpeed(0.07)
                        return
                    }
                } else {
                    moveTowards(player.visual, CHASE_SPEED)
                }
                facing = updateMovement.x > 0 ? 1 : -1

                if (distanceFrom(chaseStart) > 500) {
                    console.log('returning to patrol')
                    currentState = GHOST_STATES.RETURN_TO_PATROL
                    return
                }
            }

            if (currentState === GHOST_STATES.ATTACK) {
                newAnimation = GHOST_ANIMATION.ATTACK
                facing = player.visual.x > self.visual.x ? 1 : -1
                self.visual.loop = false

                self.visual.onFrameChange = () => {
                    if (currentAnimation === GHOST_ANIMATION.ATTACK &&
                        self.visual.currentFrame === 2) {
                        if (distanceFrom(player.visual) < 50) {
                            const s = window.resources.getSFX('sfx_punch1')
                            s.volume = 0.3
                            s.play()
                            self.emit('deathblow')
                        } else {
                            const s = window.resources.getSFX('sfx_punch3')
                            s.volume = 0.5
                            s.play()
                        }
                    }
                }


                if (self.visual.currentFrame === self.visual.totalFrames-1) {
                    newAnimation = GHOST_ANIMATION.WALK
                    self.visual.loop = true
                    self.setAnimationSpeed(0.1)
                    currentState = GHOST_STATES.CHASE
                }
            }

            if (currentState === GHOST_STATES.RETURN_TO_PATROL) {

                moveTowards(chaseStart, RETURN_TO_PATROL_SPEED)
                facing = updateMovement.x > 0 ? 1 : -1

                const distance = distanceFrom(chaseStart)
                if (distance < 200) {
                    if (playerWithinChaseRange()) return
                }
                if (distance < 10) {
                    console.log('starting patrol now')
                    currentState = GHOST_STATES.PATROL
                    return
                }
            }

            if (newAnimation !== currentAnimation) {
                self.setNewTextures(newAnimation)
                self.visual.gotoAndPlay(0)
                currentAnimation = newAnimation
            }

            self.visual.x += updateMovement.x
            self.visual.y += updateMovement.y
            currentMilage += updateMovement.len()
            self.visual.scale.x = facing > 0 ? -1 : 1
        }
    }

    Object.assign(self, IEmitter({}))

    Object.assign(self, IAnimated('ghost', currentAnimation)
        .setAnchor(0.5, 0.625)
        .setLayer(RENDER_LAYER.CHARACTERS)
        .setPosition(100, 100)
        .setAnimationSpeed(0.15))


    return self
}