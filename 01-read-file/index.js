const path = require('path');
const fs = require('fs');

//читаем файл через ридстрим
const reader = fs.createReadStream(path.join(__dirname, 'text.txt'));
//выводим в консоль содержимое файла
reader.on('data', function (chunk) {
  console.log(chunk.toString());
});
