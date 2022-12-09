const { envList } = require('../envList.js');

module.exports = {
  getForeignUserInfos,
  getUserInfoFromBackend,
  getUserInfoFromCache,
  setUserInfoToBackend,
  setUserInfoToCache
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

function getUserInfoFromCache() {
  return wx.getStorageSync('userInfo');
}

function setUserInfoToCache(userInfo) {
  wx.setStorageSync('userInfo', userInfo);
}

async function getUserInfoFromBackend() {
  let userInfo = undefined;
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
        type: 'user',
        action: 'getUserInfo'
      }
    });
    userInfo = res.result;
  } catch (error) {
    console.log(error);
  } finally {
    wx.hideLoading();
  }
  setUserInfoToCache(userInfo);
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
    setUserInfoToCache(userInfo);
  } finally {
    wx.hideLoading();
  }
}