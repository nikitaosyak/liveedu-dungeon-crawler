import {Resources} from "./Resources";
import {DivVanisher} from "./utils/DivVanisher";
import {RENDER_LAYER, Renderer} from "./Renderer";
import {IAnimated, IVisual} from "./Base";
import {Isle} from "./level/Isle";
import {LevelMap} from "./level/LevelMap";
import {Player} from "./Player";
import {Simulation} from "./SImulation";

window.onload = () => {

    PIXI.settings.MIPMAP_TEXTURES = false

    const resoures = window.resources = Resources()

    const startGame = () => {

        // console.log()

        const vanisher = DivVanisher()

        const renderer = Renderer()
        const simulation = Simulation(renderer)

        let time = Date.now()
        const gameLoop = () => {

            const now = Date.now()
            let dt = (now - time) / 1000
            time = now

            vanisher.running && vanisher.update(dt)

            renderer.update(dt)
            simulation.update(dt)

            requestAnimationFrame(gameLoop)
        }
        gameLoop()
    }

    resoures.add('digest', 'assets/digest.json')
        .load(() => {
            const digest = resoures.getJSON('digest')
            digest.graphics.forEach(g => resoures.add(g.alias, g.path))
            digest.sfx.forEach(s => resoures.add(s.alias, s.path))
            digest.level.forEach(l => resoures.add(l.alias, l.path))

            const domProgress = document.getElementById('progress')
            resoures.load(() => {
                //
                WebFont.load({
                    google: {
                        families: ['Roboto Mono']
                    },
                    loading: () => console.log('Font is now started loading'),
                    inactive: () => {
                        console.log('%cFont loading was a failure', 'color:#CC2222')
                        startGame()
                    },
                    active: () => {
                        console.log('Font loading was a success')
                        domProgress.value = 100
                        startGame()
                    }
                })
            },
            (loader, resource) => {
                domProgress.value = Math.floor(loader.progress * 0.95)
            })
        }, () => {})
}