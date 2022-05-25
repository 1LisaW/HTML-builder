const fs = require('fs/promises');
const path = require('path');

const sourcePath = path.resolve(__dirname, 'files');
const copyPath = path.resolve(__dirname, 'files-copy');

fs.rm(copyPath, {
  recursive: true,
  force: true
}).then(() => {
  fs.mkdir(copyPath, {
    recursive: true,
  }).then(
    fs.readdir(sourcePath).then((res) => {
      res.forEach((el) => fs.copyFile(path.resolve(sourcePath, el), path.resolve(copyPath, el)));
    })
  );
});