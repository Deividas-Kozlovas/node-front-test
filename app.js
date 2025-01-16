// Importing necessary modules
const fs = require("fs"); // To work with file system (reading files)
const http = require("http"); // To create an HTTP server
const url = require("url"); // To work with URLs, parse query parameters, etc.
const slugify = require("slugify"); // To generate slugs (URL-friendly versions of strings)
const replaceTemplate = require("./moduls/replaceTemplate"); // A custom module for replacing placeholders in HTML templates

// Reading the HTML template files (overview, card, and product details)
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`, // Path to overview template
  "utf-8" // Reading as a UTF-8 encoded string
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`, // Path to the card template
  "utf-8" // Reading as a UTF-8 encoded string
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`, // Path to the product detail template
  "utf-8" // Reading as a UTF-8 encoded string
);

// Reading and parsing the product data from a JSON file
const productFile = fs.readFileSync(`${__dirname}/data/products.json`, "utf-8"); // Read the JSON file
const products = JSON.parse(productFile); // Parse the JSON data into a JavaScript array

// Generate slugs for each product using its product name (converts to lowercase and replaces spaces with hyphens)
const slugs = products.map((el) => slugify(el.productName, { lower: true }));

// Create the HTTP server to handle requests
const server = http.createServer((req, res) => {
  // Parse the URL and extract query parameters (like id) and pathname
  const { query, pathname } = url.parse(req.url, true);

  // Handle requests for the homepage or overview page
  if (pathname === "/" || pathname === "/overview") {
    // Send a 200 OK response with the content-type as HTML
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    // Create HTML for product cards by mapping each product to a card template
    const cardsHtml = products
      .map((el) => replaceTemplate(tempCard, el)) // Replace placeholders in the card template with product data
      .join(""); // Join the array of HTML strings into a single string

    // Replace the placeholder in the overview template with the actual cards
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output); // Send the output HTML to the client
  }
  // Handle requests for a specific product detail page
  else if (pathname === "/product") {
    // Send a 200 OK response with the content-type as HTML
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    // Retrieve the product by its ID from the query parameter
    const product = products[query.id];
    if (!product) {
      // If no product found, send a 404 response and display an error message
      res.writeHead(404, {
        "Content-Type": "text/html",
      });
      res.end("<h1>Product not found</h1>");
      return;
    }

    // Generate the HTML for the product page by replacing placeholders in the product template
    const output = replaceTemplate(tempProduct, product);
    res.end(output); // Send the generated product page HTML to the client
  }
  // Handle requests for pages that don't exist
  else {
    // Send a 404 response if the page is not found
    res.writeHead(404, {
      "Content-Type": "text/html",
    });
    res.end("<h1>Page not found</h1>");
  }
});

// Start the server and listen on port 8000 at localhost
server.listen(8000, "localhost", () => {
  console.log("Server up"); // Log a message when the server starts
});
