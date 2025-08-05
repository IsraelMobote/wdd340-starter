const Util = require("../utilities/index")
const inv_Validate = require("../utilities/inventory-validation")

// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

router.get("/", Util.handleErrors(invController.buildManagementView));
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", Util.handleErrors(invController.buildDetailViewByInvId));
router.get("/footerError", Util.handleErrors(invController.footerError));
router.get("/add-inventory", Util.handleErrors(invController.buildAddInventoryView));
router.get("/add-classification", Util.handleErrors(invController.buildAddClassificationView));

// route with "post" as method
router.post("/add-classification",
    inv_Validate.addClassificationRules(),
    inv_Validate.checkAddClassificationData,
    Util.handleErrors(invController.AddNewClassification)
);

router.post("/add-inventory",
    inv_Validate.addInventoryRules(),
    inv_Validate.checkAddInventoryData,
    Util.handleErrors(invController.AddNewInventory)
);

module.exports = router;