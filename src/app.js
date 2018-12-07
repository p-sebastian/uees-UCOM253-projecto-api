(async () => {
  const Express = require('express');
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const { API_PORT } = require('./config');
  
  const app = Express();
  const userRoute = require('./user.route');
  const productRoute = require('./product.route');
  
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Add routes
  const router = Express.Router();
  router.use('/user', await userRoute());
  router.use('/product', await productRoute());
  
  app.use('/api', router);

  // Start server
  app.listen(API_PORT, err => {
    if (err) { throw err; }
    console.info(`App listening on PORT: ${API_PORT}`);
  });
})();