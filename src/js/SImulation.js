import {LevelMap} from "./level/LevelMap";
import {Player} from "./characters/Player";
import {Input} from "./Input";
import {Ghost} from "./characters/Ghost";

export const OBJECT_TYPE = {
    TELEPORT: 'TELEPORT',
    BUTTON: 'BUTTON'
}

export const Simulation = renderer => {

    const player = Player()
    renderer.addObject(player)

    renderer.viewport.follow(player.visual, {speed: 50})

    const map = LevelMap(renderer)
    const input = Input()

    const ghost = Ghost()
    renderer.addObject(ghost)

    return {
        update: dt => {
            player.update(dt, input.velocity, input.attack)
            if (input.attack) {
                input.attack = false
            }

            ghost.update(dt, player)
            map.collide(player)
        }
    }
}