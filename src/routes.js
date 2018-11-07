const router = require('express').Router();

module.exports = async () => {
  const connection = await require('./connect');

  router.get('/user', getEmployees(connection));
  router.post('/user', verify, createUser(connection));
  return router;
};

/**
 * CREATE PROCEDURE ALDEBERAN.show_employees()
 *  SELECT ALDEBERAN.Empleados.*, ALDEBERAN.Persona.*
 *    FROM ALDEBERAN.Persona RIGHT JOIN ALDEBERAN.Empleados
 *    ON ALDEBERAN.Persona.id_persona = ALDEBERAN.Empleados.id_persona;
 * @function {show_employees} Shows employees in Aldeberan; 
 */

const getEmployees = connection => async (req, res) => {
  let data = await connection.query(`
    CALL ALDEBERAN.show_employees();
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