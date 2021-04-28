const fs = require("fs");
const superagent = require("superagent");

// building promises
// since the dog.ceo API was changed this function isn't needed
const readFile = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

const writeFile = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) return reject("not saved");
      resolve("saved");
    });
  });
};

// road to the call back hell
// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`breed: ${data}`);
//   superagent.get(`https://dog.ceo/api/breeds/image/random`).end((err, res) => {
//     if (err) return console.log(err.message);
//     console.log(res.body.message);
//     fs.writeFile("dog-img.txt", res.body.message, (err) => {
//       console.log("saved");
//     });
//   });
// });

// refactored into promises
// superagent
//   .get(`https://dog.ceo/api/breeds/image/random`)
//   .then((res) => writeFile("dog-img.txt", res.body.message))
//   .catch((err) => console.log(err.message));

// refactored into async/await
// an async func automatically returns a promise and the resolved func of this promise
// returns the value of the async func
const getDog = async () => {
  try {
    // gather all promises and then resolve all of them at the same time
    const res = superagent.get(`https://dog.ceo/api/breeds/image/random`);
    const res1 = superagent.get(`https://dog.ceo/api/breeds/image/random`);
    const res2 = superagent.get(`https://dog.ceo/api/breeds/image/random`);
    const res3 = superagent.get(`https://dog.ceo/api/breeds/image/random`);

    // put it all in one array
    const resArr = await Promise.all([res, res1, res2, res3]);
    // prepare response for saving
    const messages = resArr.map((i) => i.body.message);

    await writeFile("dog-img.txt", messages.join("\n"));
    console.log("dog saved");
  } catch (err) {
    console.log(err);
    // without throwing an error getDog will return success
    throw "woops not this time";
  }
  return "SUCCESS!";
};

//getDog();

(async () => {
  try {
    console.log("statement 1");
    const suc = await getDog();
    console.log(suc);
    console.log("statement 3");
  } catch (err) {
    console.log("errorrro");
  }
})();
