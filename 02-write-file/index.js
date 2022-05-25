const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const writefilePath = path.join(__dirname, 'text.txt');
stdout.write('Please, type some text\n');
fs.writeFile(writefilePath, '', (err) => {
  if (err) {
    return console.log(err.message);
  }
});

stdin.on('data', (data)=>{
  if (data.toString().trim() === 'exit') process.exit();
});

stdin.on('data', (data) =>{
  fs.appendFile(writefilePath, 
    data,
    (err) => {
      if (err) {return console.log(err.message);}
    }
  );
});

process.on('exit', ()=>{
  stdout.write('Bye!\n');
});
process.on('SIGINT', () => {
  process.exit();
});