const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command

exports.main = async (event, context) => {
  let { OPENID, APPID, UNIONID } = cloud.getWXContext();
  try {
    let res = await db.collection('gift_user').where({
      _openid: OPENID
    }).get()
    if (res.data.length > 0) {
      const user = res.data[0];
      return {
        success: true,
        data: {
          user: user
        }
      };
    } else {
      return {
        success: false,
        errMsg: "User not found"
      }
    }
  } catch(e) {
    return {
      success: false,
      errMsg: e
    }
  }
};
