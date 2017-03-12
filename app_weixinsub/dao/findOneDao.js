/**
 * Created by M on 2017/2/7.
 */
const model = require('../../model');
module.exports = {
    findDefaultAddress: (userid, callback)=> {
        let a = model.Address;
        a.findOne({
            where: {userid: userid, isdefault: 1}
        }).then((p)=> {
            console.log(p);
            callback(null, p)
        }).catch((err)=> {
            callback(err)
        })
    },
    findOneFood: (id, callback)=> {
        let a = model.Foodlist;
        a.findOne({
            where: {id: id}
        }).then((p)=> {
            console.log(p);
            callback(null, p)
        }).catch((err)=> {
            callback(err)
        })
    },
    findOneFlavor: (userid, callback)=> {
        let a = model.Flavor;
        a.findOne({
            where: {userid: userid}
        }).then((p)=> {
            if (!p) {
                callback(null, {call: 1, data: 'no'})//不存在数据返回1
            }else {
                callback(null, {call: 2, data: p})//存在数据返回2
            };
        })
    },//返回口味生成字符串
    findFlavorMessage: (userid, callback)=> {
        let a = model.Flavor;
        a.findOne({
            where: {userid: userid}
        }).then((p)=> {
            if (p === null) {
                callback(null, '', '');
            }
            else {
                let str = [];
                switch (p.hot) {
                    case 1:
                        str.push('不放' + '辣椒') ;
                        break;
                    case 2:
                        str.push('少放' + '辣椒');
                        break;
                    case 3:
                        str.push('多放' + '辣椒') ;
                        break;
                }
                switch (p.vinegar) {
                    case 1:
                        str.push('不放' + '醋');
                        break;
                    case 2:
                        str.push('少放' + '醋') ;
                        break;
                    case 3:
                        str.push('多放' + '醋');
                        break;
                }
                switch (p.rice) {
                    case 2:
                        str.push('少放' + '饭');
                        break;
                    case 3:
                        str.push('多放' + '饭');
                        break;
                }
                if (p.garlic === 1) {
                    str.push('不放蒜') ;
                }
                if (p.onion === 1) {
                    str.push('不放洋葱');
                }
                if (p.scallion === 1) {
                    str.push('不放葱');
                }
                if (p.salt === 1) {
                    str.push('不放盐');
                }
                switch (p.vinegar) {
                    case 1:
                        str.push('不放' + '醋') ;
                        break;
                    case 2:
                        str.push('少放' + '醋') ;
                        break;
                    case 3:
                        str.push('多放' + '醋');
                        break;
                }
                callback(null, str, p.remark);
            }
        })
    }
};