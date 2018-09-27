import {Isle} from "./Isle";
import {MathUtil} from "../utils/MathUtil";


export const LevelMap = renderer => {

    const BASE_DISTANCE = 800

    const self = {}

    const islePositions = [
        {x: 0, y: 0},
        {x: BASE_DISTANCE, y: 0},
        {x: 0, y: BASE_DISTANCE},
        {x: BASE_DISTANCE, y: BASE_DISTANCE}
    ]
    let tiles = []
    for (let i = 0; i < 4; i++) {
        const isleId = MathUtil.randomRange(1, 3)
        const isle = new Isle(`isle0${isleId}`)
        tiles = tiles.concat(isle.visualTiles)
        isle.visualTiles.forEach(vt => {
            vt.visual.x += islePositions[i].x
            vt.visual.y += islePositions[i].y
            renderer.addObject(vt)
        })
    }

    return self
}