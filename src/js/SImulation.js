import {LevelMap} from "./level/LevelMap";
import {Player} from "./characters/Player";
import {Input} from "./Input";
import {Ghost} from "./characters/Ghost";

export const OBJECT_TYPE = {
    TELEPORT: 'TELEPORT',
    BUTTON: 'BUTTON'
}

export const Simulation = renderer => {

    let death = false

    const player = Player()
    renderer.addObject(player)

    renderer.viewport.follow(player.visual, {speed: 50})

    const map = LevelMap(renderer)
    const input = Input(renderer.stage)

    const ghosts = []
    let ghost = Ghost()
    ghost.on('deathblow', () => death = true)
    ghost.visual.x = 300
    ghost.visual.y = 300
    renderer.addObject(ghost)
    ghosts.push(ghost)

    ghost = Ghost()
    ghost.on('deathblow', () => death = true)
    ghost.visual.x = 900
    ghost.visual.y = 300
    renderer.addObject(ghost)
    ghosts.push(ghost)

    ghost = Ghost()
    ghost.on('deathblow', () => death = true)
    ghost.visual.x = 300
    ghost.visual.y = 900
    renderer.addObject(ghost)
    ghosts.push(ghost)

    ghost = Ghost()
    ghost.on('deathblow', () => death = true)
    ghost.visual.x = 900
    ghost.visual.y = 900
    renderer.addObject(ghost)
    ghosts.push(ghost)


    return {
        update: dt => {
            player.update(dt, input.velocity, input.attack, death)
            if (input.attack) {
                input.attack = false
            }
            map.collide(player)

            ghosts.forEach(g => {
                g.update(dt, player)
            })

        }
    }
}