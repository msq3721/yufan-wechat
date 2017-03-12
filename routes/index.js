var express = require('express');
var router = express.Router();
var moment = require('moment');
/* GET home page. */
router.get('/', function(req, res, next) {
  //moment.locale('en', {
  //  weekdays : [
  //    "星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"
  //  ]
  //});
  //let now = moment();
  //let nowDay = now.day();
  //now.subtract('1','d');
  //for(let i=nowDay;i<=7;i++){
  //  now.add(1,'d');
  //  console.log(now.format("dddd")+''+now.format())
  //}
  //let time = moment().set({'hour':10,'minute':0});
  //let end = moment().set({'hour':19,'minute':0});
  //let dd = [];
  //while(time.isBefore(end)){
  //  dd.push(time.format("HH:mm"));
  //  time.add(30,'m');
  //  console.log(time.format("HH:mm"));
  //}
  //console.log('-----------------');
  //let d =[]
  //let i = 0;
  //while(i<dd.length-1){
  //  console.log(dd[i]+'~'+dd[i+1]);
  //  i++;
  //};
  //let x = moment();
  //if (x.hour()<10){
  //  console.log('ready');
  //}else if (x.hour()<19){
  //  console.log('ing');
  //}else{
  //  console.log('too');
  //}
  let m = moment();
  let time = moment().set({'hour':6,'minute':0});
  let end = moment().set({'hour':8,'minute':0});
  let dd = [];
  while(time.isBefore(end)){
    dd.push(time.format("HH:mm"));
    time.add(30,'m');
  }
  console.log('早餐'+dd);
  time = moment().set({'hour':6});
  end = moment().set({'hour':19});
  let ddd=[];
  while(time.isBefore(end)){
    ddd.push(time.hour());
    time.add(1,'h');
  }
  console.log('轻食',ddd);
  time = moment().set({'hour':10});
  end = moment().set({'hour':19});
  let dddd=[];
  while(time.isBefore(end)){
    dddd.push(time.hour());
    time.add(1,'h');
  }
  console.log('午晚餐',dddd);
  moment.locale('zh-cn');
  let ttt = moment('2017-02-19T15:04:55.000Z').format('YYYY MMMM Do hh:mm ');
  console.log(ttt);
  console.log(moment().format());
  res.render('index', { title: 'Express' });
});

module.exports = router;
