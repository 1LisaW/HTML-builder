const {copyFile, unlink } = require('fs');
const { mkdir, readdir } = require('fs/promises');
const path = require('path');

readdir(path.join(__dirname,'files-copy')).then( (response) =>{
  response.forEach( file =>{
    unlink(path.join(__dirname, 'files-copy', file), err => {
      if (err) console.log(err.message);
    });
  });
}).catch(()=> {return;});


readdir(path.join(__dirname, 'files'))
  .then((response) => {
    mkdir(path.join(__dirname,'files-copy'),{recursive:true});
    response.forEach(
      (item) => {
        copyFile(path.join(__dirname, 'files', item), path.join(__dirname, 'files-copy', item), (err) => {
          if (err) return console.log(err);
        });
      }
    );
  });