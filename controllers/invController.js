const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

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

module.exports = invCont