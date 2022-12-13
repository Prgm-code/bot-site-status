const { reload, sitequery , status , shortStatus} = require('./puppeteer.js');
const { bot, sendMessage } = require('./telegraf.js');

const util = require('util');
const timer = util.promisify(setTimeout);
const dotenv = require('dotenv');
dotenv.config();



const monitorStart = async function (ctx ,region) {


    let time = new Date().toLocaleString();

    console.log('Monitor Start' + time);
    //await sendMessage( 'Monitor Start' + time, ctx);
    await reload(ctx, region);
    console.log('reload');
    await timer(60 * 1000 * 5);
    monitorStart(ctx);


};

bot.start((ctx) => {

    console.log(ctx.from);
    console.log(ctx.chat);
    console.log(ctx.message);
    console.log(ctx.updateSubTypes);

    ctx.reply('welcome ' + ctx.from.first_name +'. Please use /help to see the commands');


});
bot.command(['monitor', 'Monitor'], (ctx) => {
   

    let region = parseInt(ctx.message.text.slice(8));
    console.log(region);
    
    if (region) {
        
        ctx.reply('monitoring has started on region ' + ctx.message.text.slice(8));
        monitorStart(ctx, region);
    }
    else {
        ctx.reply('monitoring needs a region');
    }

    
}); 
bot.command(['check', 'Check'], ctx => { 

    console.log((ctx.message.text).slice(7));
    sitequery(ctx, (ctx.message.text).slice(7));
    ctx.reply('checking site... wait a moment');
});
bot.command(['status', 'Status'], (ctx) => {
    status(ctx);
    

});

bot.command(['shortstatus', 'Shortstatus'], (ctx) => {
    shortStatus(ctx);
    

});
//// codigo de prueba 

let x = {
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

    let message = util.inspect(x, { compact: false, depth: 2 });
    ctx.reply(message);
});

bot.command(['help', 'Help'], ctx => {
    ctx.reply('commands: \n /check [Site_code]\n /status \n /shortstatus \n /test \n /help');
});




bot.launch();