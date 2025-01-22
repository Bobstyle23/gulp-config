const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const serverReload = require("gulp-server-livereload");
const clean = require("gulp-clean");
const fs = require("fs");
const sourceMaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const webpack = require("webpack-stream");
const babel = require("gulp-babel");
const imageMin = require("gulp-imagemin");
const sassGlob = require("gulp-sass-glob");
const groupMedia = require("gulp-group-css-media-queries");
const changed = require("gulp-changed");
const csso = require("gulp-csso");
const htmlclean = require("gulp-htmlclean");
const webp = require("gulp-webp");
const autoprefixer = require("gulp-autoprefixer");
const webpHTML = require("gulp-webp-html");
const webpCSS = require("gulp-webp-css");

const notificationConfig = (title) => {
  return {
    errorHandler: notify.onError({
      title: `${title}`,
      message: `error <%= error.message %>`,
      sound: false,
    }),
  };
};

// NOTE: include html files into main html
gulp.task("html:docs", () => {
  return gulp
    .src(["./src/html/**/*.html", "!./src/components/*.html"])
    .pipe(changed("./docs/html/"))
    .pipe(plumber(notificationConfig("HTML")))
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      }),
    )
    .pipe(htmlclean())
    .pipe(
      gulp.dest((file) => {
        if (file.basename === "index.html") {
          return "./docs/";
        }
        return "./docs/html/";
      }),
    );
});

// NOTE: compile SASS
gulp.task("sass:docs", () => {
  return gulp
    .src("./src/styles/**/*.scss")
    .pipe(changed("./docs/css/"))
    .pipe(plumber(notificationConfig("SASS")))
    .pipe(sourceMaps.init())
    .pipe(autoprefixer())
    .pipe(sassGlob())
    .pipe(webpCSS())
    .pipe(groupMedia())
    .pipe(sass().on("error", sass.logError))
    .pipe(csso())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest("./docs/css/"));
});

// NOTE: copy images to docs
gulp.task("images:docs", () => {
  return gulp
    .src("./src/img/**/*", { encoding: false })
    .pipe(changed("./docs/img/"))
    .pipe(imageMin({ verbose: true }))
    .pipe(gulp.dest("./docs/img/"));
});

// NOTE: copy fonts to docs
gulp.task("fonts:docs", () => {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed("./docs/fonts/"))
    .pipe(gulp.dest("./docs/fonts/"));
});

// NOTE: copy files to docs
gulp.task("files:docs", () => {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed("./docs/files/"))
    .pipe(gulp.dest("./docs/files/"));
});

// NOTE: js files
gulp.task("js:docs", () => {
  return gulp
    .src("./src/js/*.js")
    .pipe(changed("./docs/js"))
    .pipe(plumber(notificationConfig("JavaScript")))
    .pipe(babel())
    .pipe(webpack(require("./../webpack.config.js")))
    .pipe(gulp.dest("./docs/js"));
});

// NOTE: starts server
gulp.task("server:docs", () => {
  return gulp.src("./docs/").pipe(
    serverReload({
      livereload: true,
      open: true,
    }),
  );
});

// NOTE: clean docs folder
gulp.task("clean:docs", (callback) => {
  if (fs.existsSync("./docs/")) {
    return gulp.src("./docs/", { read: false }).pipe(clean({ force: true }));
  }
  callback();
});
