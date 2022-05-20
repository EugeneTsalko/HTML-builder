const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const projectDir = path.join(__dirname, 'project-dist');

fs.access(path.join(projectDir, 'bundle.css'), (err) => {
  if (err) {
    mergeStyles();
  }
  else fs.rm(path.join(projectDir, 'bundle.css'), { recursive: true }, (err) => {
    if (err) throw err;
    mergeStyles();
  });
});

function mergeStyles() {
  let bundleWriteableStream = fs.createWriteStream(path.join(projectDir, 'bundle.css'));

  fs.readdir(stylesDir, {withFileTypes: true}, (err, items) => {
    if (err) throw err;

    for (let i = 0; i < items.length; i++) {
      if (items[i].isFile() && path.extname(items[i].name) === '.css') {
      // console.log(items[i].name);
        const reader = fs.createReadStream(path.join(stylesDir, items[i].name));
        // bundleContent.push(reader);
        // console.log(reader);
        reader.on('data', function (chunk) {
          bundleWriteableStream.write(chunk.toString());
        });
      }
    }
  });
}