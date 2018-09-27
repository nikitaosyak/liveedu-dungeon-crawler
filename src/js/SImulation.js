import {LevelMap} from "./level/LevelMap";
import {Player} from "./Player";


export const Simulation = renderer => {

    const player = renderer.addObject(Player())
    const map = LevelMap(renderer)

    return {
        update: dt => {

        }
    }
}