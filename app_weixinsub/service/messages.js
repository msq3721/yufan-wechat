
/**
 * Created by M on 2017/2/2.
 */
var messages = {};
const model = require('../../model');
const db = require('../../db');
const qrcode = model.Qrcode;
const qrcodeHas = model.QrcodeHas;
let sequelize= db.sequelize;
messages.textReply1 = function(message, req, res, next){
    if (message.Content === '你好') {
        res.reply('hehe');
    }
};
messages.eventReply1 = function(message, req, res, next){
    console.log(message);
    if(message.EventKey === 'Y00005'&&message.Event === 'CLICK') {
        res.reply('想要加入送餐团队请输入手机号');
    }
    if(message.Event ==='subscribe'){
        res.reply('欢迎来品尝遇饭小厨的美食');
        if(message.EventKey!=null && typeof(message.EventKey)!= "undefined"){//如果有扫码参数
            console.log(message.EventKey);
            let sence = message.EventKey.split('_');
            if(sence[0] === 'qrscene'){
                qrcodeHas.findOne({where:{openid:message.FromUserName}})
                .then((r)=>{
                    console.log(r);
                    if(r ===null){
                        sequelize.query('update qrcode set followNum = followNum+1 where sceneId = ?',
                            { replacements: [sence[1]], type: sequelize.QueryTypes.UPDATE })
                        .then((r)=>{
                            qrcodeHas.create({sceneId:sence[1],openid:message.FromUserName})
                            .then((r)=>{
                                console.log('OK');
                            })
                        })
                    }
                })
            }

        }
    }
};
module .exports = messages;