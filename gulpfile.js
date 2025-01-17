const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const serverReload = require("gulp-server-livereload");

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

gulp.task("sass", () => {
  return gulp
    .src("./src/styles/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./dist/css/"));
});

gulp.task("images", () => {
  return gulp.src("./src/img/**/*").pipe(gulp.dest("./dist/img/"));
});

gulp.task("server", () => {
  return gulp.src("./dist/").pipe(
    serverReload({
      livereload: true,
      open: true,
    }),
  );
});
