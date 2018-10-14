const gulp = require("gulp");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const watchify = require("watchify");
const tsify = require("tsify");
const sourcemaps = require("gulp-sourcemaps");
const buffer = require("vinyl-buffer");
const gutil = require("gulp-util");

const paths = {
  pages: ["src/*.html"],
  bundles: ["src/main.ts"]
};

const watchedBrowserify = watchify(
  browserify({
    basedir: ".",
    debug: true,
    entries: paths.bundles,
    cache: {},
    packageCache: {}
  })
  .plugin(tsify)
  .transform("babelify", {
    presets: ["@babel/preset-env"],
    extensions: [".ts"]
  })
);

function bundle() {
  return watchedBrowserify
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("dist"));
}

gulp.task("copy-html", function() {
  return gulp.src(paths.pages)
    .pipe(gulp.dest("dist"));
});

gulp.task("default", ["copy-html"], bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);