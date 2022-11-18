const express = require('express');
// instantiate the server
const app = express();
// tell server to listen for requests
app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
  });

  