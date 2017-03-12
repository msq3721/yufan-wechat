/**
 * Created by M on 2017/2/16.
 */
var express = require('express');
var router = express.Router();
router.get('/index', function(req, res, next) {
    res.render('backstage/main/index',{title:'文章'})
});
module.exports = router;