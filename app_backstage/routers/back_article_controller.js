/**
 * Created by M on 2017/2/15.
 */
var express = require('express');
var router = express.Router();
const fs = require('fs');
var formidable = require('formidable');
const uuid = require('node-uuid');
const sub  = require('../../app_weixinsub/service/auth');
const model = require('../../model');
const timeutils = require('../../tools/timeutils');
router.get('/g1', function(req, res, next) {
    sub.api.getMaterials('news', 0, 5, function(err,result,resp){
        if(err)
            return console.log('err');
        res.render('backstage/main/index',{title:'文章',list:result})
    });

});
//菜品列表页面
router.get('/foodlistpage', function(req, res, next) {
    let a = model.Foodlist;
    a.findAll({where:{type:[1,2,3]},order:[['enddate','DESC']]}).then((r)=>{
        for (let x of r){
            x.startdate= timeutils.formatDate(x.startdate);
            x.enddate= timeutils.formatDate(x.enddate);
        }
        res.render('backstage/common/foodlist',{title:'菜品列表',result:r});
    })
});
//修改菜品页面
router.get('/updatefoodpage', function(req, res, next) {
    let a = model.Foodlist;
    a.findOne({where: {id: req.query.id}}).then((r)=>{
        r.startdate= timeutils.formatDate(r.startdate);
        r.enddate= timeutils.formatDate(r.enddate);
        res.render('backstage/common/updatefood',{title:'修改菜品 ',r:r})
    }).catch((err)=>{
    })
});
//修改菜品方法
router.post('/updatefood', function(req, res, next) {
    let p = req.body;
    let a = model.Foodlist;
    a.update({name:p.name,abstract:p.abstract,imgurl:p.imgurl,type:p.type,
             balance:p.balance,startdate:p.startdate,enddate:p.enddate,page:p.page}
             ,{where:{id:req.query.id}})
    .then((r)=>{
        res.redirect('/bk/foodlistpage');
    })
});
//删除菜品方法
router.get('/delectfood', function(req, res, next) {
    let a = model.Foodlist;
    a.destroy({where:{id:req.query.id}}).then((r)=>{
        res.redirect('/bk/foodlistpage');
    })

});
//上传菜品页面
router.get('/upfoodpage', function(req, res, next) {
    res.render('backstage/common/upfood',{title:'上传菜品 '})
});
//上传菜品方法
router.post('/upfood', function(req, res, next) {
    let p = req.body;
    let a = model.Foodlist;
    a.create({name:p.name,abstract:p.abstract,imgurl:p.imgurl,type:p.type,
        balance:p.balance,startdate:p.startdate,enddate:p.enddate,page:p.page})
    .then((r)=>{res.redirect('/bk/foodlistpage');});
});

//文章列表页面
router.get('/articlelistpage', function(req, res, next) {
    let a = model.Article;
    a.findAll({order:[['date','DESC']]}).then((r)=>{
        for (let x of r){
            x.date = timeutils.formatDate(x.date)
        }
        res.render('backstage/common/articlelist',{title:'文章列表',result:r})
    });

});
//上传文章页面
router.get('/uparticlepage', function(req, res, next) {
    sub.api.getMaterials('news', 0, 5, function(err,result,resp){
        //调用接口 查询文档列表 并遍历整理
        if(err)
            return console.log('err');
        let r=[];
        for(let x of result.item){
            for(let z of x.content.news_item){
                r.push(z);
            }
        }
        res.render('backstage/common/uparticle',{title:'上传文章',list:result,r:r})
    });
});
//上传文章方法
router.post('/uparticle', function(req, res, next) {
    var form = new formidable.IncomingForm();//获取dataform数据
    form.parse(req, function(err, f){
        let a = model.Article;
        a.create({url:f.url,title:f.title,author:f.author,
            digest:f.digest,imgid:f.imgid,date:f.date
        }).then((r)=>{
            res.json('success');
        })

    })
});
//修改文章方法--图片id和日期
router.post('/updatearticle', function(req, res, next) {
    let a = model.Article;
    a.update({imgid:req.body.imgid,date:req.body.date},{where:{id:req.query.id}})
    .then((r)=>{
        res.redirect('/bk/articlelistpage');
    });
});
//删除文章方法
router.get('/delectarticle', function(req, res, next) {
    let a = model.Article;
    a.destroy({where:{id:req.query.id}}).then(()=>{
        res.redirect('/bk/articlelistpage');
    })
});
//图片列表页面
router.get('/imglistpage', function(req, res, next) {
    let files = fs.readdirSync('public/img');
    res.render('backstage/common/imglist',{title:'图片列表',list:files});
});
//上传图片页面
router.get('/upimgpage', function(req, res, next) {
    res.render('backstage/common/upimg',{title:'上传图片'});
});
//上传图片方法
router.post('/upimg', function(req, res, next) {
    var message = '';
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = 'public/img/';     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
    form.parse(req, function(err, fields, files) {
        if (err) {
            console.log(err);
            res.json('fail')
        }

        var filename = files.resource.name;
        // 对文件名进行处理，以应对上传同名文件的情况
        var nameArray = filename.split('.');
        var type = nameArray[nameArray.length-1];

        var avatarName = uuid.v4() +  '.' + type;

        var newPath = form.uploadDir + avatarName ;
        console.log(newPath);
        // lessonDao.addNewHw(req,res,next,fields,newPath);
        fs.renameSync(files.resource.path, newPath);  //重命名
        res.json('success');
    });
});
//积分礼物页面
router.get('/giftpage', function(req, res, next) {
    let a = model.Foodlist;
    a.findAll({where:{type:4},order:[['enddate','DESC']]}).then((r)=>{
        for (let x of r){
            x.startdate= timeutils.formatDate(x.startdate);
            x.enddate= timeutils.formatDate(x.enddate);
        }
        res.render('backstage/common/giftlist',{title:'礼物列表',result:r});
    });
});
router.get('/upgiftpage', function(req, res, next) {
    res.render('backstage/common/upgift',{title:'上传礼物'});
});
//上传礼物
router.post('/upgift', function(req, res, next) {
    let p = req.body;
    let a = model.Foodlist;
    a.create({name:p.name,abstract:p.abstract,imgurl:p.imgurl,type:p.type,
            balance:p.balance,startdate:p.startdate,enddate:p.enddate,page:p.page})
        .then((r)=>{res.redirect('/bk/giftpage');});
});
//修改礼物页面
router.get('/updategiftpage', function(req, res, next) {
    let a = model.Foodlist;
    a.findOne({where: {id: req.query.id}}).then((r)=>{
        r.startdate= timeutils.formatDate(r.startdate);
        r.enddate= timeutils.formatDate(r.enddate);
        res.render('backstage/common/updategift',{title:'修改礼物 ',r:r})
    }).catch((err)=>{
    })
});
//修改菜品方法
router.post('/updategift', function(req, res, next) {
    let p = req.body;
    let a = model.Foodlist;
    a.update({name:p.name,abstract:p.abstract,imgurl:p.imgurl,type:p.type,
            balance:p.balance,startdate:p.startdate,enddate:p.enddate,page:p.page}
        ,{where:{id:req.query.id}})
        .then((r)=>{
            res.redirect('/bk/giftpage');
        })
});
//删除菜品方法
router.get('/delectgift', function(req, res, next) {
    let a = model.Foodlist;
    a.destroy({where:{id:req.query.id}}).then((r)=>{
        res.redirect('/bk/giftpage');
    })

});
module.exports = router;