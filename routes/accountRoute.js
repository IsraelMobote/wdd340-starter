const express = require("express")
const router = new express.Router()
const util = require("../utilities/index")
const acctController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get("/",
    util.checkLogin,
    util.handleErrors(acctController.buildAccountView));
router.get("/login", util.handleErrors(acctController.buildLogin));
router.get("/register", util.handleErrors(acctController.buildRegister));
router.get("/logout", util.handleErrors(acctController.logOut));

//route for the post method in the register view form
router.post("/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    util.handleErrors(acctController.registerAccount));

//route for the post method in the login view form
router.post("/login",
    regValidate.LoginRules(),
    regValidate.checkLoginData,
    util.handleErrors(acctController.accountLogin)
)

module.exports = router;