const app = require("express")();
const bodyParser = require("body-parser");
const { createTableQuery, createTableIfNotExists } = require("../db.creator");
const connection = require("../db.connection");
const { selectAllRecords, insertRecord, deleteRecord, updateRecord } = require("../db.helper");

const tableName = 'categories';
const schema = `
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
`;

const tableSql = createTableQuery(tableName, schema);

app.use(bodyParser.json());

module.exports = app;

/**
 * GET endpoint: Get the welcome message for the Category API.
 *
 * @param {Object} req  request object.
 * @param {Object} res  response object.
 * @returns {void}
 */
app.get("/", function (req, res) {
    res.send("Category API");
});

/**
 * GET endpoint: Get details of all categories.
 *
 * @param {Object} req  request object.
 * @param {Object} res  response object.
 * @returns {void}
 */
app.get("/all", createTableIfNotExists(tableSql), async (req, res) => {
    try {
        const [rows] = await connection.promise().query(selectAllRecords(tableName));
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to load categories');
    }
});

/**
 * POST endpoint: Create a new category.
 *
 * @param {Object} req  request object with new category data in the body.
 * @param {Object} res  response object.
 * @returns {void}
 */
app.post("/category", createTableIfNotExists(tableSql), async (req, res) => {
    let newCategory = req.body;
    delete req.body.id;
    try {
        await connection.promise().query(insertRecord(tableName, newCategory));
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal Server Error",
            message: "An unexpected error occurred.",
        });
    }
});

/**
 * DELETE endpoint: Delete a category by category ID.
 *
 * @param {Object} req  request object with category ID as a parameter.
 * @param {Object} res  response object.
 * @returns {void}
 */
app.delete("/category/:categoryId", createTableIfNotExists(tableSql), async (req, res) => {
    const id = parseInt(req.params.categoryId);
    try {
        await connection.promise().query(deleteRecord(tableName, id));
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal Server Error",
            message: "An unexpected error occurred.",
        });
    }
});

/**
 * PUT endpoint: Update category details.
 *
 * @param {Object} req  request object with updated category data in the body.
 * @param {Object} res  response object.
 * @returns {void}
 */
app.put("/category", createTableIfNotExists(tableSql), async (req, res) => {
    const id = parseInt(req.body.id);
    delete req.body.id;
    try {
        await connection.promise().query(updateRecord(tableName, id, req.body));
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal Server Error",
            message: "An unexpected error occurred.",
        });
    }
});