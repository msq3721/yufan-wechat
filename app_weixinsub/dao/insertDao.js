/**
 * Created by M on 2017/2/5.
 */
const model = require('../../model');
module.exports={
    insertAddress:function(userid,data,isdefault,callback){
        let ia = model.Address;
        ia.create({
            userid:userid,
            name:data.name,
            sex:data.sex,
            mobile:data.mobile,
            site:data.site,
            isdefault:isdefault
        }).then(function(p){
            callback(null,p);
        }).catch(function(err){
            callback('地址信息插入失败'+err);
        });
    },

};