const {
  Pool
} = require('pg');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "qwer1234",
  database: "bancosolar",
  port: 5432
})

const generarQuery = (name, text, values) => {
  return {
    name,
    text,
    values
  }
}

const insertar = async (datos) => {

  const name = "insertar"
  const text = "INSERT INTO usuarios (nombre, balance) values($1, $2)"
  const values = datos

  try {
    const result = await pool.query(generarQuery(name, text, values))
    return result
  } catch (error) {
    console.log(error.code)
    return error
  }
}

const consultar = async () => {

  const sqlQuery = "select * from usuarios"

  try {
    const result = await pool.query(sqlQuery)
    return result
  } catch (error) {
    console.log(error.code);
    return error
  }
}

const editar = async (datos) => {
  const consulta = {
    text: "UPDATE usuarios SET nombre=$1, balance=$2 WHERE nombre=$1 RETURNING *",
    values: datos
  }

  try {
    const result = await pool.query(consulta)
    console.log(result);
    return result
  } catch (error) {
    console.log(error);
    return error
  }
}

const eliminar = async (id) => {
  const consulta = `DELETE FROM usuarios WHERE id='${id}'`

  try {
    const result = await pool.query(consulta)
    return result
  } catch (error) {
    console.log(error);
    return error
  }
}

const obtenerId = async (nombre) => {
  const consulta = {
    text: "select id from usuarios where nombre=$1",
    values: nombre
  }

  try {
    const result = await pool.query(consulta)
    return result.rows[0].id
  } catch (error) {
    console.log(error.code);
    return error
  }
}

const transferir = async (datos) => {

  let [emisor, receptor, monto] = datos

  emisor = await obtenerId([emisor])
  receptor = await obtenerId([receptor])

  pool.connect(async (error_conexion, client, release) => {

    const nameDescontar = "descontar"
    const nameAcreditar = "acreditar"
    const textDescontar = "UPDATE usuarios SET balance=balance-$2 WHERE id=$1"
    const textAcreditar = "UPDATE usuarios SET balance=balance+$2 WHERE id=$1"

    try {
      await client.query("BEGIN")

      await client.query(generarQuery(nameDescontar, textDescontar, [emisor, +monto]))

      await client.query(generarQuery(nameAcreditar, textAcreditar, [receptor, +monto]))

      await client.query("COMMIT")

      return true

    } catch (error) {
      await client.query("ROLLBACK")
      console.log(`Error código: ${error.code}`)
      console.log(`Detalle del error: ${error.detail}`)
      console.log(`Tabla originaria del error: ${error.table}`)
      console.log(`Restricción violada en el campo: ${error.constraint}`)
      console.log(error);
    }

    release()
    pool.end()

  })

  const textRegistrar = "INSERT INTO transferencias (emisor, receptor, monto, fecha) values($1, $2, $3, now())"

  const nameRegistrar = "registrar"

  try {

    const result = await pool.query(generarQuery(nameRegistrar, textRegistrar, [emisor, receptor, +monto]))

    return result

  } catch (error) {
    console.log(error.code);
    return error
  }
}

const consultarTransferencias = async () => {

  const sqlQuery = "select * from transferencias"

  try {
    const result = await pool.query(sqlQuery)
    return result
  } catch (error) {
    console.log(error.code);
    return error
  }
}


module.exports = {
  insertar,
  consultar,
  editar,
  eliminar,
  transferir,
  consultarTransferencias
}