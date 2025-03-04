const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the "dataset" folder
const datasetPath = path.join(__dirname, 'dataset/dataset/');
console.log("Serving static files from:", datasetPath);

// Serve static files from the "dataset" directory
app.use('/dataset', express.static(datasetPath));

// Handle request for missing files
app.use((req, res, next) => {
  console.log(`Requested URL: ${req.originalUrl}`);
  next();
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
