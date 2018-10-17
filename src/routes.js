const router = require('express').Router();

const testUser = {
  nombre: 'sebastian',
  apellido: 'penafiel',
  email: 'asd@asd.com',
  edad: 25,
  ciudad: 'samborondon',
  provincia: 'guayas',
  tel: '123456789',
  cargo: 'gerente'
};

module.exports = async () => {
  const connection = await require('./connect');

  router.get('/user', getEmployees(connection));
  router.post('/user', verify, createUser(connection));
  return router;
};

const getEmployees = connection => async (req, res) => {
  let data = await connection.query(`
    SELECT ALDEBERAN.Empleados.*, ALDEBERAN.Persona.*
    FROM ALDEBERAN.Persona RIGHT JOIN ALDEBERAN.Empleados
    ON ALDEBERAN.Persona.id_persona = ALDEBERAN.Empleados.id_persona;
  `);
  // [0]: rows
  // [1]: fields
  res.json(data[0]);
}

const verify = (req, res, next) => {
  const { nombre, apellido, email, edad, ciudad, provincia, tel, cargo } = req.body;
  if (!nombre || !apellido || !email || !edad || !ciudad || !provincia || !tel || !cargo) {
    return res.status(401).json({ error: 'Todos los campos son requeridos' });
  }
  next();
}

const createUser = connection => async (req, res) => {
  const { nombre, apellido, email, edad, ciudad, provincia, tel, cargo } = req.body;
  try {
    let persona = await connection.query(`
      INSERT INTO Persona(nombre, apellido, email, edad, ciudad, provincia, tel)
      VALUES ('${nombre}', '${apellido}', '${email}', ${edad}, '${ciudad}', '${provincia}', '${tel}');
    `);
    // id from inserted row is in data[0] as: insertId
    await connection.query(`
      INSERT INTO Empleados(cargo, id_persona)
      VALUES ('${cargo}', ${persona[0].insertId});
    `);
    // on success
    res.json({ message: 'success' });
  } catch (error) {
    console.error(error)
    res.json({ error });
  }
}