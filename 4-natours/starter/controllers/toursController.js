const Tour = require("../models/tourModel");
const APIfeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-ratingsAverage, price";
  req.query.fields = "name, price, ratingAverage, summary, difficulty";
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // BUILD QUERY
  const features = new APIfeatures(Tour.find(), req.query)
    .filter()
    .sorting()
    .fields()
    .pagination();

  // SEND QUERY
  // as soon as the promise below resolves.
  // it will not be possible to chain other queries
  // like pagination, limiting etc
  const allTours = await features.query;
  res.status(200).json({
    status: "success",
    results: allTours.length,
    data: {
      tours: {
        allTours,
      },
    },
  });
});

exports.getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      tours: {
        tour,
      },
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const saveRes = await Tour.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      data: saveRes,
    },
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: {
          $gte: 4.5,
        },
      },
    },
    {
      $group: {
        _id: null,
        numTours: { $sum: 1 },
        numRatings: { $avg: "$ratingsQuantity" },
        avgRatings: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
