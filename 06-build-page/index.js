const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const indexHTML = path.join(projectDist, 'index.html');
const components = path.join(__dirname, 'components');

const assets = path.join(__dirname, 'assets');
const assetsCopy = path.join(projectDist, 'assets');

const stylesDir = path.join(__dirname, 'styles');
const projectDir = path.join(__dirname, 'project-dist');

fs.access(projectDist, async (err) => {
  if (err) {
    buildHTML();
    copyDir();
    mergeStyles();
  }
  else {
    await fs.promises.rm(projectDist, { recursive: true });
    buildHTML();
    copyDir();
    mergeStyles();
  }
});

function callback(err) {
  if (err) throw err;
}

//

function buildHTML() {

  fs.mkdir(projectDist, { recursive: true }, callback);
  fs.copyFile(path.join(__dirname, 'template.html'), indexHTML, callback);

  let innerHTML = '';
  let readableStream = fs.createReadStream(path.join(__dirname, 'template.html'));
  readableStream.on('data', (chunk) => innerHTML += chunk.toString());
  readableStream.on('end', () => prepareHTML(innerHTML));

  function prepareHTML(innerHTML) {
    if(innerHTML.includes('{{')) {
      const tagBegin = innerHTML.indexOf('{{');
      const tagEnd = innerHTML.indexOf('}}');
      let componentHTML = '';
      const readableComponentStream = fs.createReadStream(path.join(components, `${innerHTML.slice(tagBegin + 2, tagEnd)}.html`)); //path.join(components, header)
      readableComponentStream.on('data', (chunk) => componentHTML += chunk.toString());
      readableComponentStream.on('end', () => {
        innerHTML = innerHTML.replace(innerHTML.slice(tagBegin, tagEnd + 2), componentHTML);
        prepareHTML(innerHTML); // пока не закончатся {{
      });
    } else {
      const writeableStream = fs.createWriteStream(indexHTML);
      writeableStream.write(innerHTML);
    }
  }
}

// 

function copyDir(from = assets, to = assetsCopy) {

  fs.mkdir(to, { recursive: true }, callback);

  fs.readdir(from, {withFileTypes: true}, (err, items) => {
    if (err) throw err;

    for (let i = 0; i < items.length; i++) {
      if (items[i].isFile()) {
        fs.copyFile(path.join(from, items[i].name), path.join(to, items[i].name), callback);
      } else {
        copyDir(path.join(from, items[i].name), path.join(to, items[i].name));
      }
    }
  });
}

//

function mergeStyles() {
  let bundleWriteableStream = fs.createWriteStream(path.join(projectDir, 'style.css'));

  fs.readdir(stylesDir, {withFileTypes: true}, (err, items) => {
    if (err) throw err;

    for (let i = 0; i < items.length; i++) {
      if (items[i].isFile() && path.extname(items[i].name) === '.css') {
        const reader = fs.createReadStream(path.join(stylesDir, items[i].name));
        reader.on('data', function (chunk) {
          bundleWriteableStream.write(chunk.toString());
        });
      }
    }
  });
}

// buildHTML();
// copyDir();
// mergeStyles();