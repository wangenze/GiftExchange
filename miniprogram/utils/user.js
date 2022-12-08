const { envList } = require('../envList.js');

module.exports = {
  getUserInfo,
  getUserInfoFromCache,
  getForeignUserInfos,
}

async function getForeignUserInfos(userOpenIds) {
  if (!userOpenIds || userOpenIds.length < 1) {
    return [];
  }
  const res = await wx.cloud.callFunction({
    name: 'quickstartFunctions',
    config: {
      env: envList[0].envId
    },
    data: {
      type: 'user',
      action: 'getUserInfos',
      data: {
        openIds: userOpenIds
      }
    }
  })
  return res.result
}

async function getUserInfo() {
  let userInfo = getUserInfoFromCache();
  if (!userInfo) {
    const res = await wx.getUserProfile({
      desc: '用于参与活动',
    });
    userInfo = res.userInfo;
    await setUserInfoToBackend(userInfo);
    setUserInfoToCache(userInfo);
  }
  return userInfo;
}

function getUserInfoFromCache() {
  return wx.getStorageSync('userInfo2022');
}

function setUserInfoToCache(userInfo) {
  wx.setStorageSync('userInfo2022', userInfo);
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
        type: 'user',
        action: 'updateUser',
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