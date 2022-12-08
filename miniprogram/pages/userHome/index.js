// pages/userHome/index.js
const {
  getUserInfo,
  getUserInfoOnLoad,
  getUserInfoFromCache,
  getForeignUserInfos,
} = require('../../utils/user');
const {
  getCurrentActivity,
  createActivity,
  exitActivity,
  joinActivity,
  startActivity
} = require('../../utils/activity');
const {
  setEquals
} = require('../../utils/utils')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoginButton: false,
    userInfo: null,
    activityId: null,
    activityStatus: null,
    activityName: null,
    isActivityCreator: null,
    activityMembers: [],
    activityUserInfos: [],
    activityCreator: null,
    activityCreatorUserInfo: null,
    activityResult: null,
    activityResultUserInfo: null,
    activityUpdateTimer: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.updateUserInfo(await getUserInfoOnLoad());
    if (this.data.userInfo) {
      if (options.activityId) {
        await this.joinActivity(options.activityId);
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let query = ''
    if (this.data.activityId) {
      query += 'activityId=' + this.data.activityId
    }
    return {
      path: '/pages/userHome/index?' + query
    };
  },

  login: async function () {
    await this.updateUserInfo(await getUserInfo());
  },

  onCreateActivity: async function () {
    await this.updateActivity(await createActivity());
  },

  onExitActivity: async function () {
    if (this.data.activityId) {
      const res = await wx.showModal({
        title: '提示',
        content: '确定退出当前房间？'
      })
      if (res.confirm) {
        await this.updateActivity(await exitActivity());
      }
    }
  },

  onStartActivity: async function () {
    if (this.data.activityMembers.length <= 2) {
      await wx.showModal({
        title: '人数不足',
        content: '至少3人才能开始',
        showCancel: false
      })
    } else {
      const res = await wx.showModal({
        title: '确定开始抽签',
        content: '所有人都到齐了吗？'
      })
      if (res.confirm) {
        await this.updateActivity(await startActivity());
      }
    }
  },

  joinActivity: async function (activityId) {
    if (!!activityId) {
      if (this.data.activityId && this.data.activityId != activityId) {
        const res = await wx.showModal({
          title: '提示',
          content: '退出当前房间并加入新房间？'
        })
        if (res.confirm) {
          await this.updateActivity(await exitActivity());
        }
      }
      await this.updateActivity(await joinActivity(activityId))
    }
  },

  updateUserInfo: async function (userInfo) {
    if (!userInfo) {
      if (this.data.activityUpdateTimer) {
        clearInterval(activityUpdateTimer)
        this.setData({
          activityUpdateTimer: null
        })
      }
      this.setData({
        userInfo: null,
        showLoginButton: true
      })
    } else {
      this.setData({
        userInfo: userInfo,
        showLoginButton: false,
        activityUpdateTimer: setInterval(async () => {
          if (this.data.activityStatus === 'NOT_STARTED') {
            await this.updateActivity(await getCurrentActivity(false));
          }
        }, 10000)
      })
      await this.updateActivity(await getCurrentActivity());
    }
  },

  updateActivity: async function (activity) {
    if (!activity) {
      this.setData({
        activityId: null,
      })
    } else if (this.data.activityId != activity._id) {
      this.setData({
        activityId: activity._id,
      })
    }
    await this.updateActivityStatus(activity);
    await this.updateActivityCreator(activity);
    await this.updateActivityUserInfos(activity);
    await this.updateActivityResultUserInfo(activity);
  },

  updateActivityStatus: async function (activity) {
    if (!activity) {
      this.setData({
        activityStatus: null,
      })
    } else if (this.data.activityStatus != activity.status) {
      console.log("Update activity status")
      this.setData({
        activityStatus: activity.status,
      })
    }
  },

  updateActivityUserInfos: async function (activity) {
    if (!activity) {
      this.setData({
        activityMembers: [],
        activityUserInfos: []
      })
    } else {
      const members = activity.members.map(member => member.user_openid);
      if (!setEquals(members, this.data.activityMembers)) {
        console.log("Update activity members")
        const userInfos = await getForeignUserInfos(members);
        this.setData({
          activityMembers: members,
          activityUserInfos: userInfos
        })
      }
    }
  },

  updateActivityCreator: async function (activity) {
    if (!activity) {
      this.setData({
        activityCreator: null,
        isActivityCreator: null,
        activityName: null,
      })
    } else if (this.data.activityCreator != activity.creator) {
      console.log("Update activity creator")
      this.setData({
        activityCreator: activity.creator,
        isActivityCreator: activity.isCreator,
        activityName: (await getForeignUserInfos([activity.creator]))[0].nickName + " 的房间",
      })
    }
  },

  updateActivityResultUserInfo: async function (activity) {
    if (!activity || !activity.result || activity.result.length != 1) {
      this.setData({
        activityResult: null,
        activityResultUserInfo: null,
      })
    } else if (this.data.activityResult != activity.result[0].receiver) {
      console.log("Update activity result")
      const result = activity.result[0].receiver
      this.setData({
        activityResult: result,
        activityResultUserInfo: (await getForeignUserInfos([result]))[0],
      })
    }
  },
})