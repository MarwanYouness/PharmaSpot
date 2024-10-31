const selectAllRecords = (tableName) => {
    return `SELECT * from ${tableName}`
}

const selectRecord = (tableName, id) => {
    return `SELECT * from ${tableName} WHERE id=${id}`;
}

const insertRecord = (tableName, data) => {
    return `INSERT INTO ${tableName} (${Object.keys(data).join(', ')}) VALUES (${Object.values(data).map((value) => `'${value}'`).join(', ')})`;
}

const updateRecord = (tableName, id,  data) => {
    return `UPDATE ${tableName} SET ${[...Object.keys(data)].map((key) => `${key} = '${data[key]}'`).join(', ')} WHERE id=${id}`;
}

const deleteRecord = (tableName, id) => {
    return `DELETE FROM ${tableName} WHERE id=${id}`
}

module.exports = {selectAllRecords, selectRecord, insertRecord, updateRecord, deleteRecord};