/**
 * Created by M on 2017/2/3.
 */
const model = require('../../model');
const moment = require('moment');
const timeutils = require('../../tools/timeutils');
module.exports={
    //查询食物列表
    queryFoodList:function(callback){
        let now = timeutils.formatDate(new Date());
        let fl = model.Foodlist;
        fl.findAll({attributes:['name','abstract','type','balance','imgurl','page','id'], where:{$and:[{'startdate':{$lte: now}},{'enddate':{$gte:now}}]}}).then(function(p){
            callback(null,p);
        }).catch(function(err){
            callback('数据库读取失败'+err);
        });
    },
    callb:function(flag,callback){
        let a=1;
        let b=2;
        if(flag ==1)
        {callback(null,a+b);}
        else
        {
            callback('a!=1');
        }
    },
    //查询是否存在口味 存在更新，不存在新建
    upsertFlavor:function(map, callback){
        let qf = model.Flavor;
        qf.findOne({
            where:{userid:map.userid}
        }).then(function(r){
            if(!r){
                qf.create({
                    userid:map.userid,
                        hot:map.hot,
                        vinegar:map.vinegar,
                        rice:map.rice,
                        garlic:map.garlic,
                        onion:map.onion,
                        scallion:map.scallion,
                        salt:map.salt,
                        remark:map.remark
                }).then(function(r){
                    callback(null,r);
                }).catch(function(err){
                    callback('查询口味信息异常'+err);
                })
            }
            else {
                qf.update({
                        hot:map.hot,
                        vinegar:map.vinegar,
                        rice:map.rice,
                        garlic:map.garlic,
                        onion:map.onion,
                        scallion:map.scallion,
                        salt:map.salt,
                        remark:map.remark
                },{
                    where:{userid:map.userid},
                }).then(function(r){
                    callback(null,r);
                }).catch(function(err){
                    callback('查询口味信息异常'+err);
                })
            }
        }).catch(function(err){
            callback('查询口味信息异常'+err);
        });
    },
    queryAddrssList:function(userid,callback){
        let a = model.Address;
        a.findAll({
            where:{
                userid:userid
            }
        }).then(function(p){
            callback(null,p);
        }).catch(function(err){
            callback('查询地址信息异常'+err);
        })
    },

};