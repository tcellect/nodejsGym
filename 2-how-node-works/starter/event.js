const eventEmmiter = require("events");


// best practice is to extend emmiter
class Sales extends eventEmmiter {
  constructor() {
    super();
  }
}

const myEmmiter = new Sales();

myEmmiter.on("newSale", () => console.log("sale occured"));

myEmmiter.on("newSale", () => console.log("Cutomer name: Denis"));
myEmmiter.on("newSale", (stock) => console.log("items in stock: ", stock));

myEmmiter.emit("newSale", 9);
