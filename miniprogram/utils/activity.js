import { envList } from '../envList.js';

module.exports = {
  getCurrentActivity,
  createActivity,
  exitActivity,
  joinActivity
}

async function getCurrentActivity() {
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
        type: 'activity',
        action: 'getCurrentActivity',
      }
    })
    return res.result
  } finally {
    wx.hideLoading();
  }
}

async function createActivity() {
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
        type: 'activity',
        action: 'createActivity',
        data: {}
      }
    })
    return res.result
  } finally {
    wx.hideLoading();
  }
}

async function joinActivity(activityId) {
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
        type: 'activity',
        action: 'joinActivity',
        data: {
          activityId: activityId
        }
      }
    })
    return res.result
  } finally {
    wx.hideLoading();
  }
}

async function exitActivity() {
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
        type: 'activity',
        action: 'exitActivity',
        data: {}
      }
    })
    return res.result
  } finally {
    wx.hideLoading();
  }
}