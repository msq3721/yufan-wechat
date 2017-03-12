/**
 * Created by M on 2017/3/11.
 */
const model = require('../../model');
const moment = require('moment');
const uuid = require('node-uuid');
const db =require('../../db');
const order = model.Order;
const product = model.Product;
const complete = (message,req,res)=>{
    let ot = moment().format();//获取当前时间
};
module .exports=complete;