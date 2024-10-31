const app = require("express")();
const bodyParser = require("body-parser");
const { createTableQuery, createTableIfNotExists } = require("../db.creator");
const connection = require("../db.connection");
const { selectAllRecords, selectRecord, deleteRecord, updateRecord, insertRecord } = require("../db.helper");

const tableName = 'customers';
const schema = `
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
`;

const tableSql = createTableQuery(tableName, schema);

app.use(bodyParser.json());

module.exports = app;

/**
 * GET endpoint: Get the welcome message for the Customer API.
 *
 * @param {Object} req request object.
 * @param {Object} res response object.
 * @returns {void}
 */
app.get("/", function (req, res) {
    res.send("Customer API");
});

/**
 * GET endpoint: Get customer details by customer ID.
 *
 * @param {Object} req request object with customer ID as a parameter.
 * @param {Object} res response object.
 * @returns {void}
 */
app.get("/customer/:customerId", createTableIfNotExists(tableSql), async (req, res) => {
    const customerId = parseInt(req.params.customerId);
    if (!customerId) {
        res.status(500).send("ID field is required.");
    } else {
        try {
           const [customer] = await connection.promise().query(selectRecord(customers, customerId))
           res.json(customer);
        } catch (err) {
            console.log(err);
            res.status(500).send(`Failed to load customer with ID ${customerId}`);
        }
    }
});

/**
 * GET endpoint: Get details of all customers.
 *
 * @param {Object} req request object.
 * @param {Object} res response object.
 * @returns {void}
 */
app.get("/all", createTableIfNotExists(tableSql), async (req, res) => {
    try {
        const [rows] = await connection.promise().query(selectAllRecords(tableName));
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to load customers');
    }
});

/**
 * POST endpoint: Create a new customer.
 *
 * @param {Object} req request object with new customer data in the body.
 * @param {Object} res response object.
 * @returns {void}
 */
app.post("/customer", createTableIfNotExists(tableSql), async (req, res) => {
    var newCustomer = req.body;
    delete req.body._id;
    try {
        await connection.promise().query(insertRecord(tableName, newCustomer));
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
 * DELETE endpoint: Delete a customer by customer ID.
 *
 * @param {Object} req request object with customer ID as a parameter.
 * @param {Object} res response object.
 * @returns {void}
 */
app.delete("/customer/:customerId", createTableIfNotExists(tableSql), async (req, res) => {
    const customerId = parseInt(req.params.customerId);
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
 * PUT endpoint: Update customer details.
 *
 * @param {Object} req request object with updated customer data in the body.
 * @param {Object} res response object.
 * @returns {void}
 */
app.put("/customer", createTableIfNotExists(tableSql), async (req, res) => {
    let customerId = parseInt(req.body.id);
    delete req.body.id
    delete req.body._id
    try {
        await connection.promise().query(updateRecord(tableName, customerId, req.body))
        res.sendStatus(200);
    } catch (error) {
        console.error(err);
        res.status(500).json({
            error: "Internal Server Error",
            message: "An unexpected error occurred.",
        });
    }
});