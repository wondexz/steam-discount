const { SpesteDB } = require("resthaven")
const db = new SpesteDB({ path: "src/db/database.json" })

module.exports = db;