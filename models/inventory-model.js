const pool = require("../database/")

/* ***************************************
 * Get all classification data
 * **************************************/

async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

async function getItemDataByInventoryId(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory As p
            WHERE P.inv_id = $1`,
            [inv_id]
        )
        console.log(data.rows[0])
        return data.rows[0]
    }
    catch (error) {
        console.error("getItemDataByInventoryId error " + error)
    }
}

module.exports = { getClassifications, getInventoryByClassificationId, getItemDataByInventoryId }