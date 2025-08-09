const invModel = require("../models/inventory-model")
const Util = require("../utilities/")
const utilities = require("../utilities/")

const invCont = {}



/* ***************************
 *  Build Management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    const selectList = await utilities.buildClassificationList()
    req.flash("notice", "Welcome to the Inventory Management View")
    res.render("./inventory/management", {
        title: "Management View",
        nav,
        selectList,
    }
    )

}

/**
 * function check if the user is either Employee or Admin 
 * and if positive move to the next function
 */
invCont.checkUser = async function (req, res, next) {
    try {
        const account_type = res.locals.accountData.account_type
        if (account_type == 'Employee' || account_type == 'Admin') {
            next()
        }
        else {
            let nav = await utilities.getNav()
            const selectList = await utilities.buildClassificationList()
            req.flash("notice", "Please login with the details or an Employee or Admin Account")
            res.render("./account/login", {
                title: "Login",
                nav,
                selectList,
                errors: null
            }
            )
        }
    } catch (error) {
        console.log(error)
        req.flash("notice", "Please login with the details or an Employee or Admin Account")
        res.redirect("/account/login")
    }

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

// code to build the view to add inventory items
invCont.buildAddInventoryView = async function (req, res, next) {
    let nav = await utilities.getNav()
    let selectList = await utilities.buildClassificationList()
    req.flash("notice", "*Welcome to the Add Inventory View")
    res.render("./inventory/add-inventory", {
        title: "Add Inventory View",
        nav,
        errors: null,
        selectList,
        inv_make: null, inv_model: null, inv_year: null,
        inv_description: null, inv_price: null, inv_miles: null, inv_color: null
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

    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body

    const addInventoryResult = await invModel.addInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
    let selectList = await utilities.buildClassificationList(classification_id)

    if (addInventoryResult) {
        req.flash("notice", `${inv_make} ${inv_model} inventory has been added`)
        res.status(201).render("inventory/management", {
            title: "Management View",
            nav,
            selectList
        })

    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            selectList,
            inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

// code to build the view to edit inventory items
invCont.buildEditInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const data = await invModel.getItemDataByInventoryId(inv_id)
    const itemName = `${data.inv_make} ${data.inv_model}`
    let selectList = await utilities.buildClassificationList(data.classification_id)
    req.flash("notice", "Update Inventory Item")
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        errors: null,
        selectList,
        inv_id: data.inv_id,
        inv_make: data.inv_make,
        inv_model: data.inv_model,
        inv_year: data.inv_year,
        inv_description: data.inv_description,
        inv_price: data.inv_price,
        inv_miles: data.inv_miles,
        inv_color: data.inv_color,
        inv_image: data.inv_image,
        inv_thumbnail: data.inv_thumbnail,
        classification_id: data.classification_id
    }
    )
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.UpdateInventory = async function (req, res) {
    let nav = await utilities.getNav()

    const { inv_id, classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body

    const updateResult = await invModel.updateInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id);
    console.log(updateResult)
    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully updated`)
        res.redirect("/inv/")

    } else {
        let selectList = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            errors: null,
            selectList: selectList,
            inv_id, inv_image, inv_thumbnail, classification_id,
            inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color
        })
    }
}

// code to build the view to confirm the inventory item to be deleted
invCont.buildDeleteInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const data = await invModel.getItemDataByInventoryId(inv_id)
    const itemName = `${data.inv_make} ${data.inv_model}`

    res.render("./inventory/delete-confirm", {
        title: "Delete " + itemName,
        nav,
        errors: null,
        inv_id: data.inv_id,
        inv_make: data.inv_make,
        inv_model: data.inv_model,
        inv_year: data.inv_year,
        inv_price: data.inv_price,
    }
    )
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventory = async function (req, res) {
    let nav = await utilities.getNav()
    const { inv_id, inv_make, inv_model } = req.body

    const deleteResult = await invModel.deleteInventory(inv_id);
    console.log(deleteResult)
    if (deleteResult) {
        const itemName = inv_make + " " + inv_model
        req.flash("notice", `The ${itemName} was successfully deleted`)
        res.redirect("/inv/")

    } else {
        req.flash("notice", "Sorry, the delete failed.")
        res.redirect(`/inv/delete/:${inv_id}`)
    }

}

module.exports = invCont