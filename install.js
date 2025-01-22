// const fs = require("fs-extra");
// const path = require("path");
//
// const directories = [
//   {
//     src: path.join(__dirname, "build"),
//     dest: path.join(process.cwd(), "build"),
//   },
//   { src: path.join(__dirname, "docs"), dest: path.join(process.cwd(), "docs") },
//   { src: path.join(__dirname, "gulp"), dest: path.join(process.cwd(), "gulp") },
//   { src: path.join(__dirname, "src"), dest: path.join(process.cwd(), "src") },
//   {
//     src: path.join(__dirname, "gulpfile.js"),
//     dest: path.join(process.cwd(), "gulpfile.js"),
//   },
//   {
//     src: path.join(__dirname, "webpack.config.js"),
//     dest: path.join(process.cwd(), "webpack.config.js"),
//   },
// ];
//
// async function copyDirectories() {
//   try {
//     for (const { src, dest } of directories) {
//       await fs.copy(src, dest);
//       console.log(`Copied ${src} to ${dest}`);
//     }
//     console.log("All directories have been successfully copied.");
//   } catch (err) {
//     console.error("Error while copying directories:", err);
//   }
// }
//
// copyDirectories();

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
      // Check if the destination exists
      if (fs.existsSync(dest)) {
        if (fs.lstatSync(dest).isDirectory()) {
          console.log(`Directory ${dest} already exists. Skipping.`);
          continue;
        }

        // Compare file content
        const srcContent = await fs.readFile(src, "utf-8");
        const destContent = await fs.readFile(dest, "utf-8");

        if (srcContent !== destContent) {
          // Backup the existing file
          const backupDest = `${dest}.backup`;
          await fs.copy(dest, backupDest);
          console.log(`Backup created: ${backupDest}`);
        } else {
          console.log(`File ${dest} is already up-to-date. Skipping.`);
          continue;
        }
      }

      // Copy the source file or directory to the destination
      await fs.copy(src, dest);
      console.log(`Copied ${src} to ${dest}`);
    }
    console.log("All directories have been successfully copied.");
  } catch (err) {
    console.error("Error while copying directories:", err);
  }
}

copyDirectories();
