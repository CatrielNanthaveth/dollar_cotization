import axios from 'axios';
import cheerio from 'cheerio';
import { writeFile} from 'fs';

type DollarValues = {
    compra: Number,
    venta: Number
}


const getPage = async (url: string): Promise<string> => {
    const response = await axios.get(url);

    return response.data;
}

const run = async () => {

    try {
        const dolarHoyPage = await getPage('https://dolarhoy.com/cotizaciondolarblue');
        
        const dolarHoyValue = scrapeValue(dolarHoyPage);
    
        writeFile('files/res.json', JSON.stringify(dolarHoyValue), null, (e) => console.error(e));

    } catch (error) {
        console.error('no hay datos!')
    }

}

const scrapeValue = (page: string): DollarValues => {
    const $ = cheerio.load(page);

    return {
        compra: Number($('div.value').first().text().match(/\d+\.\d+/)?.[0]),
        venta: Number($('div.value').last().text().match(/\d+\.\d+/)?.[0])
    };
}

run();