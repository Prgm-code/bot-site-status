const dotenv = require('dotenv');
dotenv.config();

const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');
const util = require('util');
const timer = util.promisify(setTimeout);

const header = randomUseragent.getRandom(function (ua) {
    return ua.browserName === 'Firefox';
});


const reload = async function (ctx) {
    const browser = await puppeteer.launch()

    const page = await browser.newPage();
    await page.setUserAgent(header);
   
    await page.authenticate({ username: process.env.WEB_USERNAME, password: process.env.WEB_PASSWORD });
   
    try{
        await page.goto(process.env.WEB_URL);

    }catch (e)  {
        console.log(e);
        sendMessage(e, ctx);    
    }
    await page.screenshot({ path: 'example.png' });


    const extratedElements = await page.evaluate(() => {

        const elements = document.querySelectorAll('tbody  tr td'); 
        let data = [];
        let arr = [];
        let i = 0;
        for (let element of elements) {

            if (elements.length >2) {

                const font = element.innerText;
                
                if (font == 10) {
        
                    
                    
                   i = 17;
                }
            }
            if (i > 0) {
                data.push(element.innerText);
                if (data.length == 17 && data[0] == '10') {


                    arr.push(data);
                    data = [];
                }

                i--;
            }

        } 
        
        return arr;
    });
    console.log('resulrtado') ;
    console.log(extratedElements); 
        for (let i = 0; i < extratedElements.length; i++) {
            let text = '';  
            for (let j = 0; j < extratedElements[i].length; j++) {
                text += extratedElements[i][j] + ' ';
                console.log(text);
            }
            await timer(3000);
            await sendMessage(text, ctx);
        }

        


   /*  extratedElements.forEach(async element => { 
        
        await timer(3000);
        
        await  sendMessage((JSON.stringify(element)), ctx);
        console.log(element); */
       
   // });

        
  await browser.close();  
   return;

} ; 

const sitequery = async function (ctx, site) {
    const browser = await puppeteer.launch()

    const page = await browser.newPage();
    await page.setUserAgent(header);
   
    try{
        await page.goto(`http://200.27.8.220/detalle_sitios_fuera_funciones.php?nodo=${site}`);

    }catch(e){
            console.log(e);
            sendMessage(e, ctx);
        }
    await page.screenshot({ path: 'site.png' });
    await sendphoto( ctx);
    await browser.close();
    return;




};

exports.reload = reload;
exports.sitequery = sitequery;
