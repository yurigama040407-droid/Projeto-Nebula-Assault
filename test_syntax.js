const fs = require('fs');
const files = ['engine.js', 'data.js', 'entities.js', 'main.js'];
for (const file of files) {
  try {
    const code = fs.readFileSync(file, 'utf8');
    // Parse using Function constructor or vm
    new Function(code);
    console.log(file + ' syntax OK');
  } catch(e) {
    console.log(file + ' ERROR: ' + e.message);
  }
}
