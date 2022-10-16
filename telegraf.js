
const {Telegraf } = require('telegraf');
const dotenv = require('dotenv');
const util = require('util');
const timer = util.promisify(setTimeout);


dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
let sendArr = async function(arr,ctx) {
    try {

        

        for (let i = 0; i < arr.length; i ++) {
            await bot.telegram.sendMessage(ctx.chat.id ,arr[i])
            await timer(3000);

        }
        
                
        
    } 
    catch(e) 
    {
        console.log(e);
    }
};

let sendMessage = async function(text,ctx) {
    try {

      
        await bot.telegram.sendMessage(ctx.chat.id ,text)
        await timer(3000);

        }
        
                
        
    
    catch(e) 
    {
        console.log(e);
    }
};


let sendphoto = async function(ctx) {
    try {
                
        await bot.telegram.sendPhoto(ctx.chat.id ,{source: 'site.png'})
        await timer(3000);
    } 
    catch(e) 
    {
        console.log(e);
    }
};

exports.sendPhoto = sendphoto;
exports.bot = bot;
exports.sendMessage = sendMessage;
exports.sendArr = sendArr;