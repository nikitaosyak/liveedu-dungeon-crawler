import {MathUtil} from "./utils/MathUtil";

export const INPUT_ACTION = {
    HORIZONTAL: 'HORIZONTAL',
    VERTICAL: 'VERTICAL',
    ATTACK: 'ATTACK'
}

export const Input = () => {

    const self = {
        velocity: new SAT.Vector(0, 0),
        attack: false
    }

    const pushableWhitelist = [37, 38, 39, 40]
    const keyCodeWhitelist = [32].concat(pushableWhitelist)
    const pressed = []

    window.onkeydown = e => {
        if (keyCodeWhitelist.indexOf(e.keyCode) < 0) return

        if (pushableWhitelist.indexOf(e.keyCode) > -1) {
            if (pressed.indexOf(e.keyCode) < 0) {
                pressed.push(e.keyCode)
            } else {
                return
            }
        }

        if (e.keyCode === 37) {
            self.velocity.x = -1
        }
        if (e.keyCode === 39) {
            self.velocity.x = 1
        }

        if (e.keyCode === 38) {
            self.velocity.y = -1
        }
        if (e.keyCode === 40) {
            self.velocity.y = 1
        }

        if (e.keyCode === 32) {
            self.attack = true
        }
        MathUtil.normalize(self.velocity, 1)
    }

    window.onkeyup = e => {
        if (keyCodeWhitelist.indexOf(e.keyCode) < 0) return

        if (e.keyCode === 37) {
            if (pressed.indexOf(39) > -1) {
                self.velocity.x = 1
            } else {
                self.velocity.x = 0
            }
        }
        if (e.keyCode === 39) {
            if (pressed.indexOf(37) > -1) {
                self.velocity.x = -1
            } else {
                self.velocity.x = 0
            }
        }

        if (e.keyCode === 38) {
            if (pressed.indexOf(40) > -1) {
                self.velocity.y = 1
            } else {
                self.velocity.y = 0
            }
        }
        if (e.keyCode === 40) {
            if (pressed.indexOf(38) > -1) {
                self.velocity.y = -1
            } else {
                self.velocity.y = 0
            }
        }
        pressed.splice(pressed.indexOf(e.keyCode), 1)
        if (!MathUtil.approximately(self.velocity.len2(), 0)) {
            self.velocity.normalize()
        }
    }

    return self
}