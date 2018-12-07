const router = require('express').Router();

module.exports = async () => {
  const connection = await require('./connect');

  router.get('/', getProducts(connection));
  router.post('/', verify, createProduct(connection));
  return router;
};

const getProducts = connection => async (req, res) => {
  let data = await connection.query(`
    CALL ALDEBERAN.show_products();
  `);
  // [0]: rows
  // [1]: fields
  res.json(data[0][0]);
}

const verify = (req, res, next) => {
  const { description, price, name, brand, id_persona, cargo } = req.body;
  if (!description || !price || !name || !brand || !id_persona || !cargo) {
    return res.status(401).json({ error: 'Todos los campos son requeridos' });
  }
  if (cargo !== 'gerente') {
    return res.status(403).json({ error: 'Solo un gerente puede agregar productos' });
  }
  next();
}

const createProduct = connection => async (req, res) => {
  const { description, price, name, brand, id_persona } = req.body;
  try {
    await connection.query(`
      INSERT INTO Productos(name, price, description, brand, id_persona)
      VALUES ('${name}', '${price}', '${description}', '${brand}', ${id_persona});
    `);
    // on success
    res.json({ message: 'success' });
  } catch (error) {
    console.error(error)
    res.json({ error });
  }
}