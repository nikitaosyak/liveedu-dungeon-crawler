import {IVisual2} from "../Base";
import {RENDER_LAYER} from "../Renderer";
import {Teleport} from "./Teleport";
import {Button} from "./Button";

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
                self.visualTiles.push(new Button(x*64, y*64))
            } else if (tile === 20) {
                self.visualTiles.push(new Teleport(x*64, y*64))
            } else {
                self.visualTiles.push(IVisual2(`level_tile_${tile}`)
                    .setPosition(x * 64, y * 64)
                    .setLayer(RENDER_LAYER.LEVEL_BACKGROUND))
            }
        })
    })

    return self
}