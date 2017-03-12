/**
 * Created by M on 2017/2/23.
 */
const fs = require('fs');
var formidable = require('formidable');
const model = require('../../model');
const db = require('../../db');
const timeutils = require('../../tools/timeutils');
const service ={};
const sequelize = db.sequelize;
