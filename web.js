const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let add;  
  if (req.url == "" || req.url == "/") {add = "index.html"}  
  else {add = req.url}
  const filePath = path.join(process.cwd(), add);
  const fileStream = fs.createReadStream(filePath);

  fileStream.on('error', (err) => {
    if (err.code === 'ENOENT') {
      res.statusCode = 404;
      res.end('File not found!');
    } else {
      res.statusCode = 500;
      res.end('Server error!');
    }
  });

  fileStream.pipe(res);
});

const port = 80;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});