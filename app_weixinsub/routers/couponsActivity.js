/**
 * Created by M on 2017/3/10.
 */
var express = require('express');
var router = express.Router();
const model = require('../../model');
const coupons = model.Coupons;
const couponsGrant = model.CouponsGrant;
/* GET users listing. */
//status为11的发放记录
//判断是否参加过该活动 callback：True 参加过 False 未参加
const hasGetThisActivityCoupons = (userid,status,callback)=>{
    couponsGrant.findAll({where:{userid:userid,status:status}})
        .then((r)=> {
            if (r.length < 1) {
                callback(null,false)
            }
            else{
                callback(null,true)
            }
        }).catch((err)=>{
        callback(err);
    });
};
router.get('/couponsaccesspage', function (req, res, next) {
    if (!req.session.user) {
        return  res.redirect('/wx/urlyz?action=ca/couponsaccesspage');
    }
    hasGetThisActivityCoupons(req.session.user.userid,11,(err,result)=>{
       if(result) {//参加过
           res.render('coupons/couponserr', {title: '优惠券'});
       }
        else {//未参加
           coupons.findOne({where:{status:11}}).then((r)=>{
               res.render('coupons/couponsgrant', {title: '优惠券',coupons:r});
           });
       }
    });

});
router.get('/couponsactivityadd',(req,res,next)=>{
    couponsGrant.findAll({where:{userid:req.session.user.userid,status:req.query.status}})
    .then((r)=>{
        if(r.length<1){
            coupons.update({userid:req.session.user.userid,status:3},{where:{code:req.query.code}})
                .then((r)=>{
                    couponsGrant.create({userid:req.session.user.userid,status:req.query.status})
                    .then((r)=>{
                        res.json({
                            msg:'OK'
                        })
                    }).catch((err)=>{
                        res.json({
                            msg:'err'
                        })
                    });
                }).catch((err)=>{
                res.json({
                    msg:'err'
                })
            });
        }
        else{
            res.json({
                msg:'hasone'
            })
        }

    }).catch((err)=>{
        console.log(err);
        res.json({
            msg:'err'
        })
    });
});
module.exports = router;