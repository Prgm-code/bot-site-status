const {reload, sitequery } = require('./puppeteer.js');
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

let x ={
    site: 'site',
    region: 'region',
    comuna: 'comuna',
    sitio: 'sitio',
    codigo: 'codigo',
    oos: 'oos',
    ic1: 'ic1',

    vip: 'vip',
    localidad: 'localidad',
    bandas2g: 'bandas2g',
    tecnologias3g: 'tecnologias3g',
    tecnologiaslte: 'tecnologiaslte',
    afectacion2g: 'afectacion2g',
    afectacion3g: 'afectacion3g',
    afectacionlte: 'afectacionlte',
    porcentajeafectacion2g: 'porcentajeafectacion2g',
    porcentajeafectacion3g: 'porcentajeafectacion3g',
    porcentajeafectacionlte: 'porcentajeafectacionlte',
}

bot.command(['test', 'Test'], ctx => {
    
    let message= util.inspect(x, {compact: false, depth: 2});
    ctx.reply(message);
});




bot.launch();