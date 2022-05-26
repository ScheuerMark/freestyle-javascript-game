function checkIfAllFieldValid(){
    let fields = document.getElementsByClassName("field");
    console.log("check");
    //fields.forEach(field => {if(!checkIfFieldValid(field,fields)){return false;}});
    let valid = true;
    for (const field of fields){
        if(!checkIfFieldValid(field,fields)){valid = false;}
    }
    if (valid) {
        showWinMessage();
    }
    return valid;
}

function checkIfFieldValid(field,fields){
    let fieldValues = getRelatedFieldValues(field,fields);
    field.classList.remove("wrong")
    if(fieldValues.row.filter(item => item === field.innerHTML && item !== "").length > 1 ||
        fieldValues.col.filter(item => item === field.innerText && item !== "").length > 1){console.log("asd");field.classList.add("wrong");return false};
    if(fieldValues.block.filter(item => item === field.innerText && item !== "").length > 1){field.classList.add("wrong");return false};
    if(fieldValues.row.includes("") || fieldValues.col.includes("")){return false};

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