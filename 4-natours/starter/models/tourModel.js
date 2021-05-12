const mongoose = require("mongoose");

const toursSchema = new mongoose.Schema(
  {
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
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "difficulty is: either easy, medium or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "rating must be above 1"],
      max: [5, "rating must be above 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "a tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this points to a new document on document creation, not update!
          return val < this.price;
        },
        message: "disscount must be lower than the price",
      },
    },
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
  },

  // model settings
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// can't be used in a query since it's not a part of schema, just an abstraction
// remember: fat models, thin controllers
toursSchema.virtual("durationWeeks").get(function () {
  // this refers to current object
  return this.duration / 7;
});

// mongoose middleware
// runs before or after mongoose events

// DOCUMENT middleware runs on save() and create()
// toursSchema.pre("save", function (next) {
//   // DO IMPORTANT STUFF
//   next();
// });

// toursSchema.post("save", function (doc, next) {
//   // DO IMPORTANT STUFF
//   next();
// });

const Tour = mongoose.model("Tours", toursSchema);

module.exports = Tour;
