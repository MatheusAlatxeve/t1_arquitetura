require('dotenv').config()
const express = require('express')
const axios = require('axios')
const app = express()
app.use(express.json())
const { PORT } = process.env

const lembretes = {}
let id = 0

//GET /lembretes
app.get('/lembretes', (req, res) => {
  res.json(lembretes)
})

//POST /lembretes
app.post(`/lembretes`, (req, res) => {
  const { texto } = req.body
  const id = Object.keys(lembretes).length
  lembretes[id] = {
      id, texto
  }
  //usar a axios para emitir o evento
  axios.post('http://barramento-de-eventos-service:10000/eventos', {
      type: 'LembreteCriado',
      payload: {
          id, texto: req.body.texto
      }
  })
  res.status(201).json(lembretes[id])
})

app.post('/eventos', (req, res) => {
  console.log(req.body)
  res.status(200).json({mensagem: 'ok'})
})

app.listen(process.env.PORT, () => {
  console.log(`Lembretes. Porta: ${process.env.PORT}`)
})