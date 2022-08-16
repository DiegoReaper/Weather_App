import express from 'express';
const router = express.Router();
import bodyParser from 'body-parser';
import request from 'request';
import path from 'path';
import ejs from 'ejs';
import cors from 'cors';
const app = express();

const apiKey = 'N3ME4T6R8RWH8APP5VMHUFEK6';

app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.static('public'));
app.use(bodyParser.json());
app.set('view engine', 'html');

app.engine('html', ejs.renderFile);

router.get('/', function (req, res) {
    res.render(path.resolve('index.html'));
});

router.post('/getWeather', async function (req, res) {
    let cities = [];
    cities = req.body.cities;
    let weatherJson = {};
    let count = 0;
    for await (let city of cities) {
        let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${apiKey}`;
        request(url, function (response, body) {
            if (body.body == undefined || body.body[0] == 'I') {
                console.log("error");
                weatherJson[city] = `N/A`;
            }
            else {
                let weather = JSON.parse(body.body);
                let temperature = Math.round(((weather.currentConditions.temp - 32.0) / 1.8) * 100) / 100;
                let weatherText = `${temperature}C`;
                weatherJson[city] = weatherText;
            }
            count++;
            if (count == cities.length)
                res.json({ "weather": weatherJson });
        });
    }
});

app.use('/', router);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});