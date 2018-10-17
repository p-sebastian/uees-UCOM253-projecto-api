(async () => {
  const Express = require('express');
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const { API_PORT } = require('./config');
  
  const app = Express();
  const routes = require('./routes');
  
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use('/api', await routes());
  app.listen(API_PORT);
})();