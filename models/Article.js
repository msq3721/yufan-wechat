/**
 * Created by M on 2017/2/16.
 */
const db = require('../db');
module.exports = db.defineModel('article', {
    url: db.STRING(255),
    title:db.STRING(100),
    author:db.STRING(100),
    digest:db.STRING(100),
    date:db.DATEONLY,
    imgid:db.STRING(100),
});