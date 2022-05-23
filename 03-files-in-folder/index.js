const { stat } = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');
const secretFolderPath = path.join(__dirname, 'secret-folder');

const getFilesInfo = (folderPath)=>{
  readdir(folderPath, {
    withFileTypes: true
  }).then(response => {
    response.forEach((stats) => {
      const filepath = path.join(folderPath, stats.name);
      const outputData = stats.name.split('.');
      stat(filepath, (error, st) => {
        if (error) return console.log(error.message);
        if (st.isFile()) {
          outputData.push(`${st.size/1000}kb`);
          console.log(outputData.join(' - '));
        }
        // else{
        //   return getFilesInfo(path.join(folderPath, stats.name));
        // }
      });
    });
  });
};

getFilesInfo(secretFolderPath);