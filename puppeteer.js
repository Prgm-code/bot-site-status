const { filterArray, sitesCanceled } = require('./data.js')
const dotenv = require('dotenv');
dotenv.config();
const util = require('util');
const localStorage = require('localStorage');

const { sendMessage, sendArr, sendPhoto } = require('./telegraf.js');
const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');







const header = randomUseragent.getRandom(function (ua) {
    return ua.browserName === 'Firefox';
});


const reload = async function (ctx, region) {
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

        let region = 10;// a modificar por entrada de usuario

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
                if (data.length == 17 && data[0] == String(region) && data[3].length > 5 && data[1].length > 3) {

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
    if (extratedElements.length > 0) {


        for (let i = 0; i < extratedElements.length; i++) {
            let text = filterArray(extratedElements[i], ctx);
            if (text != undefined) {

                let msg = util.inspect(text, { showHidden: false, depth: null, compact: false });
                sitesArr.push(msg);

            }

            // console.log(msg);

        }
        if (sitesArr.length > 0 && sitesArr.length <= 10) {

            //send max 10 sites


            sitesArr.unshift('---Afectación de Servicio---');

            let textSites = sitesArr.join('\n').toString().replace(/,/g, ' ').replace(/\[/gi, '').replace(/\]/gi, '');
            console.log(textSites.length);
            sendMessage(textSites, ctx);


        } if (sitesArr.length > 10) {
            let sitesProsArr = [];
            for (let i = 0; i < sitesArr.length; i++) {
                if (i % 10 == 0) {

                    let textSites = sitesArr.slice(i, i + 10)
                    textSites.unshift('------Afectación de Servicio------');
                    console.log('asdasd' + textSites);

                    let sendTextSites = textSites.join('\n').toString().replace(/,/g, ' ').replace(/\[/gi, '').replace(/\]/gi, '');
                    sitesProsArr.push(sendTextSites);
                }
            }
            sendArr(sitesProsArr, ctx);

        }
        else {
            console.log('No hay sitios disponibles');
        }

        let sitesCancel = sitesCanceled();

        if (sitesCancel !== undefined && sitesCancel.length > 0) {
            sitesCancel.unshift('---Sitios OOS Cancelados---');
            let textSites = sitesCancel.join('\n').toString().replace(/,/g, ' ').replace(/\[/gi, '').replace(/\]/gi, '');
            await sendMessage(textSites, ctx)
        }


        await browser.close();
        return;
    }
    else {
        sendMessage('datos vacios', ctx);
        console.log('------------------datos vacios------------------');
        await browser.close();
        return;

    }

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

let status = function (ctx) {
    let sitesOOS = JSON.parse(localStorage.getItem('siteOOS')) ?? {};
    console.log(sitesOOS);

    let sitesValue = Object.values(sitesOOS);
    console.log(sitesValue);


    let sitesKey = Object.keys(sitesOOS);
    console.log(sitesKey);
    let sites = [];

    for (let i = 0; i < sitesValue.length; i++) {

        sites.push(
            util.inspect(sitesValue[i], { showHidden: false, depth: null, compact: false }));

    }
    if (sites.length > 0 && sites.length <= 10) {

        //send max 10 sites


        sites.unshift('---Afectación de Servicio---');

        let textSites = sites.join('\n').toString().replace(/,/g, ' ').replace(/\[/gi, '').replace(/\]/gi, '');
        console.log(textSites.length);
        sendMessage(textSites, ctx);


    } else if (sites.length > 10) {
        let sitesArr = [];
        for (let i = 0; i < sites.length; i++) {
            if (i % 10 == 0) {

                let textSites = sites.slice(i, i + 10);
                textSites.unshift('---Afectación de Servicio---');

                let sendTextSites = textSites.join('\n').toString().replace(/,/g, ' ').replace(/\[/gi, '').replace(/\]/gi, '');
                sitesArr.push(sendTextSites);
            }
        }
        sendArr(sitesArr, ctx);
        return;

    }
    else {
        sendMessage('No hay sitios OOS', ctx);
    }

};

let shortStatus = function (ctx) {
    let sitesOOS = JSON.parse(localStorage.getItem('siteOOS')) ?? {};
    console.log(sitesOOS);

    let sitesValue = Object.values(sitesOOS);
    console.log(sitesValue);



    let sitesKey = Object.keys(sitesOOS);
    console.log(sitesKey);
    let sites = [];

    for (let i = 0; i < sitesValue.length; i++) {
        let siteAffectation = [
            sitesValue[i][3],
            sitesValue[i][2],
            sitesValue[i][sitesValue[i].length - 4],
            sitesValue[i][sitesValue[i].length - 3],
            sitesValue[i][sitesValue[i].length - 2],
            sitesValue[i][sitesValue[i].length - 1]
        ];

        sites.push(

            util.inspect(siteAffectation, { showHidden: false, depth: null, compact: false }));

    }
    if (sites.length > 0) {


        sites.unshift('---Afectación de Servicio---');

        if (sites.length <= 10) {
            let textSites = sites.join('\n').toString().replace(/,/g, ' ').replace(/\[/gi, '').replace(/\]/gi, '');
            sendMessage(textSites, ctx);
            return;
        }
        else {
            let sitesArr = [];
            for (let i = 0; i < sites.length; i++) {
                if (i % 10 == 0) {

                    let textSites = sites.slice(i, i + 10);
                    textSites.unshift('---Afectación de Servicio---');
                    let sendTextSites = textSites.join('\n').toString().replace(/,/g, ' ').replace(/\[/gi, '').replace(/\]/gi, '');
                    sitesArr.push(sendTextSites);
                }
            }
            sendArr(sitesArr, ctx);
            return;
        }



    } else {
        sendMessage('No hay sitios OOS', ctx);
    }

};


module.exports = { reload, sitequery, status, shortStatus };

