const fs = require("fs");

const toursSimple = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// check if id is valid
exports.checkId = (req, res, next, id) => {
  const post = toursSimple[id] !== undefined ? toursSimple[id] : undefined;

  if (!post) {
    return res.status(404).json({ status: "fail", message: "id not found" });
  }
  // if id is wrong don't continue processing a req
  next();
};

exports.isValidPostReq = (req, res, next) => {
  const check = req.body.name || req.body.price;

  if (!check) {
    return res
      .status(400)
      .json({ status: "fail", message: "name or price must by in the body" });
  }
  next();
};

exports.getAllTours = (req, res) => {
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

exports.getTourById = (req, res) => {
  // look up of a post
  const post = toursSimple[req.params.id];
  res.status(200).json({
    status: "success",
    data: {
      tours: {
        post,
      },
    },
  });
};

exports.updateTour = (req, res) => {
  // look up of a post
  const post = toursSimple[req.params.id];
  res.status(200).json({
    status: "success",
    data: {
      tours: "updated",
    },
  });
};

exports.deleteTour = (req, res) => {
  // look up of a post
  const post = toursSimple[req.params.id];
  res.status(204).json({
    status: "success",
    data: {
      data: null,
    },
  });
};

exports.createTour = (req, res) => {
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
