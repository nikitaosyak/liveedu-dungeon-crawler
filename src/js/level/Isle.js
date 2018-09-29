import {IVisual} from "../Base";
import {RENDER_LAYER} from "../Renderer";

export const Isle = isleId => {

    const self = {
        visualTiles: []
    }

    const descriptor = window.resources.getText(isleId)
    const tileRows = descriptor.split('\n')
    tileRows.forEach((row, y) => {
        const tiles = row.split(',')
        tiles.forEach((tile, x) => {
            tile = parseInt(tile)
            if (tile === 0) return
            if (tile === 30) {
                const baseTile = IVisual('level', `tile_5`)
                    .setPosition(x * 64, y * 64)
                    .setLayer(RENDER_LAYER.LEVEL_BACKGROUND).setName('tile_30')
                baseTile.visual.addChild(IVisual('level', 'floor_button').visual)
                self.visualTiles.push(baseTile)
            } else if (tile === 20) {

            } else {
                self.visualTiles.push(IVisual('level', `tile_${tile}`)
                    .setPosition(x * 64, y * 64)
                    .setLayer(RENDER_LAYER.LEVEL_BACKGROUND))
            }
        })
    })

    return self
}