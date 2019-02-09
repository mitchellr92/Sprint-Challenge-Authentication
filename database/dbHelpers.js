const dbConfig = require('../knexfile.js');
const knex = require('knex');
const db = knex(dbConfig.development);

module.exports = {

    insertUser: (user) => {
        return db('users').insert(user);
    }

};