const { JsonDatabase } = require("wio.db")
const db = new JsonDatabase({ databasePath: "src/db/database.json" })

module.exports = db;
