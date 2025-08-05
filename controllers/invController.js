const invModel = require("../models/inventory-model")
const Util = require("../utilities/")
const utilities = require("../utilities/")

const invCont = {}



/* ***************************
 *  Build Management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "*Welcome to the Management View")
    res.render("./inventory/management", {
        title: "Management View",
        nav,
    }
    )
}


invCont.buildAddClassificationView = async function (req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "*Welcome to the Add Classification View")
    res.render("./inventory/add-classification", {
        title: "Add Classification View",
        nav,
        errors: null,
        classification_name: null
    }
    )
}


invCont.buildAddInventoryView = async function (req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "*Welcome to the Add Inventory View")
    res.render("./inventory/add-inventory", {
        title: "Add Inventory View",
        nav,
        errors: null,
        inv_make: null, inv_model: null, inv_year: null, inv_description: null,
        inv_price: null, inv_miles: null, inv_color: null
    }
    )
}

invCont.AddNewClassification = async function (req, res) {
    let nav = await utilities.getNav()
    const { classification_name } = req.body

    const addClassificationResult = await invModel.addClassification(classification_name)

    if (addClassificationResult) {
        req.flash("notice", "*a new classification has been added")
        res.status(201).render("inventory/management", {
            title: "Management View",
            nav
        })

    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("inventory/add-classification", {
            title: "Add Classification",
            nav
        })
    }
}

invCont.AddNewInventory = async function (req, res) {
    let nav = await utilities.getNav()
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body

    const addInventoryResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)

    if (addInventoryResult) {
        req.flash("notice", "*a new inventory has been added")
        res.status(201).render("inventory/management", {
            title: "Management View",
            nav
        })

    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("inventory/add-inventory", {
            title: "Add Inventory",
            nav
        })
    }
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

invCont.buildDetailViewByInvId = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getItemDataByInventoryId(inv_id)
    const detailHTML = await utilities.buildDetailView(data)
    let nav = await utilities.getNav()
    const inv_make = data.inv_make
    const inv_model = data.inv_model
    res.render("./inventory/detail", {
        title: inv_make + ' ' + inv_model,
        nav,
        detailHTML
    })
}

// this is a function that has an internal error so that the link 
// in the footer partials will show a server error when clicked

invCont.footerError = async function (req, res) {
    let number = 5

    // error line below, the method of invModel is not typed correctly
    num = invModel.getItemDataByInveyId(number)

    let nav = await utilities.getNav()
    res.render("index", { title: "Home", nav })
}

module.exports = invCont