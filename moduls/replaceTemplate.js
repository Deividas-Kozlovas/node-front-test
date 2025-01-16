module.exports = (temp, product) => {
    let output = output.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.productImage);
    output = output.replace(/{%PRICE%}/g, product.productPrice);
    output = output.replace(/{%FROM%}/g, product.productFrom);
    output = output.replace(/{%NUTRIENTS%}/g, product.productNutrients);
    output = output.replace(/{%QUANTITY%}/g, product.productQuantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.productDescription);
    output = output.replace(/{%ID%}/g, product.productId);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

    return output;
}