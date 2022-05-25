function checkIfAllFieldValid(){
    let fields = document.getElementsByClassName("field");
    fields.forEach( field => {if(!checkIfFieldValid(field,fields)){return false}});
}

function checkIfFieldValid(field,fields){
    let fieldValues = getRelatedFieldValues(field,fields);

    if(fieldValues.row.includes("") || fieldValues.col.includes("")){return false};
    if(new Set(fieldValues.row).size !== fieldValues.row.length || new Set(fieldValues.col).size !== fieldValues.col.length){return false};
    return (new Set(fieldValues.block).size === fieldValues.block.length);

}

function getRelatedFieldValues(field,fields){
    let relatedFields = getRelatedFields(field,fields);
    return relatedFields.map(item => Array.from(item).map(i => i.innerHTML));

}

function getRelatedFields(field,fields){
    let fieldIndex =Array.from(fields).indexOf(field);
    let rowIndex = Math.floor(fieldIndex / width);
    let collIndex = fieldIndex % width;
    return {row :getRow(field,fields,rowIndex),
            col : getColl(field,fields,collIndex),
            block : getBlock(field,fields,rowIndex,collIndex)}
}

function getRow(field,fields,rowIndex,width=9){
    return document.querySelectorAll(`.field:nth-child(n+${1+rowIndex}):nth-child(-n+${width+rowIndex})`)
}

function getColl(field,fields,collIndex,width=9){
    return document.querySelectorAll(`.field:nth-child(9n-${width-(collIndex+1)})`)

}

function getBlock(field,fields,rowIndex,collIndex, width=9){
    let boxRowIndex = Math.floor(rowIndex / Math.sqrt(width));
    let boxCollIndex = Math.floor(collIndex / Math.sqrt(width));

    return document.querySelectorAll(`
                        .field:nth-child(9n+${(boxCollIndex*3+1)+(boxRowIndex*27)}):nth-child(-n+${(boxRowIndex+1)*27}),
                        .field:nth-child(9n+${boxCollIndex*3+2+(boxRowIndex*27)}):nth-child(-n+${(boxRowIndex+1)*27}),
                        .field:nth-child(9n+${boxCollIndex*3+3+(boxRowIndex*27)}):nth-child(-n+${(boxRowIndex+1)*27})`)
}