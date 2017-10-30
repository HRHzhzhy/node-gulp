import gulp from 'gulp'
import eslint from 'gulp-eslint'
import FileCache from 'gulp-file-cache'
import babel from 'gulp-babel'
import nodemon from 'gulp-nodemon'
import gutil from 'gulp-util'

const cache = new FileCache()
const SRC = ['src/**']
const DIST = 'dist'

const notify = (event) => {
  gutil.log('File:', gutil.colors.green(event.path), 'was', gutil.colors.magenta(event.type))
}

gulp.task('lint', () => {
  return gulp.src(SRC)
    .pipe(cache.filter())
    .pipe(eslint())
    .pipe(eslint.result(result => {
      gutil.colors.green(`ESLint result: ${result.filePath}`)
      gutil.colors.magenta(`# Messages: ${result.messages.length}`)
      gutil.colors.magenta(`# Warnings: ${result.warningCount}`)
      gutil.colors.magenta(`# Errors: ${result.errorCount}`)
    }))
    .pipe(eslint.format())
    .pipe(cache.cache())
})
gulp.task('compile', () => {
  return gulp.src(SRC)
    .pipe(cache.filter())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(cache.cache())
    .pipe(gulp.dest(DIST))
})

gulp.task('watch', () => {
  let watcher = {
    compile: gulp.watch(SRC, ['compile', 'lint'])
  }
  for (let key in watcher) {
    watcher[key].on('change', notify)
  }
})

gulp.task('start', () => {
  return nodemon({
    script: DIST + '/app.js',
    watch: DIST
  })
})

gulp.task('default', ['watch', 'start'], () => {
  gutil.log('Gulp is running')
})
