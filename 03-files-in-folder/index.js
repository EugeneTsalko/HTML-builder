const fs = require('fs');
const path = require('path');

const pathToDir = path.join(__dirname, 'secret-folder');

fs.readdir(pathToDir, {withFileTypes: true}, function(err, items) {
  if (err) throw err;

  for (let i = 0; i < items.length; i++) {
    
    if (items[i].isFile()) {

      let fileSize = 0;
      fs.stat(path.join(pathToDir, items[i].name), (err, stats) => {
        if (err) throw err;
        fileSize = stats.size;
        // console.log(fileSize);
        console.log(`${items[i].name.split('.')[0]} - ${path.extname(items[i].name).slice(1)} - ${fileSize} bytes`);
      });

    }
  }
});