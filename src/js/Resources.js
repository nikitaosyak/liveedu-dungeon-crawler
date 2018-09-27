
export const Resources = () => {

    const loader = PIXI.loader
    const res = loader.resources

    const self = {
        get raw() { return res },
        add: (alias, path) => {
            loader.add(alias, path)
            return self
        },
        load: (onComplete, onProgress) => {
            const binding = loader.onProgress.add(onProgress)
            loader.load((loader, resources) => {
                loader.onProgress.detach(binding)
                onComplete(loader, resources)
            })
        },
        hasResource: alias => alias in res,
        getTexture: (spritesheet, alias) => {
            if (spritesheet in res) {
                if (alias in res[spritesheet].textures) return res[spritesheet].textures[alias]
            }
            console.warn('texture', alias, 'was replaced with default texture')
            return PIXI.Texture.WHITE
        },
        getTextures: (spritesheet, animation) => {
            if (spritesheet in res) {
                const result = []
                let currentFrameIndex = 0
                let currentFrame = `${animation}_${currentFrameIndex}.png`
                while (currentFrame in res[spritesheet].textures) {
                    result.push(res[spritesheet].textures[currentFrame])
                    currentFrameIndex += 1
                    currentFrame = `${animation}_${currentFrameIndex}.png`
                }
                if (result.length > 0) {
                    return result
                }
                // if (alias in res[spritesheet].textures) return res[spritesheet].textures[alias]
            }
            console.warn('texture', animation, 'was replaced with default animation')
            return [PIXI.Texture.WHITE]
        },
        getJSON: (alias) => {
            if (alias in res) return res[alias].data
            throw '   Cannot find JSON with alias ' + alias
        },
        getText: (alias) => {
            if (alias in res) return res[alias].data
            throw '   Cannot find TEXT with alias ' + alias
        },
        getAnimation: (alias) => {
            if (alias in res) return res[alias].data.frames
            throw '   Cannot find ANIMATION DESCRIPTOR with alias ' + alias
        },
        getSFX: alias => {
            if (alias in res) return res[alias].sound
            throw '   Cannot find sound with alias ' + alias
        }
    }
    return self
}