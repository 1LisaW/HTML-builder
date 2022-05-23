const {
  mkdir,
  copyFile,
  createReadStream,
  createWriteStream
} = require('fs');
const {
  readdir,
  
  access,
  unlink,
  rm,
  stat
} = require('fs/promises');
const readline = require('readline');
const path = require('path');
const {pipeline, finished} = require('stream');
const util = require('util');

const cssPath = path.join(__dirname,'styles');
const componentsPath = path.join(__dirname,'components');
const assetsPath = path.join(__dirname, 'assets');
const bundlePath = path.join(__dirname, 'project-dist');


const createFolder = async (folderPath) => {
  access(folderPath).catch(()=>{
    mkdir(folderPath, (error)=>{
      if (error) return console.log(error.message);
    });
    console.log('Folder \'project-dist\' was created');
  });
};

const getFiles = (folderPath) => {
  return readdir(folderPath, (error) => {
    if (error) return console.log(error.message);
  });
};
const clearBundle = async (bundlePath) => {
  const clearFolder = async (folderPath) => {
    await getFiles(folderPath).then(async(response) => {
      for (let fileName of response) {
        const filepath = path.join(folderPath, fileName);
        await stat (filepath).then( async st =>{
          if (!st.isFile()) {
            await clearFolder(filepath);
            await rm(filepath, {
              recursive: true
            });
          } else {
            await unlink(filepath);
          }
        }).catch(()=>{return;});
      }
    }).catch(() => {
      return;
    });
  };
  await access(bundlePath).then(() => clearFolder(bundlePath)).catch(() => {
    console.log('catch');
    return;
  });
  return {done:true};
};



const bundleCSS = async (bundlePath,cssPath) => {
  const bundle = path.join(bundlePath,'style.css');

  const files = [];
  readdir(path.join(__dirname, 'styles'))
    .then((response) => {
      response.reverse().forEach(fileName => {
        if (path.extname(fileName) === '.css') {
          files.push(path.join(cssPath, fileName));
        }
      });
      if (files.length < 1) return console.log('There no css files for bundle');
      const createStream = async (idx, isLast) => {
        const readableStream = createReadStream(files[idx]);
        const output = createWriteStream(bundle, {
          flags: 'a'
        });
        

        await pipeline(readableStream, output, (err) => {
          if (err) {
            console.error('Pipeline failed.', err);
          }
        });

        finished(readableStream, () => {
          if (!isLast) {
            createStream(idx + 1, idx + 1 >= files.length - 1);
          }
        });
      };
      createStream(0, files.length < 2);
    });

};

const bundleHTML = async (bundlePath, componentsPath) =>{
  const readableStream = createReadStream(path.join(__dirname,'template.html'));
  const writableStream = createWriteStream(path.join(bundlePath, 'index.html'), {
    flags: 'a'
  });
  const rl = readline.createInterface({
    input: readableStream,
    output: writableStream
  });
  for await (const line of rl){
    const component = line.match(/{{([a-zA-Z]*)}}/);
    if(component!==null){
      console.log(`${component[1]}.html`);
      const readableStreamComponent = createReadStream(path.join(componentsPath, `${component[1]}.html`));
      const writableStreamForComponent = createWriteStream(path.join(bundlePath, 'index.html'), {
        flags: 'a'
      });

      console.log(line);
      await util.promisify(pipeline)(
        readableStreamComponent, 
        writableStreamForComponent
      );
    } else{
      
      writableStream.write(`${line}\n`);
    }
  }
};

const copyAssets = async (assetsPath, bundlePath) => {
  const copyFiles = async (folderFromPath, folderInPath) =>{
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
  await copyFiles(assetsPath, bundlePath);
};

const runHTMLBuilder = async (bundlePath) => {
  await clearBundle(bundlePath);
  await createFolder(bundlePath);
  await bundleCSS(bundlePath,cssPath);
  await copyAssets(assetsPath, path.join(bundlePath,'assets'));
  await bundleHTML(bundlePath,componentsPath);
};

// bundleCSS(cssPath);
runHTMLBuilder(bundlePath);