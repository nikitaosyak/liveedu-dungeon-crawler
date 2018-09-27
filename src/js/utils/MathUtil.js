
export const MathUtil = {
    randomRange: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min
    },
    approximately: (a, b) => {
        return (Math.abs(a) - Math.abs(b)) < 0.0001
    },
    clamp: (min, max, v) => Math.max(min,Math.min(max,v)),
    normalize(p,len) {
        if((MathUtil.approximately(p.x, 0) && MathUtil.approximately(p.y, 0))
            || MathUtil.approximately(len, 0)) {
            p.x = 0; p.y = 0
            return p
        }
        const angle = Math.atan2(p.y,p.x);
        const nx = Math.cos(angle) * len;
        const ny = Math.sin(angle) * len;
        p.x = nx; p.y = ny
        return p
    }
}