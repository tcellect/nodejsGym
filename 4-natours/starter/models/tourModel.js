const mongoose = require("mongoose");

const toursSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "a tour must have a name"],
    // BUG: passing tours with the same name
    unique: [true, "a tour must have a unique name"],
  },
  duration: {
    type: Number,
    required: [true, "a tour must have duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "a tour must have a group size"],
  },
  difficulty: {
    type: String,
    required: [true, "a tour must have difficulty level"],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "a tour must have a price"],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, "a tour must have a summary"],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "a tour must have a cover"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
});

const Tour = mongoose.model("Tours", toursSchema);

module.exports = Tour;
