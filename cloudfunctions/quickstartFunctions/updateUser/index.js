const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command

exports.main = async (event, context) => {
  try {
    let { OPENID, APPID, UNIONID } = cloud.getWXContext();
    let res = await db.collection('gift_user').where({
      _openid: OPENID
    }).get()
    if (res.data.length > 0) {
      let user = res.data[0];
      await db.collection('gift_user').doc(user._id).update({
        data: {
          userInfo: event.data.userInfo,
          updateTime: Date.now()
        }
      })
    } else {
      await db.collection('gift_user').add({
        data: {
          _openid: OPENID,
          userInfo: event.data.userInfo,
          createTime: Date.now(),
          updateTime: Date.now()
        }
      })
    }
    return {
      success: true,
    };
  } catch(e) {
    return {
      success: false,
      errMsg: e
    }
  }
};
