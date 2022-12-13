const { sendMessage } = require('./telegraf.js');
const { arrCompare } = require('./arrCompare.js');
const util = require('util');
const localStorage = require('localStorage');

let key = ['Region: ', 'Comuna: ', 'Sitio: ', 'Codigo: ', 'OOS: ', 'IC1: ', 'VIP: ', 'Localida Obligatoria: ', 'Bandas 2G: ', 'Tecnologias 3G: ', 'Tecnologias LTE: ', 'Afectacion en 2G: ', 'Afectacion en 3G: ', 'Afectacion en LTE: ', '% Afectacion 2G: ', ' % Afectacion 3G: ', ' % afectacion LTE: '];

newOOSSites = [];

const filterArray = function (array, ctx) {
    let i = 0;
    let newArray = [];
    let date = new Date();
    let dateStr = date.toLocaleString("es-CL", { timeZone: 'America/Santiago' });
    let dateArr = ['Inicio: ', dateStr].toString().replace(/,/g, ' ');
    let sitesOOS = JSON.parse(localStorage.getItem('siteOOS')) ?? {};

    for (item of array) {
        if (item !== '') {

            let obj = [key[i], item,];
            newArray[i] = obj.toString().replace(/,/g, ' ');  //reemplaza las comas por espacios en todos los elementos del array

        }

        i++;
        if (i == 4) { site = item };
    } // fin de for 


    let filterArray = newArray.filter(function (el) {
        return el != null;
    });
    filterArray.push(dateArr);
    console.log(site);

    newOOSSites.push(site);


    if (sitesOOS[site]) {
        console.log('site ya existe');


        let compare = arrCompare(sitesOOS[site], filterArray);

        if (compare) {
            console.log('no hay cambios');
            return;
        } else {
            console.log('hay cambios');
            sitesOOS[site] = filterArray;
            
            localStorage.setItem('siteOOS', JSON.stringify(sitesOOS));
            return filterArray;
        }
    } else {
        console.log('site no existe');
        sitesOOS[site] = filterArray;
        localStorage.setItem('siteOOS', JSON.stringify(sitesOOS));
        
        return filterArray;
    }

}

const sitesCanceled = function () {

    let keysitesOOS = Object.keys(JSON.parse(localStorage.getItem('siteOOS')) ?? {});
    console.log(keysitesOOS);
    console.log('newOOSSites', newOOSSites);

    let sitesCancel = keysitesOOS.filter(function (el) {
        return !newOOSSites.includes(el);
    });

    console.log('listando sitios cancelados');
    console.log(sitesCancel);

    let siteCancelOOS = [];

    for (let i = 0; i < sitesCancel.length; i++) {
        let site = sitesCancel[i];
        let sitesOOS = JSON.parse(localStorage.getItem('siteOOS'));
        let siteOOS = [sitesOOS[site][3], sitesOOS[site][2]];
        console.log(siteOOS);
        delete sitesOOS[site];
        let msg = util.inspect(siteOOS, { showHidden: false, depth: null, compact: false });
        siteCancelOOS.push(msg);
        localStorage.setItem('siteOOS', JSON.stringify(sitesOOS));

    }
    console.log('sitesCancelOOS', siteCancelOOS);
    console.log('sitios en localstorage');
    console.log(Object.keys(JSON.parse(localStorage.getItem('siteOOS')) ?? ('no hay sitios')));
    newOOSSites = [];

    return siteCancelOOS;

}
exports.sitesCanceled = sitesCanceled;
exports.filterArray = filterArray; 