
export const ITypedObject = type => {
    return {
        get type() { return type }
    }
}

export const ITrigger = (box, enabledBehaviour, actOnSelfBehaviour) => {
    return {
        get box() { return box },
        get enabled() { return enabledBehaviour() },
        trigger() { actOnSelfBehaviour() },
        collided(response, playerPos) {
            const playerCircle = new SAT.Circle(playerPos, 1)
            response.clear()

            return SAT.testCirclePolygon(playerCircle, box, response)
        }
    }
}

export const IContainer = () => {
    let layer = null
    const c = new PIXI.Container()

    const self = {
        setPivot: (x, y) => { c.pivot.x = x; c.pivot.y = y; return self },
        setLayer: v => { layer = v; return self },
        setPosition: (x, y) => { c.x = x; c.y = y; return self },
        add: (obj) => {
            c.addChild(obj.visual)
            return self
        },
        get layer() { return layer },
        get visual() { return c }
    }

    return self
}

export const IVisual = (spritesheet, frame) => {

    let layer = null
    const s = new PIXI.Sprite(window.resources.getTexture(spritesheet, `${frame}.png`))
    s.name = frame
    const self = {
        setName: v => {s.name = v; return self},
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

export const IEmitter = (dict) => {
    return {
        on: (e, callback) => {
            if (e in dict) {
                dict[e].push(callback)
            } else {
                dict[e] = [callback]
            }
        },
        clear: (e) => {
            if (e in dict) {
                delete dict[e]
            }
        },
        emit: (e, ...args) => {
            if (e in dict) {
                dict[e].forEach(cb => cb.apply(null, args))
            }
        }
    }
}