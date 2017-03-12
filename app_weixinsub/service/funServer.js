/**
 * Created by M on 2017/2/23.
 */
const moment = require('moment');
module.exports={
    HandleSign:(r)=>{
        let series=0;//设置连续签到时间
        let type;//今日是否已前到 1未签到 2签到
        let len = r.length;//签到次数
        if (len === 0){
            type=1;
        }
        else{
            let latestday = moment(r[0].date);//最近签到日期
            let now =moment();//今日日期
            series =r[0].series;//设置连续签到时间
            let nowdate = moment([now.year(), now.month(), now.date()]);
            if(latestday.isSame(now,'day')){//判断今日是否已签到
                console.log(r[0].date);
                console.log(latestday);
                console.log(now);
                type=2;
            }else{
                type=1;
                if(latestday.diff(nowdate, 'days') > 1){
                    series = 0;
                }
            }
        }
        return {series:series,type:type,len:len};
    }

};