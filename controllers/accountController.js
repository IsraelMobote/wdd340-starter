const Util = require("../utilities/index")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/**
 * Deliver Registration View
 */
async function buildRegister(req, res, next) {
    let nav = await Util.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/**
 * Deliver Login View
 */
async function buildLogin(req, res, next) {
    let nav = await Util.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await Util.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you're registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await Util.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }
        else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}

/**
 * Deliver Account Management View
 */
async function buildAccountView(req, res) {
    let nav = await Util.getNav()
    res.render("account/management", {
        title: "Account View",
        nav,
        errors: null
    })
}

/**
 * function to log the user out of the application and
 *  to delete the jwt token and set the account data to empty space
 */
async function logOut(req, res) {
    res.clearCookie("jwt")
    res.locals.accountData = ''
    res.redirect("/")
}


/**
 * Deliver Account Update View
 */
async function buildUpdateView(req, res) {
    let nav = await Util.getNav()
    const accountId = req.params.account_id
    const accountData = await accountModel.getAccountById(accountId) // model function to get the accountData by account_id

    res.locals.accountData = accountData

    res.render("account/update", {
        title: "Update Account Information",
        nav,
        errors: null,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_id: accountData.account_id
    })
}


/* ****************************************
*  Process Account Update
* *************************************** */
async function updateAccount(req, res) {
    let nav = await Util.getNav()
    const { account_firstname, account_lastname, account_email, account_id } = req.body

    const updateResult = await accountModel.updateAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_id
    )


    if (updateResult) {

        res.clearCookie("jwt")
        let newAccountData = await accountModel.getAccountById(account_id)
        delete newAccountData.account_password

        const accessToken = jwt.sign(newAccountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        if (process.env.NODE_ENV === 'development') {
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }

        res.locals.accountData = newAccountData

        req.flash(
            "notice",
            `Congratulations, you're updated ${newAccountData.account_firstname} account information.`
        )
        res.status(201).render("account/management", {
            title: "Account Management",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/update", {
            title: "Update Account Information",
            nav,
            errors: null
        })
    }
}

/* ****************************************
*  Change Password Process
* *************************************** */
async function changePassword(req, res) {
    let nav = await Util.getNav()
    const { account_password, account_id } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the password change.')
        res.status(500).render("account/update", {
            title: "Update Account Information",
            nav,
            errors: null,
        })
    }
    console.log(hashedPassword)
    console.log(account_id)
    const updatePasswordResult = await accountModel.updatePassword(hashedPassword, account_id)
    let newAccountData = await accountModel.getAccountById(account_id)
    console.log(updatePasswordResult)
    if (updatePasswordResult) {

        res.clearCookie("jwt")
        delete newAccountData.account_password

        const accessToken = jwt.sign(newAccountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        if (process.env.NODE_ENV === 'development') {
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }

        res.locals.accountData = newAccountData

        req.flash(
            "notice",
            `Congratulations, you're updated ${newAccountData.account_firstname} password.`
        )
        res.status(201).render("account/management", {
            title: "Account Management",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the password change failed.")
        res.status(501).render("account/update", {
            title: "Update Account Information",
            nav,
            errors: null,
            account_firstname: newAccountData.account_firstname,
            account_lastname: newAccountData.account_lastname,
            account_email: newAccountData.account_email,
            account_id: newAccountData.account_id
        })
    }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildUpdateView, buildAccountView, logOut, updateAccount, changePassword }