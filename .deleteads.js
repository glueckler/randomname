var fs = require("fs");
var path = require("path");

console.log(`hiii, deleting .asd files now...`);

fs.readdir("./", (err, files) => {
  for (const file of files) {
    // continue if hidden file
    if (file[0] === ".") continue;

    // delete  if ableton file
    var extension = path.extname(file);
    if (extension === ".asd") {
      fs.unlinkSync(file);
      console.log(`ableton file: ${file} was deleted..`);
    }
  }
});
