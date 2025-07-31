const express = require("express")
const router = new express.Router()
const util = require("../utilities/index")
const acctController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get("/login", util.handleErrors(acctController.buildLogin));
router.get("/register", util.handleErrors(acctController.buildRegister));

//route for the post method in the register view form
router.post("/register", 
    regValidate.registationRules(),
    regValidate.checkRegData, 
    util.handleErrors(acctController.registerAccount));

module.exports = router;