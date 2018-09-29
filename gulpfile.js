const env = require('dotenv').config().parsed

const gulp = require('gulp')
const connect = require('gulp-connect')
const fs = require('fs')

//
// regular tasks:
gulp.task('prepare-build', () => {
    const rimraf = require('rimraf')

    if (fs.existsSync('build/')) rimraf.sync('build')

    fs.mkdirSync('build')
})

gulp.task('webpack', ['prepare-build'], () => {
    const stream = require('webpack-stream')
    const webpack2 = require('webpack')

    const config = {
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    query: {presets: ['env']}
                }
            ]
        },
        output: {filename: 'bundle.js'},
        devtool: 'source-map',
        mode: 'development'
    }

    return gulp.src('src/js/**/*')
        .pipe(stream(config, webpack2))
        .pipe(gulp.dest('build/'))
})

gulp.task('finish-deploy', ['webpack'], () => {
    fs.copyFileSync('src/index.html', 'build/index.html')
    fs.copyFileSync('src/libraries.js', 'build/libraries.js')

    return gulp.src(['assets/**/*']).pipe(gulp.dest('build/assets'))
})


//
// irregular tasks:
gulp.task('prepare-greensock-library', () => {
    return gulp.src([
        'src/lib/tween/TweenLite.js',
        'src/lib/tween/plugins/EasePack.js',
        'src/lib/tween/plugins/PixiPlugin.js',
        'src/lib/tween/plugins/RoundPropsPlugin.js',
    ])
        .pipe(require('gulp-concat')('TweenLite.js'))
        .pipe(gulp.dest('src/lib'))
})

gulp.task('prepare-pixi-library', () => {
    return gulp.src([
        'src/lib/pixi/pixi.lib.min.js',
        'src/lib/pixi/pixi-particles.lib.min.js',
        'src/lib/pixi/pixi-sound.js',
        'src/lib/pixi/pixi-viewport.js'
    ])
        .pipe(require('gulp-concat')('Pixi.js'))
        .pipe(gulp.dest('src/lib'))
})

gulp.task('prepare-libraries', ['prepare-greensock-library', 'prepare-pixi-library'],  () => {
    return gulp.src('src/lib/*.js')
        .pipe(require('gulp-concat')('libraries.js'))
        .pipe(gulp.dest('src/'))
})

gulp.task('process-assets', () => {
    process.chdir('./assets')
    const graphicsDigest = []
    const sfxDigest = []
    const levelDigest = []

    const iterateFolder = path => {
        fs.readdirSync(path).forEach(fsEntry => {
            if (fs.lstatSync(`${path}/${fsEntry}`).isDirectory()) {
                iterateFolder(`${path}/${fsEntry}`)
            } else {
                const relativePath = `${path}/${fsEntry}`.replace(process.cwd(), '').slice(1)
                // console.log(relativePath)
                if (relativePath.indexOf('spritesheet') > -1) return
                if (relativePath.indexOf('sfx') > -1) {
                    sfxDigest.push({
                        alias: relativePath.replace(/\//g, '_').replace(/\.mp3$/, ''),
                        path: `assets/${relativePath}`
                    })
                } else
                if (relativePath.indexOf('graphics') > -1) {
                    graphicsDigest.push({
                        alias: relativePath
                            .replace(/\//g, '_')
                            .replace(/\.png$|_descriptor\.json$/, '')
                            .replace(/graphics_/, ''),
                        path: `assets/${relativePath}`
                    })
                } else
                if (relativePath.indexOf('level') > -1) {
                    levelDigest.push({
                        alias: relativePath.replace(/\//g, '_').replace(/level_/, ''),
                        path: `assets/${relativePath}`
                    })
                }
            }
        })
    }
    iterateFolder(process.cwd())
    process.chdir('..')

    fs.writeFileSync('assets/digest.json', JSON.stringify(
        { graphics: graphicsDigest, sfx: sfxDigest, level: levelDigest }, null, 2))
})

//
// hot reload boilerplate
gulp.task('connect', () => {
    return connect.server({
        host: env.HOST,
        root: 'build/',
        port: env.PORT,
        livereload: true
    })
})
gulp.task('reload', ['finish-deploy'], () => gulp.src('src/**/*').pipe(connect.reload()))
gulp.task('watch', () => gulp.watch(['src/index.html', 'src/js/**/*', 'assets/**/*'], ['reload']))
gulp.task('default', ['connect', 'finish-deploy', 'watch'])