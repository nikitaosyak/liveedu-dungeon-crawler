import {Isle} from "./Isle";
import {MathUtil} from "../utils/MathUtil";


export const LevelMap = renderer => {

    const BASE_DISTANCE = 800

    const islePositions = [
        {x: 0, y: 0},
        {x: BASE_DISTANCE, y: 0},
        {x: 0, y: BASE_DISTANCE},
        {x: BASE_DISTANCE, y: BASE_DISTANCE}
    ]
    let tiles = []
    for (let i = 0; i < 4; i++) {
        const isleId = MathUtil.randomRange(1, 1)
        const isle = new Isle(`isle0${isleId}`)
        tiles = tiles.concat(isle.visualTiles)
        isle.visualTiles.forEach(vt => {
            vt.visual.x += islePositions[i].x
            vt.visual.y += islePositions[i].y
            renderer.addObject(vt)
        })
    }

    const allowedAreas = {
        'tile_1': {x: 32, y: 20, w: 32, h: 46},
        'tile_2': {x: 0, y: 20, w: 64, h: 46},
        'tile_3': {x: 0, y: 20, w: 32, h: 46},
        'tile_4': {x: 32, y: 0, w: 32, h: 64},
        'tile_5': {x: 0, y: 0, w: 64, h: 64},
        'tile_6': {x: 0, y: 0, w: 32, h: 64},
        'tile_7': {x: 32, y: 0, w: 32, h: 40},
        'tile_8': {x: 0, y: 0, w: 64, h: 40},
        'tile_9': {x: 0, y: 0, w: 32, h: 40}
    }

    const disallowedAreas = {
        'tile_10': new PIXI.Rectangle(35, 35, 29, 29),
        'tile_11': new PIXI.Rectangle(0, 35, 29, 29),
        'tile_12': new PIXI.Rectangle(32, 0, 32, 20),
        'tile_13': new PIXI.Rectangle(0, 0, 32, 20)
    }

    let colliderRect = new PIXI.Rectangle()
    return {
        collide: player => {
            // console.log(tiles.length)
            // console.log(player.visual.x, player.visual.y)
            tiles.forEach(t => {
                if (t.visual
                    .getBounds(false, colliderRect)
                    .contains(player.visual.x, player.visual.y)) {
                    // console.log(t.visual.name)
                    if (t.visual.name in allowedAreas) {
                        const area = allowedAreas[t.visual.name]
                        const left = colliderRect.left + area.x
                        const right = left + area.w
                        const top = colliderRect.top + area.y
                        const bottom = top + area.h

                        // console.log(left, right, top, bottom, colliderRect)
                        player.visual.x = MathUtil.clamp(left, right, player.visual.x)
                        player.visual.y = MathUtil.clamp(top, bottom, player.visual.y)
                    }

                    if (t.visual.name in disallowedAreas) {
                        const area = disallowedAreas[t.visual.name]

                        const posX = player.visual.x - colliderRect.left
                        const posY = player.visual.y - colliderRect.top

                        if (area.contains(posX, posY)) {
                            const fromLeft = posX - area.left
                            const fromRight = area.right - posX
                            const fromTop = posY - area.top
                            const fromBottom = area.bottom - posY

                            // if (fromLeft === 0 || fromRight === 0 || fromTop === 0 || fromBottom === 0) return
                            // console.log(player.visual.x, player.visual.y)

                            let hGap = 0
                            let vGap = 0
                            if (fromLeft < fromRight) {
                                player.visual.x = colliderRect.left + area.left - 0.1
                            } else {
                                player.visual.x = colliderRect.left + area.left + area.width + 0.1
                            }

                            if (fromTop < fromBottom) {
                                player.visual.y = colliderRect.top + area.top - 0.1
                            } else {
                                player.visual.y = colliderRect.top + area.top + area.height + 0.1
                            }
                            // console.log(fromTop, fromBottom, fromLeft, fromRight)
                            // console.log(player.visual.x, player.visual.y)
                            // if (hGap < vGap) {
                            //     if (hGap < 0) {
                            //
                            //     }
                            //     // player.visual.x += hGap
                            // } else {
                            //     // player.visual.y += vGap
                            // }
                        }
                    }
                }
            })
        }
    }
}