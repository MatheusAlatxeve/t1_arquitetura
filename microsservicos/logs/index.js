require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const { PORT } = process.env;

const baseLogs = {};
let idCounter = 0;

// GET logs
app.get("/logs", (req, res) => {
    res.json(baseLogs);
});

// POST logs
app.post("/eventos", (req, res) => {
    try {
        const evento = req.body;
        baseLogs[idCounter] = {
            id: idCounter,
            tipo_evento: evento.type,
            data_hora: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
        };
        console.log(`Evento registrado: ${evento.type}`);
        idCounter++; 
    } catch (err) {
        console.error("Erro ao registrar evento:", err);
    }
    res.json({ msg: "ok" });
});


app.listen(PORT, async () => {
    console.log(`Logs. ${PORT}`);
    try {
        const resp = await axios.get('http://barramento-de-eventos-service:10000/eventos');
        resp.data.forEach((valor) => {
            baseLogs[idCounter] = {
                id: idCounter,
                tipo_evento: evento.type,
                data_hora: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
            };
            idCounter++;
        });
    } catch (err) {
        console.error("Erro ao obter eventos:", err);
    }
});