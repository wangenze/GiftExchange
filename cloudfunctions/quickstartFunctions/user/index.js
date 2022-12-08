const { init, DYNAMIC_CURRENT_ENV, database, getWXContext } = require('wx-server-sdk');

init({
  env: DYNAMIC_CURRENT_ENV
});
const db = database();
const _ = db.command

exports.getCurrentUser = getCurrentUser;
exports.main = async (event, context) => {
  switch (event.action) {
    case 'getUserInfo':
      return await getUserInfo(event, context);
    case 'getUserInfos':
      return await getUserInfos(event, context);
    case 'updateUser':
      return await updateUser(event, context);
    default:
      return {
        success: false,
        errMsg: 'Unsupported action: ' + event.action
      }
  }
}

async function getCurrentUser(event, context) {
  let {
    OPENID,
    APPID,
    UNIONID
  } = getWXContext();
  if (!OPENID) {
    throw new Error("Unable to find OPENID in context")
  }
  const res = await db.collection('gift_user').where({
    _openid: OPENID
  }).get()
  if (res.data.length != 1) {
    throw new Error("Invalid user")
  }
  return res.data[0];
}

async function getUserInfo(event, context) {
  const user = await getCurrentUser();
  return user.userInfo;
}

async function getUserInfos(event, context) {
  const res = await db.collection('gift_user').where({
    _openid: _.in(event.data.openIds)
  }).get()
  return res.data.map(user => user.userInfo)
}

async function updateUser(event, context) {
  let { OPENID, APPID, UNIONID } = getWXContext();
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
}
