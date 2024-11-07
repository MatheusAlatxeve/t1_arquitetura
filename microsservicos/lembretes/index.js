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
app.post('/lembretes', (req, res) => {
  id++
  
  const lembrete = {id, texto: req.body.texto}
  lembretes[id] = lembrete
  axios.post('http://localhost:10000/eventos', {
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

app.listen(PORT, () => console.log(`Lembrete. Porta ${PORT}`))