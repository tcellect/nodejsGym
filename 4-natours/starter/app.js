const express = require("express");
const fs = require("fs");

const app = express();

// middleware to parse req body
app.use(express.json());

// it's sync because it's out of even loop
const toursSimple = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const home = app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: toursSimple.length,
    data: {
      tours: {
        toursSimple,
      },
    },
  });
});

// ? makes param optional
app.get("/api/v1/tours/:id", (req, res) => {
  // look up of a post
  const post =
    toursSimple[req.params.id] !== undefined
      ? toursSimple[req.params.id]
      : undefined;

  // send statuses
  if (!post) {
    return res.status(404).json({ status: "fail", message: "id not found" });
  }
  res.status(200).json({
    status: "success",
    data: {
      tours: {
        post,
      },
    },
  });
});

app.patch("/api/v1/tours/:id", (req, res) => {
  // look up of a post
  const post =
    toursSimple[req.params.id] !== undefined
      ? toursSimple[req.params.id]
      : undefined;

  // send statuses
  if (!post) {
    return res
      .status(404)
      .json({ status: "fail", data: { message: "id not found" } });
  }
  res.status(200).json({
    status: "success",
    data: {
      tours: "updated",
    },
  });
});

app.delete("/api/v1/tours/:id", (req, res) => {
  // look up of a post
  const post =
    toursSimple[req.params.id] !== undefined
      ? toursSimple[req.params.id]
      : undefined;

  // send statuses
  if (!post) {
    return res
      .status(404)
      .json({ status: "fail", data: { message: "id not found" } });
  }
  res.status(204).json({
    status: "success",
    data: {
      data: null,
    },
  });
});

app.post("/api/v1/tours", (req, res) => {
  console.log(req.body);
  const newId = toursSimple[toursSimple.length - 1].id + 1;

  // this approach preserves original req.body
  const newTour = Object.assign({ id: newId }, req.body);

  // update current state
  toursSimple.push(newTour);

  // save to a db. Should be async for not blocking the event loop
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursSimple),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
  // always send back a response to finish a request/response cycle
  // res.send("done");
});

const PORT = 5000;
app.listen(PORT, home, () => console.log(`listening on port: ${PORT}...`));
