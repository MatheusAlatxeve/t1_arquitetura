const dotenv = require('dotenv');
const axios = require('axios');
const readline = require('readline'); 

dotenv.config();

const {
    PROTOCOL, BASE_URL, APP_ID
} = process.env;


async function getCoordinates(Q) {
    try {
        const url = `${PROTOCOL}://${BASE_URL}?q=${Q}&appid=${APP_ID}`;
        const response = await axios.get(url);
        
        if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0];
            console.log(`Coordenadas de ${Q}: Latitude: ${lat}, Longitude: ${lon}`);
        } else {
            console.log('Cidade não encontrada.');
        }
    } catch (error) {
        console.error('Erro ao consultar a API:', error.message);
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Digite o nome da cidade: ', (city) => {
    getCoordinates(city);
    rl.close(); 
});

            

