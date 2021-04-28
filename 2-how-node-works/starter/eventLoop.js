const fs = require("fs");
const crypto = require("crypto");

let start = Date.now();

// these timers aren't yet in an event loop
setTimeout(() => {
  console.log("timer 1 finished");
}, 0);
setImmediate(() => {
  console.log("immidiate 1 finished");
});

// these timers are in the event loop
fs.readFile("./test-file.txt", () => {
  console.log("reading file finished");
  console.log("************************");

  setTimeout(() => {
    console.log("timer 2 finished");
  }, 0);
  setTimeout(() => {
    console.log("timer 2 delayed finished");
  }, 3000);

  // fires before any timers expire. Executerd once per tick
  setImmediate(() => {
    console.log("immidiate 2 finished");
  });

  // part of a micro-process that fires after each phase. So here it rans in a phase before setImmidiate
  // executed immidiately
  process.nextTick(() => console.log("tick-tick"));

  // These go to thread pool. Moves heavy processing off the event loop. Defual thread pool size is 4 threads.
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log("password enctypted in time: ", Date.now() - start);
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log("password enctypted in time: ", Date.now() - start);
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log("password enctypted in time: ", Date.now() - start);
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log("password enctypted in time: ", Date.now() - start);
  });

  // here it waits for one thread to return
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log("password enctypted in time: ", Date.now() - start);
  });
});

console.log("hello from the top level code!");
