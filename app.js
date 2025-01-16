const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./moduls/replaceTemplate');

const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8'
);

const tempCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    'utf-8'
);

const tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf-8'
);

const productFile = fs.readFileSync(`${__dirname}/data/products.json`, 'utf-8');
const products = JSON.parse(productFile);

const slugs = products.map(el => slugify(el.productName, {lower: true}));

console.log(slugs);

const server = http.createServer((req,res) => {
  const {query, pathName} = url.parse(req.url, true);  

  if(pathName === '/' || pathName === '/overview'){
    res.writeHead(200, {
        'content-type': 'text/html'
    });

    const cardsHtml = products.map(el=>replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS}', cardsHtml);
        res.end(output)
  }else if (pathName === '/product'){
    res.writeHead(200, {
        'content-type': 'text/html'
    });
    const product = products[query.id];
    const output = replaceTemplate(tempProduct, product)
    res.end(output);
  }
})

server.listen(8000, 'localhost', () => {
    console.log('Server up')
})
