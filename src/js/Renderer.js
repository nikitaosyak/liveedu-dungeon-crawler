
export const RENDER_LAYER = {
    LEVEL_BACKGROUND: 'LEVEL_BACKGROUND',
    LEVEL_PROPS: 'LEVEL_PROPS',
    CHARACTERS: 'CHARACTERS',
    HUD: 'HUD'
}

export const Renderer = () => {
    let dMenuVisible = false

    const vSize = {x: 800, y: 1280}
    const maximumWideAR = 1
    const adjustedVSize = {x: 0, y: 0}
    let canvasW = 0, canvasH = 0

    const supposedAspectRatio = vSize.x / vSize.y
    let currentAspectRatio = supposedAspectRatio

    const stage = new PIXI.Container()
    const layers = {}
    Object.keys(RENDER_LAYER).forEach(layer => {
        layers[layer] = new PIXI.Container()
        stage.addChild(layers[layer])
    })

    const canvas = document.getElementById('gameCanvas')
    const renderer = PIXI.autoDetectRenderer({
        roundPixels: false,
        width: vSize.x,
        height: vSize.y,
        view: canvas,
        backgroundColor: 0x0,
        antialias: false,
        resolution: window.devicePixelRatio,
        forceFXAA: false,
        autoResize: true
    })

    const resizableObjects = []
    const resizeCanvas = () => {
        canvasW = Math.max(window.innerWidth || 0, document.documentElement.clientWidth)
        canvasH = Math.max(window.innerHeight || 0, document.documentElement.clientHeight)

        currentAspectRatio = canvasW / canvasH
        renderer.resize(canvasW, canvasH)
        if (currentAspectRatio > supposedAspectRatio) {
            //
            // wide screen
            const actualWidth = Math.ceil(vSize.y * currentAspectRatio)
            stage.scale.x = stage.scale.y = canvasH / vSize.y
            adjustedVSize.x = Math.min(vSize.y * maximumWideAR, actualWidth)
            adjustedVSize.y = vSize.y

            if (canvasW > canvasH * maximumWideAR) {
                stage.x = Math.round((canvasW - (canvasH * maximumWideAR))/2)
            } else {
                stage.x = 0
            }
        } else {
            //
            // tall screen
            const actualHeight = Math.ceil(vSize.x * currentAspectRatio)
            stage.scale.x = stage.scale.y = canvasW / vSize.x
            adjustedVSize.x = vSize.x
            adjustedVSize.y = Math.min(vSize.x * maximumWideAR, actualHeight)

            if (canvasH > canvasW * maximumWideAR) {
                stage.y = Math.round((canvasH - (canvasW * maximumWideAR))/2)
            } else {
                stage.y = 0
            }
        }
        // console.log(`real ar: ${currentAspectRatio}, supposed ar: ${supposedAspectRatio}, ${800/adjustedVSize.x}`)
        resizableObjects.forEach(o => o.adopt(Math.min(currentAspectRatio, maximumWideAR), supposedAspectRatio, adjustedVSize, vSize, maximumWideAR))
        // console.log(canvasW, canvasH, stage.scale, window.innerWidth, document.documentElement.clientWidth)

    }
    resizeCanvas()

    // debug.on('visibility', _ => resizeCanvas())

    const self =  {
        get canvasW() { return canvasW },
        get canvasH() { return canvasH },
        get ar() { return currentAspectRatio },
        get var() { return supposedAspectRatio },
        get maximumWideAR() { return maximumWideAR },
        get dom() { return canvas },
        get size() { return adjustedVSize },
        get vSize() { return vSize },
        get stage() { return stage },
        get layers() { return layers },
        addObject: (go) => {
            if (typeof go.visual === 'undefined') return console.error(`object ${go} cannot be added for render`)
            if (typeof go.adopt !== 'undefined') {
                resizableObjects.push(go)
                go.adopt(Math.min(currentAspectRatio, maximumWideAR), supposedAspectRatio, adjustedVSize, vSize, maximumWideAR)
            }
            const parent = layers[go.layer]
            if (parent) {
                parent.addChild(go.visual)
            } else {
                stage.addChild(go.visual)
            }
        },
        removeObject: go => {
            if (typeof go.visual === 'undefined') return console.error(`object ${go} cannot be removed for render`)
            if (typeof go.adopt !== 'undefined') {
                resizableObjects.splice(resizableObjects.indexOf(go), 1)
            }
            const parent = layers[go.layer]
            if (parent) {
                parent.removeChild(go.visual)
            } else {
                stage.removeChild(go.visual)
            }
        },
        update: dt => {
            const newCanvasW = Math.max(window.innerWidth || 0, document.documentElement.clientWidth)
            const newCanvasH = Math.max(window.innerHeight || 0, document.documentElement.clientHeight)
            if (newCanvasW !== canvasW || newCanvasH !== canvasH) {
                resizeCanvas()
            }
            renderer.render(stage)
        }
    }

    return self
}