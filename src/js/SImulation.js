import {LevelMap} from "./level/LevelMap";
import {Player} from "./Player";
import {Input} from "./Input";

export const OBJECT_TYPE = {
    TELEPORT: 'TELEPORT',
    BUTTON: 'BUTTON'
}

export const Simulation = renderer => {

    const player = Player()
    renderer.addObject(player)
    const map = LevelMap(renderer)
    const input = Input()

    return {
        update: dt => {
            player.visual.x += input.velocity.x * player.MOVE_SPEED * dt
            player.visual.y += input.velocity.y * player.MOVE_SPEED * dt

            map.collide(player)
        }
    }
}