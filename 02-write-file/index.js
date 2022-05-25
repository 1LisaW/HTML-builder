const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const {pipeline} = require('stream');
const writableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf8', {
  flags: 'a+'
});
stdout.write('Please, type some text\n');

stdin.on('data', (data)=>{
  if (data.toString().trim() === 'exit') process.exit();
});
pipeline(stdin, writableStream, (err) => {
  if (err) {
    console.error('Pipeline failed.', err);
  }
});

process.on('exit', ()=>{
  stdout.write('Bye!\n');
});
process.on('SIGINT', () => {
  process.exit();
});