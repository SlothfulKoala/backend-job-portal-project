const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_PATH = path.join(__dirname, '../../data');

const readData = (fileName) => {
    // will send the entire file array in return
    // if the fileName doesnot exist, will send back an empty array
    const filePath = path.join(DATA_PATH, `${fileName}.json`);
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
};

const writeData = (fileName, data) => {
    // will overwrite all the data in fileName with the data passes as the argument
    const filePath = path.join(DATA_PATH, `${fileName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Global ID generator 
// use the appropriate prefizes (JOB, APP, USER) for generating unique ids
const generateId = (prefix) => `${prefix}-${crypto.randomBytes(4).toString('hex')}`;

module.exports = { readData, writeData, generateId };