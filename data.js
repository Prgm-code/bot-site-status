const {sendMessage} = require('./telegraf.js');
const  { arrCompare } = require('./arrCompare.js');
const util = require('util');
const localStorage = require('localStorage');

let key = ['Region: ', 'Comuna: ', 'Sitio: ', 'Codigo: ', 'OOS: ', 'IC1: ', 'VIP: ', 'Localida Obligatoria: ', 'Bandas 2G: ', 'Tecnologias 3G: ', 'Tecnologias LTE: ', 'Afectacion en 2G: ', 'Afectacion en 3G: ', 'Afectacion en LTE: ', '% Afectacion 2G: ', ' % Afectacion 3G: ', ' % afectacion LTE: '];


newOOSSites= [  ];

const filterArray = function (array , ctx) {
    let i = 0;
    let newArray = [];
    let  sitesOOS = JSON.parse(localStorage.getItem('siteOOS'))?? {};

    for (item of array) {
        if (item !== '') {

           let obj = [ key[i], item,];
           
           
           
           
           
            newArray[i] = obj.toString().replace(/,/g, ' ');  
        }

        i++;
        if (i==4) {site = item};
    } // fin de for 
    let filterArray = newArray.filter(function (el) {
        return el != null;
    });
    console.log(site);

    newOOSSites.push(site);



    
    if (sitesOOS[site]) {
        console.log('site ya existe');
        

        let compare =  arrCompare(sitesOOS[site],filterArray);
        
        if (compare) { 
            console.log('no hay cambios');
            return ;
        } else {
            console.log('hay cambios');
            sitesOOS[site] = filterArray;
            console.log(sitesOOS);
            localStorage.setItem('siteOOS', JSON.stringify(sitesOOS));
            return filterArray;
        }
    } else {
        console.log('site no existe');
        sitesOOS[site] = filterArray;
        localStorage.setItem('siteOOS', JSON.stringify(sitesOOS));
        console.log(sitesOOS);
        return filterArray;
    }   

 

   


  
}

const sitesCanceled = function () {
    let keysitesOOS = Object.keys(JSON.parse(localStorage.getItem('siteOOS')))
    console.log(keysitesOOS);
    console.log('newOOSSites',newOOSSites);

    let sitesCancel = keysitesOOS.filter(function (el) {
        return !newOOSSites.includes(el);   
    });
    console.log('listando sitios cancelados');
    console.log(sitesCancel);

    

    for (let i= 0 ; i < sitesCancel.length; i++) {
        let site = sitesCancel[i];
        let sitesOOS = JSON.parse(localStorage.getItem('siteOOS'));
        delete sitesOOS[site];
        localStorage.setItem('siteOOS', JSON.stringify(sitesOOS));
       
    }
    console.log('sitios en localstorage');
    console.log(Object.keys(JSON.parse(localStorage.getItem('siteOOS'))));
    newOOSSites = [];
    return sitesCancel;


    /* for (let i = 0; i < keysitesOOS.length; i++) {
        if (!newOssSites.includes(keysitesOOS[i])) {
            console.log(keysitesOOS[i]);



            let sitesOOS = JSON.parse(localStorage.getItem('siteOOS'));
            delete sitesOOS[keysitesOOS[i]];
            localStorage.setItem('siteOOS', JSON.stringify(site));
        }
    }
     */

    

}
exports.sitesCanceled = sitesCanceled;
exports.filterArray = filterArray; 