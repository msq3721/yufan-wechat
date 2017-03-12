/**
 * Created by M on 2017/2/7.
 */
const session = require('express-session');//sessiion
const model = require('../../model');
const findOneDao = require('../dao/findOneDao');
module.exports = {
    AddCartSession: function (req, data) {
        data.checked = 1;//默认被选中状态
        let hasdata = false;//默认没有此商品 循环遍历判断
        for (let i = 0; i < req.session.user.cart.length; i++) {
            if (req.session.user.cart[i].id === data.id) {
                req.session.user.cart[i].num++;
                req.session.user.totoalprice += req.session.user.cart[i].balance;
                hasdata = true;
            }
        }
        if (!hasdata) {
            data.num = 1;
            req.session.user.cart.unshift(data);
            req.session.user.totoalprice += data.balance;
        }
    },
    ChangeCartSession: function (req) {
        let id = req.query.id;
        for (let i = 0; i < req.session.user.cart.length; i++) {
            if (req.session.user.cart[i].id === id) {
                if (req.session.user.cart[i].checked === 0) {
                    req.session.user.cart[i].checked = 1;
                    req.session.user.totoalprice += req.session.user.cart[i].balance * req.session.user.cart[i].num;
                }
                else {
                    req.session.user.cart[i].checked = 0;
                    req.session.user.totoalprice -= req.session.user.cart[i].balance * req.session.user.cart[i].num;
                }
            }
        }
    },
    VerifyCart: function (req) {
        let l = req.session.user.cart.length;
        if (l == 0)
            return {call: 0, msg: '购物车为空'};

        else {
            let isbreakfast = false;
            let isdinner = false;
            let hasselected = false;
            for (let i = 0; i < req.session.user.cart.length; i++) {
                if (req.session.user.cart[i].checked === 1) {
                    if (req.session.user.cart[i].num > 0)
                        hasselected = true;
                    if (req.session.user.cart[i].type === 1)
                        isbreakfast = true;
                    else if (req.session.user.cart[i].type === 2)
                        isdinner = true;

                }
            }
            if (!hasselected)
                return {call: 1, msg: '请至少选择一项'};
            else if (isbreakfast && isdinner)
                return {call: 1, msg: '早饭和午饭不能同时提交'};
            else if (isbreakfast)
                return {call: 2, msg: '正在提交早餐', type: 1};
            else if (isdinner)
                return {call: 2, msg: '正在提交午晚餐', type: 2};
            else
                return {call: 2, msg: '正在提交轻食', type: 3}

        }
    },
    ChangeCartCount: function (req, callback) {
        let type = req.query.type;
        if (req.query.fun === 'newplus') {
            // return {call: 2, msg: '添加'};
            findOneDao.findOneFood(req.query.id, (err, r)=> {
                if (err)
                    return callback({call: 2, msg: '错误'});
                let x = JSON.stringify(r);
                let data = JSON.parse(x);
                data.checked = 1;//默认被选中状态
                let hasdata = false;//默认没有此商品 循环遍历判断
                let num;
                for (let i = 0; i < req.session.user.cart.length; i++) {
                    if (req.session.user.cart[i].id === data.id) {
                        req.session.user.cart[i].num++;
                        num = req.session.user.cart[i].num;
                        req.session.user.totoalprice += req.session.user.cart[i].balance;
                        hasdata = true;
                    }
                }
                if (!hasdata) {
                    data.num = 1;
                    num = data.num;
                    req.session.user.cart.unshift(data);
                    req.session.user.totoalprice += data.balance;
                }
                //data.checked = 1;//默认被选中状态
                //data.num = 1;
                //req.session.user.cart.unshift(data);
                //req.session.user.totoalprice += data.balance;
                //console.log(req.session.user.cart[0]);
                return callback(null, {call: 3, msg: '添加', num: num, type: data.type});
            })
        }
        else {
            for (let i = 0; i < req.session.user.cart.length; i++) {
                if (req.session.user.cart[i].id === req.query.id) {
                    if (req.query.fun === 'minus') {
                        if (req.session.user.cart[i].num >= 1) {
                            if (type === 'home' && (req.session.user.cart[i].num === 1 || req.session.user.cart[i].num === 0)) {//如果是在主页面
                                if (req.session.user.cart[i].checked === 1 && req.session.user.cart[i].num === 1)//如果被选中状态且数量为1 金额加减
                                    req.session.user.totoalprice -= req.session.user.cart[i].balance;
                                let foodtype = req.session.user.cart[i].type;
                                req.session.user.cart.splice(i, 1);
                                return callback(null, {call: 4, msg: '删除', type: foodtype});
                            }
                            req.session.user.cart[i].num--;
                            if (req.session.user.cart[i].checked === 1)//如果被选中状态 金额加减
                                req.session.user.totoalprice -= req.session.user.cart[i].balance;
                            return callback(null, {
                                call: 1,
                                totoalprice: req.session.user.totoalprice,
                                num: req.session.user.cart[i].num,
                                type: req.session.user.cart[i].type
                            })
                        }
                        else {
                            return callback(null, {call: 2, msg: '已经没有啦'});
                        }
                    }
                    else if (req.query.fun === 'plus') {
                        if (req.session.user.cart[i].num < 9) {
                            req.session.user.cart[i].num++;
                            if (req.session.user.cart[i].checked === 1)//如果被选中状态 金额加减
                                req.session.user.totoalprice += req.session.user.cart[i].balance;
                            return callback(null, {
                                call: 1,
                                totoalprice: req.session.user.totoalprice,
                                num: req.session.user.cart[i].num,
                                type: req.session.user.cart[i].type
                            });
                        }
                        else {
                            return callback(null, {call: 2, msg: '不能再多啦'});
                        }
                    }
                }
            }
        }
    },
    ConfirmOrder: function (req) {
        let productlist = [];
        let sum = 0;
        for (let i = 0; i < req.session.user.cart.length; i++) {
            if (req.session.user.cart[i].checked == 1 && req.session.user.cart[i].num > 0) {
                data.push(req.session.user.cart[i]);
                sum += req.session.user.cart[i].balance * req.session.user.num;
            }
        }
        return {sum: sum, data: data};
    }
};