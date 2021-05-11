const express = require("express");
const {
  getAllTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
} = require("../controllers/toursController");

const router = express.Router();

// middleware that helps pars url parameters

router.route("/").get(getAllTours).post(createTour);
router.route("/stats").get(getTourStats);
router.route("/top-five").get(aliasTopTours, getAllTours);
router.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;
