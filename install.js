const fs = require("fs-extra");
const path = require("path");

const directories = [
  {
    src: path.join(__dirname, "build"),
    dest: path.join(process.cwd(), "build"),
  },
  { src: path.join(__dirname, "docs"), dest: path.join(process.cwd(), "docs") },
  { src: path.join(__dirname, "gulp"), dest: path.join(process.cwd(), "gulp") },
  { src: path.join(__dirname, "src"), dest: path.join(process.cwd(), "src") },
  {
    src: path.join(__dirname, "gulpfile.js"),
    dest: path.join(process.cwd(), "gulpfile.js"),
  },
  {
    src: path.join(__dirname, "webpack.config.js"),
    dest: path.join(process.cwd(), "webpack.config.js"),
  },
];

async function copyDirectories() {
  try {
    for (const { src, dest } of directories) {
      await fs.copy(src, dest);
      console.log(`Copied ${src} to ${dest}`);
    }
    console.log("All directories have been successfully copied.");
  } catch (err) {
    console.error("Error while copying directories:", err);
  }
}

copyDirectories();
