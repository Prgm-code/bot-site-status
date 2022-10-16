const { filterArray,sitesCanceled } = require('./data.js')
const dotenv = require('dotenv');
dotenv.config();
const util = require('util');

const { sendMessage, sendArr, sendPhoto } = require('./telegraf.js');
const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');







const header = randomUseragent.getRandom(function (ua) {
    return ua.browserName === 'Firefox';
});


const reload = async function (ctx) {
    const browser = await puppeteer.launch()

    const page = await browser.newPage();
    await page.setUserAgent(header);

    await page.authenticate({ username: process.env.WEB_USERNAME, password: process.env.WEB_PASSWORD });

    try {
        await page.goto(process.env.WEB_URL);

    } catch (e) {
        console.log(e);
        sendMessage(e, ctx);
    }
    await page.screenshot({ path: 'example.png' });


    const extratedElements = await page.evaluate(() => {

        const elements = document.querySelectorAll('tbody  tr td');

        let region = 13;// a modificar por entrada de usuario

        let data = [];
        let arr = [];
        let i = 0;
        for (let element of elements) {

            if (elements.length > 2) {

                const font = element.innerText;

                if (font == region) {



                    i = 17;
                }
            }
            if (i > 0) {

                data.push(element.innerText);
                if (data.length == 17 && data[0] == String(region) && data[3].length > 5) {


                    arr.push(data);
                    data = [];
                }

                i--;
            }

        }

        return arr;
    });
    let sitesArr = [];
    console.log('resulrtado');
    console.log(extratedElements);
    for (let i = 0; i < extratedElements.length; i++) {
        let text = filterArray(extratedElements[i], ctx);
        if (text != undefined) {

            let msg = util.inspect(text, { showHidden: false, depth: null, compact: false });
            sitesArr.push(msg);
        }





        // console.log(msg);

    }
    await sendArr(sitesArr, ctx);

    let sitesCancel = sitesCanceled();

    if (sitesCancel !== undefined && sitesCancel.length > 0)   {  
        await sendMessage('Sitios OOS Cancelados ', ctx);
        await sendArr(sitesCancel, ctx) }


    await browser.close();
    return;

};

const sitequery = async function (ctx, site) {
    const browser = await puppeteer.launch()

    const page = await browser.newPage();
    await page.setUserAgent(header);

    try {
        await page.goto(`http://200.27.8.220/detalle_sitios_fuera_funciones.php?nodo=${site}`);

    } catch (e) {
        console.log(e);
        sendMessage(e, ctx);
    }
    await page.screenshot({ path: 'site.png' });
    await sendPhoto(ctx);
    await browser.close();
    return;




};

exports.reload = reload;
exports.sitequery = sitequery;
