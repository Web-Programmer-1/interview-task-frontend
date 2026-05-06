const fs = require('fs');
const path = require('path');

const extensions = ['.ts', '.tsx', '.js', '.jsx', '.css'];

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      }
    } else {
      if (extensions.includes(path.extname(file)) && file !== 'remove_comments.js') {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

function removeComments(content, ext) {
  if (ext === '.css') {
    return content.replace(/\/\*[\s\S]*?\*\//g, '');
  }
  
  let result = '';
  let i = 0;
  let inString = null; 
  let inComment = null; 
  
  while (i < content.length) {
    const char = content[i];
    const nextChar = content[i + 1];
    
    if (inComment === '//') {
      if (char === '\n') {
        inComment = null;
        result += char;
      }
    } else if (inComment === '/*') {
      if (char === '*' && nextChar === '/') {
        inComment = null;
        i++;
      }
    } else if (inString) {
      result += char;
      if (char === '\\') {
        i++;
        result += content[i];
      } else if (char === inString) {
        inString = null;
      }
    } else {
      if (char === '/' && nextChar === '/') {
        inComment = '//';
        i++;
      } else if (char === '/' && nextChar === '*') {
        inComment = '/*';
        i++;
      } else if (char === "'" || char === '"' || char === '`') {
        inString = char;
        result += char;
      } else {
        result += char;
      }
    }
    i++;
  }
  
  return result;
}

const rootDir = process.cwd();
const files = getAllFiles(rootDir);

files.forEach(file => {
  const ext = path.extname(file);
  const content = fs.readFileSync(file, 'utf8');
  let newContent = removeComments(content, ext);
  
  // Trim trailing spaces
  newContent = newContent.split('\n').map(l => l.trimEnd()).join('\n');
  
  // Clean up extra blank lines
  const cleanedContent = newContent.replace(/\n\s*\n\s*\n/g, '\n\n').trim() + '\n';
  
  if (content !== cleanedContent) {
    fs.writeFileSync(file, cleanedContent, 'utf8');
    console.log(`Processed: ${file}`);
  }
});
