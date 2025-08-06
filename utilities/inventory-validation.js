const { Result } = require("pg")
const util = require(".")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")
const validate = {}


/*  **********************************
  *  Add Classification Data Validation Rules
  * ********************************* */
validate.addClassificationRules = () => {
    return [
        // valid email is required and cannot already exist in the DB
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isAlphanumeric()
            .withMessage("A valid classification name is required."),

    ]
}


/*  **********************************
  *  Add Inventory Data Validation Rules
  * ********************************* */
validate.addInventoryRules = () => {
    return [
        // valid classification_id is required
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("A valid classification is required."),

        // valid inv_make is required
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("A valid inventory make is required."),

        // valid inv_model is required
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("A valid inventory model is required."),

        // valid inv_year is required
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("A valid inventory year is required."),

        // valid inv_description is required
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("A valid inventory description is required."),

        // valid inv_price is required
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("A valid inventory price is required."),

        // valid inv_miles is required
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("A valid inventory miles is required."),

        // valid inv_color is required
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("A valid inventory color is required."),

    ]
}

/* ******************************
 * Check data and return errors or continue to add new classification
 * ***************************** */
validate.checkAddClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    console.log(errors);
    if (!errors.isEmpty()) {
        let nav = await util.getNav()
        res.render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors,
            classification_name
        })
        return
    }
    next()
}


/* ******************************
 * Check data and return errors or continue to add new inventory
 * ***************************** */
validate.checkAddInventoryData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await util.getNav()
        let selectList = await util.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            errors,
            selectList,
            inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color
        })
        return
    }
    next()
}

module.exports = validate