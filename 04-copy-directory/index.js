const {copyFile } = require('fs');
const {
  mkdir,
  readdir,
  stat,
  rm,
  unlink,
  access
} = require('fs/promises');
const path = require('path');

const getFiles = (folderPath) => {
  return readdir(folderPath, (error) => {
    if (error) return console.log(error.message);
  });
};

const getClearFolder = async (folderPath) => {
  const clearFolder = async (folderPath) => {
    await getFiles(folderPath).then(async (response) => {
      for (let fileName of response) {
        console.log(fileName);

        const filepath = path.join(folderPath, fileName);
        await stat(filepath).then(async st => {
          if (st.isDirectory()) {
            await clearFolder(filepath);
            await rm(filepath, {
              recursive: true
            });
          } else {
            await unlink(filepath);
          }
        }).catch(() => {
          return;
        });
      }
    }).catch(() => {
      return;
    });
  };
  await access(folderPath).then(() => clearFolder(folderPath)).catch(() => {
    console.log('catch');
    return;
  });
};

const copyFiles = async (folderFromPath, folderInPath) => {
  await readdir(folderFromPath)
    .then(async (response) => {
      await mkdir(folderInPath, {
        recursive: true
      }, (err) => {
        if (err) return console.log(err.message);
      });
      for (let item of response) {
        await stat(path.join(folderFromPath, item)).then(
          async (st) => {
            if (st.isDirectory()) {
              await copyFiles(path.join(folderFromPath, item), path.join(folderInPath, item));
            } else {
              await copyFile(path.join(folderFromPath, item), path.join(folderInPath, item), (err) => {
                if (err) return console.log(err.message);
              });
            }
          });
      }
    }).catch(() => {
      return;
    });
};

(async ()=>{
  await getClearFolder(path.join(__dirname, 'files-copy'));
  await copyFiles(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
})();