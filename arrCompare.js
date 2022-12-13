

const arrCompare = function (arr1, arr2) {
        console.log('arr1',arr1);
        console.log('arr2',arr2);
        if (arr1.length != arr2.length) {
            return false;
        }
            //arr1.length -1 esto para no comparar la fecha
        for (let i = 0; i < arr1.length-1; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
    
        return true;
    }

exports.arrCompare = arrCompare;

