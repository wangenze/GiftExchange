const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command

exports.main = async (event, context) => {
  let { openid, appid, unionid } = cloud.getWXContext();
  try {
    const user = await transaction.collection('gift_user').where({
      _openid: openid
    }).get()
    return {
      success: true,
      data: {
        user: user
      }
    };
  } catch(e) {
    return {
      success: false,
      errMsg: e
    }
  }
};
