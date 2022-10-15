let key = ['Region', 'Comuna', 'Sitio', 'Codigo', 'OOS', 'IC1', 'VIP', 'Localidad Obligatoria', 'Bandas 2G', 'Tecnologias 3G', 'Tecnologias LTE', 'Afectacion en 2G', 'Afectacion en 3G', 'Afectacion en LTE', '% 2G', ' % 3G', ' % LTE'];


export function filterArray(array) {
    let i = 0;
    let newArray = [];
    for (item of array) {
        if (item !== '') {

            newArray[i] = [item, key[i]];  
        }

        i++;
        
    }
    return newArray;

}