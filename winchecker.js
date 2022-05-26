function checkIfAllFieldValid(){
    let fields = Array.from(document.getElementsByClassName("field"));
    console.log("check");
    //fields.forEach(field => {if(!checkIfFieldValid(field,fields)){return false;}});
    for (let field of fields){
        if(!checkIfFieldValid(field,fields)){return false;}
    }
    return true;
}

function checkIfFieldValid(field,fields){
    let fieldValues = getRelatedFieldValues(field,fields);
    if(fieldValues.row.includes("") || fieldValues.col.includes("")){return false};
    if(new Set(fieldValues.row).size !== fieldValues.row.length || new Set(fieldValues.col).size !== fieldValues.col.length){return false};
    if(new Set(fieldValues.block).size !== fieldValues.block.length){return false};
    return true;

}

function getRelatedFieldValues(field,fields){
    let relatedFields = getRelatedFields(field,fields);
    relatedFields.row = Array.from(relatedFields.row).map(item => item.innerHTML);
    relatedFields.col = Array.from(relatedFields.col).map(item => item.innerHTML);
    relatedFields.block = Array.from(relatedFields.block).map(item => item.innerHTML);
    return relatedFields;

}

function getRelatedFields(field,fields,width=9){
    let fieldIndex =Array.from(fields).indexOf(field);
    let rowIndex = Math.floor(fieldIndex / width);
    let collIndex = fieldIndex % width;
    return {row :getRow(field,fields,rowIndex),
            col : getColl(field,fields,collIndex),
            block : getBlock(field,fields,rowIndex,collIndex)}
}

function getRow(field,fields,rowIndex,width=9){
    return document.querySelectorAll(`.field:nth-child(n+${1+(width*rowIndex)}):nth-child(-n+${(rowIndex+1)*9})`)
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