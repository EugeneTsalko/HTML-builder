const fs = require('fs');
const path = require('path');

const pathFiles = path.join(__dirname, 'files');
const pathFilesCopy = path.join(__dirname, 'files-copy');

//проверяем есть ли папка files-copy, if - если нет, else - если есть
fs.access(pathFilesCopy, (err) => {
  if (err) {
    copyDir();
  }
  else fs.rm(pathFilesCopy, { recursive: true }, (err) => {
    if (err) throw err;
    copyDir();
  });
});

function copyDir() {

  function callback(err) {
    if (err) throw err;
  }

  fs.mkdir(pathFilesCopy, { recursive: true }, callback);

  fs.readdir(pathFiles, {withFileTypes: true}, (err, items) => {
    if (err) throw err;

    for (let i = 0; i < items.length; i++) {//сюда можно добавить не только по файлам, но и по папкам
      if (items[i].isFile()) {
        fs.copyFile(path.join(pathFiles, items[i].name), path.join(pathFilesCopy, items[i].name), callback);
      }
    }
  });
}