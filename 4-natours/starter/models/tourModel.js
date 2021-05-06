const mongoose = require("mongoose");

const toursSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "a tour must have a name"],
    unique: [true, "a tour must have a unique name"],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "a tour must have a price"],
  },
});

const Tour = mongoose.model("Tours", toursSchema);

module.exports = Tour;
