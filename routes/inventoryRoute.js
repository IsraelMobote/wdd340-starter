const Util = require("../utilities/index")

// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", Util.handleErrors(invController.buildDetailViewByInvId));
router.get("/footerError", Util.handleErrors(invController.footerError));

module.exports = router;