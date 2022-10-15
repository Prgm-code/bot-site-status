const util = require('util');

let key = ['Region: ', 'Comuna: ', 'Sitio: ', 'Codigo: ', 'OOS: ', 'IC1: ', 'VIP: ', 'Localida Obligatoria: ', 'Bandas 2G: ', 'Tecnologias 3G: ', 'Tecnologias LTE: ', 'Afectacion en 2G: ', 'Afectacion en 3G: ', 'Afectacion en LTE: ', '% Afectacion 2G: ', ' % Afectacion 3G: ', ' % afectacion LTE: '];


const filterArray = function (array) {
    let i = 0;
    let newArray = [];
    for (item of array) {
        if (item !== '') {

            newArray[i] = [ key[i], item,].toString().replace(/,/g, ' ');  
        }

        i++;
        
    }
    let filterArray = newArray.filter(function (el) {
        return el != null;
    });
    return filterArray;

}

exports.filterArray = filterArray; 