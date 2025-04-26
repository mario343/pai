const express = require("express");
const router = express.Router();
const controller = require("../controllers/bidController");

router.get("/", controller.index);
router.get("/bids", controller.listActive);
router.get("/bids/closed", controller.listClosed);
router.get("/bids/new", controller.showAddBid);
router.post("/bids/new", controller.addBid);
router.get("/bids/:id", controller.showBid);
router.get("/bids/:id/offer", controller.showOfferForm);
router.post("/bids/:id/offer", controller.submitOffer);

module.exports = router;
