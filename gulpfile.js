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
gulp.task("html", () => {
  return gulp
    .src(["./src/html/**/*.html", "!./src/components/*.html"])
    .pipe(plumber(notificationConfig("HTML")))
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      }),
    )
    .pipe(gulp.dest("./dist/"));
});

// NOTE: compile SASS
gulp.task("sass", () => {
  return gulp
    .src("./src/styles/**/*.scss")
    .pipe(plumber(notificationConfig("SASS")))
    .pipe(sourceMaps.init())
    .pipe(sassGlob())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest("./dist/css/"));
});

// NOTE: copy images to dist
gulp.task("images", () => {
  return gulp
    .src("./src/img/**/*", { encoding: false })
    .pipe(imageMin({ verbose: true }))
    .pipe(gulp.dest("./dist/img/"));
});

// NOTE: copy fonts to dist
gulp.task("fonts", () => {
  return gulp.src("./src/fonts/**/*").pipe(gulp.dest("./dist/fonts/"));
});

// NOTE: copy files to dist
gulp.task("files", () => {
  return gulp.src("./src/files/**/*").pipe(gulp.dest("./dist/files/"));
});

// NOTE: js files
gulp.task("js", () => {
  return gulp
    .src("./src/js/*.js")
    .pipe(plumber(notificationConfig("JavaScript")))
    .pipe(babel())
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(gulp.dest("./dist/js"));
});

// NOTE: starts server
gulp.task("server", () => {
  return gulp.src("./dist/").pipe(
    serverReload({
      livereload: true,
      open: true,
    }),
  );
});

// NOTE: clean dist folder
gulp.task("clean", (callback) => {
  if (fs.existsSync("./dist/")) {
    return gulp.src("./dist/", { read: false }).pipe(clean({ force: true }));
  }
  callback();
});

// NOTE: watch files
gulp.task("watch", () => {
  gulp.watch("./src/styles/**/*.scss", gulp.parallel("sass"));
  gulp.watch("./src/**/*.html", gulp.parallel("html"));
  gulp.watch("./src/img/**/*", gulp.parallel("images"));
  gulp.watch("./src/fonts/**/*", gulp.parallel("fonts"));
  gulp.watch("./src/files/**/*", gulp.parallel("files"));
  gulp.watch("./src/js/**/*.js", gulp.parallel("js"));
});

// NOTE: default gulp task to watch every change
gulp.task(
  "default",
  gulp.series(
    "clean",
    gulp.parallel("html", "sass", "images", "fonts", "files", "js"),
    gulp.parallel("server", "watch"),
  ),
);
