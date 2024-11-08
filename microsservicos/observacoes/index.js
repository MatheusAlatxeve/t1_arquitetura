//lembre-se de lidar com o .env e o .env.example
require('dotenv').config()
const express = require('express')
const axios = require('axios')
const {v4: uuidv4} = require('uuid')
const app = express()
app.use(express.json())
const { PORT } = process.env

const observacoesPorLembrete = {}

const funcoes = {
  ObservacaoClassificada:(observacao) => {
    const observacoes = observacoesPorLembrete[observacao.lembreteId]
    const obsParaAtualizar = observacoes.find(o => o.id === observacao.id)
    obsParaAtualizar.status = observacao.status
    axios.post('http://localhost:10000/eventos', {
      type: "ObservacaoAtualizada",
      payload: {
        id: observacao.id,
        texto: observacao.texto,
        lembreteId: observacao.lembreteId,
        status: observacao.status
      }
    })  
  }
}



//GET /lembretes/idLembrete/observacoes
app.get('/lembretes/:idLembrete/observacoes', (req, res) => {
  res.json(observacoesPorLembrete[req.params.idLembrete] || [])
})



//POST /lembretes/idLembrete/observacoes
app.post('/lembretes/:idLembrete/observacoes', async function(req, res){
  const idObservacacao = uuidv4()
  const { texto } = req.body
  const observacoesDoLembrete = observacoesPorLembrete[req.params.idLembrete] || []
  observacoesDoLembrete.push({
    id: idObservacacao, 
    texto,
    status: 'aguardando'
  })
  
  observacoesPorLembrete[req.params.idLembrete] = observacoesDoLembrete
  
  await axios.post('barramento-de-eventos-service:10000/eventos', {
    type: 'ObservacaoCriada',
    payload: {
      id: idObservacacao,
      texto,
      lembreteId: req.params.idLembrete,
      status: 'aguardando'
    }
  })
  res.status(201).json(observacoesDoLembrete)

})


app.post('/eventos', (req, res) => {
  try{
    const evento = req.body
    console.log(evento)
    funcoes[evento.type](evento.payload)
  }
  catch(err){}
  res.json({msg: 'ok'})
})

app.listen(PORT, () => console.log(`Observações. PORTA ${PORT}.`))