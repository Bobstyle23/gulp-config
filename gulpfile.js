const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const serverReload = require("gulp-server-livereload");
const clean = require("gulp-clean");
const fs = require("fs");

// NOTE: include html files into main html
gulp.task("html", () => {
  return gulp
    .src("./src/*.html")
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
    .src("./src/styles/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./dist/css/"));
});

// NOTE: copy images to dist
gulp.task("images", () => {
  return gulp.src("./src/img/**/*").pipe(gulp.dest("./dist/img/"));
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
});

gulp.task(
  "default",
  gulp.series(
    "clean",
    gulp.parallel("html", "sass", "images"),
    gulp.parallel("server", "watch"),
  ),
);
