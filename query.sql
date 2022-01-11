----Cambiarse a base postgres
\c postgres;

-- Create a new database called 'bancosolar'
CREATE DATABASE bancosolar;

--Conexión base library
\c bancosolar;

--Encoding UTF8
SET client_encoding TO 'UTF8';

--Crear Tablas
CREATE TABLE usuarios(
  id SERIAL,
  nombre VARCHAR(50),
  balance FLOAT CHECK (balance>=0),
  PRIMARY KEY (id)
);

CREATE TABLE transferencias(
  id SERIAL,
  emisor INT,
  receptor INT,
  monto FLOAT,
  fecha TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (emisor) REFERENCES usuarios(id),
  FOREIGN KEY (receptor) REFERENCES usuarios(id)
);


