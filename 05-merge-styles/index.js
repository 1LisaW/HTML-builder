const fs = require('fs');
const { readdir, access } = require('fs/promises');
const path = require('path');
const { pipeline, finished } = require('stream');

async function bundleCSS(){
  const bundle = path.join(__dirname, 'project-dist', 'bundle.css');
  await access(bundle).then(() => {
    fs.unlink(bundle, (error) => {
      if (error) {
        return console.log(error.message);
      }
    });
  }).catch((err) => {
    console.log(err.message);
  });
  
  const files = [];
  readdir(path.join(__dirname, 'styles'))
    .then((response) => {
      response.forEach(fileName => {
        if(path.extname(fileName) === '.css'){
          files.push(path.join(__dirname, 'styles', fileName));
        }
      });
      if(files.length < 1) return console.log('There no css files for bundle'); 
      
      const  createStream = async (idx, isLast)=>{
        const readableStream = fs.createReadStream(files[idx]);
        const output = fs.createWriteStream(bundle,  {
          flags: 'a'
        });
        
        await pipeline(readableStream, output, (err) => {
          if (err) {
            console.error('Pipeline failed.', err);
          } 
        });

        finished( readableStream, () => {
          if (!isLast) {
            createStream( idx+1, idx+1 >= files.length-1 );
          }
        });
      };
      createStream(0, files.length < 2);
    });
  
}
bundleCSS();
