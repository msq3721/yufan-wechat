/**
 * Created by M on 2017/2/7.
 */
const model = require('../../model');
const coupons = model.Coupons;
module.exports={
    changeAllAddressDefault:function(id,callback){
        let a = model.Address;
        a.update({
            isdefault: 0
        },{
            where:{
                userid:id,
                isdefault:1
            }
        }).then(function(p) {
            callback(null,p)
        }).catch((err)=>{
            callback(err)
        })
    },
    updateAddress:(id,data,isdefault,callback)=>{
        let a = model.Address;
        a.update({
            site:data.site,
            mobile:data.mobile,
            name:data.name,
            sex:data.sex,
            isdefault:isdefault
        },{
            where:{id:id}
        }).then(function(p) {
            callback(null,p)
        }).catch((err)=>{
            callback(err)
        })
    },
    addCoupons:(userid,code,callback)=>{//回调res 1 添加成功
        coupons.findOne({where:{code:code}})
            .then((r)=>{
                console.log(r);
                if(r === null){
                    callback(null,'3');
                }
                else if(r.dataValues.userid === null){//如果未被使用
                    coupons.update({userid:userid,status:3},{where:{code:code}})
                    .then((r2)=>{
                        callback(null,'1');
                    }).catch((err)=>{
                        callback(err);
                    });
                }else{
                    callback(null,'2')//已经被使用
                }
            }).catch((err)=>{
            callback(err)
        })
    },
    updateHasCoupons:(userid,couponsid,callback)=>{
        if(couponsid === 'nocoupons'){//没有用优惠券
            callback(null,'Ok');
        }
        else{
            coupons.update({status:4},{where:{id:couponsid,userid:userid}})
            .then((r)=>{
                callback('OK');
            })
        }
},
};