const fs = require("fs");
const http = require("http");
const url = require("url");
const prepareTempl = require("./modules/prepareTempl.js")

const PORT = 8000;
const BASE_URL = `http://localhost:${PORT}/`;

// fetch data
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const card = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const overview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const product = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

// prepare data for serving
const dataObj = JSON.parse(data);


// SERVER
const server = http.createServer((req, res) => {
  const url = new URL(req.url, BASE_URL);
  const id = url.searchParams.get("id");

  // HOME PAGE
  if (url.pathname === "/" || url.pathname === "/overview") {
    const cards = dataObj.map((prod) => prepareTempl(prod, card)).join("");
    const output = overview.replace("{%PRODUCT_CARDS%}", cards);
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(output);
  }

  // PRODUCT PAGE
  else if (url.pathname === "/product") {
    const prod = dataObj[id];
    const setTempl = prepareTempl(prod, product);
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(setTempl);
  }

  // API
  else if (url.pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    console.log(dataObj);
    res.end(dataObj);
  }

  // PAGE NOT FOUND
  else {
    res.writeHead(404);
    res.end("page not found");
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("listening to port 8000");
});
