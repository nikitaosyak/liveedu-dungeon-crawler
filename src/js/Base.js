
export const IVisual = (spritesheet, frame) => {

    let layer = null
    const s = new PIXI.Sprite(window.resources.getTexture(spritesheet, `${frame}.png`))

    const self = {
        setSize: (x, y) => { s.width = x; s.height = y; return self },
        setAnchor: (x, y) => { s.anchor.x = x; s.anchor.y = y; return self },
        setPosition: (x, y) => { s.x = x; s.y = y; return self },
        setLayer: v => { layer = v; return self },
        setScale: (x, y) => { s.scale.x = x; s.scale.y = y; return self },
        setTint: v => { s.tint = v; return self },
        setAlpha: v => { s.alpha = v; return self },
        // setTexture: v => { s.texture = window.resources.getTexture(v); return self; },
        get layer() { return layer },
        get visual() { return s }
    }
    return self
}

export const IAnimated = (spritesheet, animation) => {

    let layer = null
    const s = new PIXI.extras.AnimatedSprite(window.resources.getTextures(spritesheet, animation))
    s.loop = true
    s.animationSpeed = 0.1
    s.play()

    const self = {
        setSize: (x, y) => { s.width = x; s.height = y; return self },
        setAnchor: (x, y) => { s.anchor.x = x; s.anchor.y = y; return self },
        setPosition: (x, y) => { s.x = x; s.y = y; return self },
        setLayer: v => { layer = v; return self },
        setAnimationSpeed: v => { s.animationSpeed = v; return self },
        get layer() { return layer },
        get visual() { return s }
    }
    return self
}