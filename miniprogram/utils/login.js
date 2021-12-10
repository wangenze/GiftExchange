const { envList } = require('../envList.js');

module.exports = {
  getUserInfo,
}

async function getUserInfo() {
  let userInfo = wx.getStorageSync('userInfo');
  if (!userInfo) {
    const res = await wx.getUserProfile({
      desc: '用于参与活动',
    });
    userInfo = res.userInfo;
    await this.setUserInfoToBackend(userInfo);
    wx.setStorageSync('userInfo', userInfo);
  }
  return userInfo;
}

async function setUserInfoToBackend(userInfo) {
  wx.showLoading({
    title: '',
  });
  try {
    let res = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: envList[0].envId
      },
      data: {
        type: 'updateUser',
        data: {
          userInfo: userInfo
        }
      }
    })
    if (!res.result.success) {
      console.log(res.result)
      throw new Error("Unable to update user info")
    }
  } finally {
    wx.hideLoading();
  }
}