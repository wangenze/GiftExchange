const { envList } = require('../envList.js');

module.exports = {
  setEquals,
  getOpenId
}

function setEquals(a, b) {
  return Array.isArray(a) && Array.isArray(b) &&
  a.length === b.length &&
  a.every((val) => b.includes(val))
}

async function getOpenId() {
  let openId = wx.getStorageSync('userOpenId');
  if (!openId) {
    wx.showLoading({
      title: '',
    });
    try {
      const res = await wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: envList[0].envId
        },
        data: {
          type: 'getOpenId'
        }
      });
      openId = res.result.openid;
      wx.setStorageSync(openId);
    } finally {
      wx.hideLoading();
    }
  }
  return openId;
}

function getUserInfoFromCache() {
  return wx.getStorageSync('userInfo');
}

function setUserInfoToCache(userInfo) {
  wx.setStorageSync('userInfo', userInfo);
}


