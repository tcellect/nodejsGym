const express = require("express");
const fs = require("fs");
const morgan = require("morgan");

const app = express();

// it's sync because it's out of even loop
const toursSimple = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// middleware is every function along the way of getting a req, and sending a res
// so order of calling functions matters a lot
// without next function the req/res cycle will stuck
// resulting in not sending anything back
app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
  req.reqTime = new Date().toISOString();
  next();
});

// HANDLERS
// tours
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

// users

const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "rout in development",
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "rout in development",
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "rout in development",
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "rout in development",
  });
};

const getUserById = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "rout in development",
  });
};

// ROUTS

const toursRouter = express.Router();
const usersRouter = express.Router();

// tours
toursRouter.route("/").get(getAllTours).post(createTour);
toursRouter.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

// users
usersRouter.route("/").get(getAllUsers).post(createUser);
usersRouter.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

app.use("/api/v1/tours/", toursRouter);
app.use("/api/v1/users/", usersRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`listening on port: ${PORT}...`));
