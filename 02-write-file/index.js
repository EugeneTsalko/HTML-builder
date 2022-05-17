const fs = require('fs');
const path = require('path');
const process = require('process');
const { stdin, stdout } = process;

let writeableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Здравствуйте! Введите текст:\n');

stdin.on('data', data => {
  if(data.toString().trim() === 'exit') {
    process.exit();
  } else {
    writeableStream.write(data.toString());
    stdout.write('Текст записан в файл text.txt\n');
  }
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  console.log('До свидания!');
});
