const puppeteer = require('puppeteer');
const {Telegraf} = require('telegraf');
const util = require('util');
const timer = util.promisify(setTimeout);
const dotenv = require('dotenv');
dotenv.config();


/* const express = require('express');
const app = express();
const port = 3000; */

const bot = new Telegraf(process.env.BOT_TOKEN);
let sendMessage = async function(text,ctx) {
    try {
                
        await bot.telegram.sendMessage(ctx.chat.id ,text)
    } 
    catch(e) 
    {
        console.log(e);
    }
};

let sendphoto = async function(ctx) {
    try {
                
        await bot.telegram.sendPhoto(ctx.chat.id ,{source: 'site.png'})
    } 
    catch(e) 
    {
        console.log(e);
    }
};

const randomUseragent = require('random-useragent');


const header = randomUseragent.getRandom(function (ua) {
    return ua.browserName === 'Firefox';
});
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

const reload = async (ctx) => {
    const browser = await puppeteer.launch()

    const page = await browser.newPage();
    await page.setUserAgent(header);
   
    await page.authenticate({ username: process.env.WEB_USERNAME, password: process.env.WEB_PASSWORD });
   
    try{
        await page.goto('http://200.27.8.220/resumen_bts_caidos_detalle.php');

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

const monitorStart = async function (ctx) {

            
    

            let time = new Date().toLocaleString();

            console.log('reloading at ' + time);
           await sendMessage('reloading at ' + time, ctx);
           await reload(ctx);
           console.log('reload');
           await timer(60*1000*30);
           monitorStart(ctx);
           

};

bot.start((ctx)=>{
    
    console.log(ctx.from);
    console.log(ctx.chat);
    console.log(ctx.message);
    console.log(ctx.updateSubTypes);

    ctx.reply('welcome '+ ctx.from.first_name);


});
bot.command(['monitor','Monitor'],  (ctx) =>{
    monitorStart(ctx);
    ctx.reply('monitoring has started');
});
bot.command(['check', 'Check'], ctx => {
    
    console.log((ctx.message.text).slice(7));
    sitequery(ctx, (ctx.message.text).slice(7));
    ctx.reply('checking site... whait a moment');
});






bot.launch();