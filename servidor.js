const http = require('http');
const fs = require('fs');
const url = require('url');

const {
  insertar,
  consultar,
  editar,
  eliminar,
  transferir,
  consultarTransferencias
} = require('./consultas');


http.createServer(async (req, res) => {

    if (req.url == "/" && req.method === 'GET') {
      res.setHeader('content-type', 'text/html')
      const html = fs.readFile('index.html', 'utf8', (err, html) => {
        res.end(html)
      })
    }

    if (req.url.startsWith("/usuarios") && req.method === 'GET') {
      const registros = await consultar()
      res.end(JSON.stringify(registros))
    }

    if (req.url.startsWith("/usuario") && req.method === 'POST') {
      let body = ""
      req.on("data", (chunk) => {
        body += chunk
      })
      req.on("end", async () => {
        const datos = Object.values(JSON.parse(body))
        const respuesta = await insertar(datos)
        res.end(JSON.stringify(respuesta))
      })
    }

    if (req.url.startsWith("/usuario") && req.method == "PUT") {
      let body = ""
      req.on("data", (chunk) => {
        body += chunk
      })
      req.on("end", async () => {
        const datos = Object.values(JSON.parse(body))
        const respuesta = await editar(datos)
        res.end(JSON.stringify(respuesta))
      })
    }

    if (req.url.startsWith("/usuario") && req.method == "DELETE") {
      const {
        id
      } = url.parse(req.url, true).query

      const respuesta = await eliminar(id)

      res.end(JSON.stringify(respuesta))
    }

    if (req.url.startsWith("/transferencia") && req.method == "POST") {
      let body = ""
      req.on("data", (chunk) => {
        body += chunk
      })
      req.on("end", async () => {
        const datos = Object.values(JSON.parse(body))
        const respuesta = await transferir(datos)
        res.end(JSON.stringify(respuesta))
      })
    }

    if (req.url.startsWith("/transferencias") && req.method === 'GET') {
      const registros = await consultarTransferencias()
      res.end(JSON.stringify(registros))
    }

  })
  .listen(3000, () => {
    console.log('Escuchando el puerto 3000.')
  })