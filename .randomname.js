var fs = require("fs");
var path = require("path");

console.log(`goooood morning, let's randomize some filenames.. ><>\``);

// function to generate random string
var chars = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p"
];
var random = () => chars[Math.trunc(Math.random() * 16)];

// first argv input
var argIndex = 2;

// gather all flags passed ie '--128'
var flags = [];
var force = false;
var make128 = false;
var getFlags = () => {
  var argument = process.argv[argIndex];
  if (argument.startsWith("--")) {
    flags.push(argument);
    argIndex++;
    getFlags();
  }
};
getFlags();

// prefix will be the last argument passed in
var prefix = process.argv[argIndex] || "";

// start checking flags
if (flags.includes("--128")) {
  console.log(`making 128`);
  make128 = true;
}
if (flags.includes("--force")) {
  console.log(`force rename of all files..`);
  force = true;
}
if (flags.includes("--help")) {
  console.log(`helpp..`);
  console.log(`--128 will create a folder with 128 files choosen at random`);
  console.log(
    `--force will rename all files (even those with .lock in their name`
  );
  return;
}

var count = 0;
var deleted = 0;
fs.readdir("./", (err, files) => {
  if (err) throw err;
  for (const file of files) {
    // continue if hidden file
    if (file[0] === ".") continue;

    //continue if dir
    if (fs.lstatSync(file).isDirectory()) continue;

    // delete  if ableton file
    var extension = path.extname(file);
    if (extension === ".asd") {
      fs.unlinkSync(file);
      console.log(`ableton file: ${file} was deleted..`);
      deleted++;
      continue;
    }

    // skip files with .lock (ie file already processed before)
    if (file.includes(".lock") && !force) continue;

    // generate random string
    var rdmStr = ["r", "a", "n", "d", "o", "m"].map(() => random()).join("");
    fs.renameSync(file, `${prefix}${rdmStr}.lock${extension}`);
    count++;
  }
  console.log(`${count} files processed and renamed`);
  console.log(`${deleted} files deleted`);

  // now make 128 dir if necessary..
  if (make128) {
    // ---------------
    // function to rm -rf
    var deleteDir = function(path) {
      if (path === "/") {
        console.log("lets not delete our computer..");
        return;
      }
      if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index) {
          var curPath = path + "/" + file;
          if (fs.lstatSync(curPath).isDirectory()) {
            // recurse
            deleteFolderRecursive(curPath); // this isn't right..
          } else {
            // delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(path);
      }
    };

    // -------------

    console.log(`\nmaking random 128..`);
    deleteDir("./magic128");
    fs.mkdirSync("./magic128");

    var filesInDir = fs.readdirSync("./");
    var dir128 = [];
    // recursive function to return a file name and also remove it and never see it again
    const findFileNotDir = () => {
      if (filesInDir.length === 0) return;
      var randomIndex = Math.trunc(Math.random() * filesInDir.length);
      var file = filesInDir[randomIndex];
      filesInDir.splice(randomIndex, 1);
      if (fs.lstatSync(file).isDirectory() || file[0] === ".")
        return findFileNotDir();
      else return file;
    };

    // create an Array with 128 slots, turn them into files,
    Array(128)
      .join(" ")
      .split(" ")
      .map(findFileNotDir)
      // should refactor..
      // .map(findFileNotDir)
      .filter(file => !!file)
      .forEach(file => {
        fs.copyFile(file, `./magic128/${file}`, err => {
          if (err) throw err;
          console.log(`${file} was coppied to ./magic128/${file}`);
        });
      });
    console.log(`\ndone making 128..`);
  }
  console.log(`it worked!`)
});
