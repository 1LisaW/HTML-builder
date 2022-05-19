const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const writableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf8', {
  flags: 'a+'
});
stdout.write('Please, tipe some text\n');

stdin.on('data', (data)=>{
  if (data.toString().trim() === 'exit')  process.exit();
  writableStream.write(data.toString());
});