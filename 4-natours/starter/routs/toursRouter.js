const express = require("express");
const {
  getAllTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour,
  checkId,
  isValidPostReq,
} = require("../controllers/toursController");

const router = express.Router();

// middleware that helps pars url parameters
router.param("id", checkId);

router.route("/").get(getAllTours).post(isValidPostReq, createTour);
router.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;
