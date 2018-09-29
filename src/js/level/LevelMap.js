import {Isle} from "./Isle";
import {MathUtil} from "../utils/MathUtil";
import {OBJECT_TYPE} from "../SImulation";

export const LevelMap = renderer => {

    const BASE_DISTANCE = 650

    const islePositions = [
        {x: 0, y: 0},
        {x: BASE_DISTANCE, y: 0},
        {x: 0, y: BASE_DISTANCE},
        {x: BASE_DISTANCE, y: BASE_DISTANCE}
    ]
    let tiles = []
    const teleports = []
    for (let i = 0; i < 4; i++) {
        const isleId = MathUtil.randomRange(1, 1)
        const isle = new Isle(`isle0${isleId}`)
        tiles = tiles.concat(isle.visualTiles)
        isle.visualTiles.forEach(vt => {
            if (vt.type === OBJECT_TYPE.TELEPORT) {
                vt.isle = i
                vt.teleportId = teleports.length
                vt.leadsTo = -1
                teleports.push(vt)
            }
            vt.visual.x += islePositions[i].x
            vt.visual.y += islePositions[i].y
            renderer.addObject(vt)
        })
    }

    while (teleports.length) {
        const current = teleports[0]
        const targetIdx = teleports.length-1//MathUtil.randomRange(1, teleports.length-1)
        const target = teleports[targetIdx]
        if (target.isle === current.isle) continue
        current.leadsTo = target
        target.leadsTo = current
        teleports.splice(targetIdx, 1)
        teleports.splice(0, 1)
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
        'tile_10': new SAT.Box(new SAT.Vector(35, 35), 30, 30).toPolygon(),
        'tile_11': new SAT.Box(new SAT.Vector(-1, 35), 30, 30).toPolygon(),
        'tile_12': new SAT.Box(new SAT.Vector(32, -1), 33, 21).toPolygon(),
        'tile_13': new SAT.Box(new SAT.Vector(-1, -1), 33, 21).toPolygon()
    }

    let colliderRect = new PIXI.Rectangle(0, 0, 64, 64)
    let response = new SAT.Response()
    return {
        collide: player => {
            const triggerResult = []
            tiles.forEach(t => {
                colliderRect.x = t.visual.x
                colliderRect.y = t.visual.y
                if (colliderRect.contains(player.visual.x, player.visual.y)) {
                    if (t.visual.name in allowedAreas) {
                        const area = allowedAreas[t.visual.name]
                        const left = colliderRect.left + area.x
                        const right = left + area.w
                        const top = colliderRect.top + area.y
                        const bottom = top + area.h

                        player.visual.x = MathUtil.clamp(left, right, player.visual.x)
                        player.visual.y = MathUtil.clamp(top, bottom, player.visual.y)
                    }

                    if (t.visual.name in disallowedAreas) {
                        const box = disallowedAreas[t.visual.name]
                        const localPos = new SAT.Vector(
                            player.visual.x - colliderRect.left,
                            player.visual.y - colliderRect.top
                        )
                        const playerCircle = new SAT.Circle(localPos, 1)
                        response.clear()
                        if (SAT.testCirclePolygon(playerCircle, box, response)) {
                            player.visual.x -= response.overlapV.x
                            player.visual.y -= response.overlapV.y
                        }
                    }

                    if (t.type === OBJECT_TYPE.TELEPORT || t.type === OBJECT_TYPE.BUTTON) {
                        const playerLocalPosition = new SAT.Vector(
                            player.visual.x - colliderRect.left,
                            player.visual.y - colliderRect.top
                        )
                        if (t.collided(response, playerLocalPosition) && t.enabled) {
                            t.trigger()
                            triggerResult.push(t.type)

                            if (t.type === OBJECT_TYPE.TELEPORT) {
                                console.log(`teleporting from ${t.isle}:${t.teleportId} -> ${t.leadsTo.isle}:${t.leadsTo.teleportId}; ${t.leadsTo._disabled}`)
                                player.visual.x = t.leadsTo.visual.x + 32
                                player.visual.y = t.leadsTo.visual.y + 32
                            }
                        }
                    }

                }
            })
            return triggerResult
        }
    }
}