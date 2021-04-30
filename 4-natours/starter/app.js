const express = require("express");
const fs = require("fs");

const app = express();

// middleware to parse req body
app.use(express.json());

// reqeust handlers
const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: toursSimple.length,
    data: {
      tours: {
        toursSimple,
      },
    },
  });
};

const getTourById = (req, res) => {
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
};

const updateTour = (req, res) => {
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
};

const deleteTour = (req, res) => {
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
};

const createTour = (req, res) => {
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
};

// it's sync because it's out of even loop
const toursSimple = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.route("/api/v1/tours").get(getAllTours).post(createTour);
app
  .route("/api/v1/tours/:id")
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

const PORT = 5000;
app.listen(PORT, () => console.log(`listening on port: ${PORT}...`));
