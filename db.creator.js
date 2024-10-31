const connection = require("./db.connection");

const createTableQuery = (tableName, schema) => {
    return ` CREATE TABLE IF NOT EXISTS ${tableName} (
        ${schema}
    )
`};
const createTableIfNotExists = (sqlQuery) => {
    return (req, res, next) => {
        connection.query(sqlQuery, (err, result) => {
            if (err) {
                res.status(400).json({ message: 'Error Creating Table'});
            } else {
                next();
            }
        })
    }
}

module.exports = {createTableIfNotExists, createTableQuery}