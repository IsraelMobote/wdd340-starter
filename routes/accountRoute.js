const express = require("express")
const router = new express.Router()
const util = require("../utilities/index")
const acctController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get("/",
    util.checkLogin,
    util.handleErrors(acctController.buildAccountView));
router.get("/login", util.handleErrors(acctController.buildLogin));
router.get("/admin-login", util.handleErrors(acctController.buildAdminLogin));
router.get("/register", util.handleErrors(acctController.buildRegister));
router.get("/logout", util.handleErrors(acctController.logOut));
router.get("/update/:account_id", util.handleErrors(acctController.buildUpdateView));
router.get("/delete/:account_id", util.handleErrors(acctController.buildDeleteView));

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

//route for the post method in the update view account-update form
router.post("/account-update",
    regValidate.updateRules(),
    regValidate.checkUpdateData,
    util.handleErrors(acctController.updateAccount)
)

//route for the post method in the update view change-password form
router.post("/change-password",
    regValidate.changePasswordRules(),
    regValidate.checkUpdateData,
    util.handleErrors(acctController.changePassword)
)

//route for the post method in the admin login view
router.post("/admin-login",
    regValidate.LoginRules(),
    regValidate.checkAdminLoginData,
    util.handleErrors(acctController.buildAdminManagementView)
)

module.exports = router;