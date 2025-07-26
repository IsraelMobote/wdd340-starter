const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildDetailView = async function (data) {
    let detailHTML = '<div class="detailHTML">'
    detailHTML += '<img src="' + data.inv_image +
        '" title="' + data.inv_make + data.invModel + ' Vehicle on CSE 340 vehicles"' + '/>'
    detailHTML += '<div class="description">'
    detailHTML += '<p> <span>Vehicle Make: </span>' + data.inv_make + '</p>'
    detailHTML += '<p> <span>Vehicle Model: </span> ' + data.inv_model + '</p>'
    detailHTML += '<p>  <span>Price: </span>$' + parseInt(data.inv_price).toLocaleString() + '</p>'
    detailHTML += '<p>  <span>Mileage: </span>' + data.inv_miles.toLocaleString() + '</p>'
    detailHTML += '<p>  <span>Year: </span>' + data.inv_year + '</p>'
    detailHTML += '<p>  <span>Description: </span>' + data.inv_description + '</p>'
    detailHTML += '</div>'
    detailHTML += '</div>'

    return detailHTML
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util