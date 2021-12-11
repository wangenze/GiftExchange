// pages/userHome/index.js
const {
  getUserInfo,
  getUserInfoFromCache,
  getForeignUserInfos,
} = require('../../utils/user');
const {
  getCurrentActivity,
  createActivity,
  exitActivity,
  joinActivity
} = require('../../utils/activity');
const {
  setEquals
} = require('../../utils/utils')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    activityId: null,
    activityStatus: null,
    activityName: null,
    isActivityCreator: null,
    activityMembers: [],
    activityUserInfos: [],
    activityCreatorUserInfo: null,
    activityUpdateTimer: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.updateUserInfo(getUserInfoFromCache());
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
    const res = await wx.showModal({
      title: '确定开始抽签',
      content: '大家都到齐了吗'
    })
    if (res.confirm) {
      wx.showToast({
        title: '目前还不支持，正在开发中',
        icon: 'none',
        duration: 2000,
      })
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
      })
    } else {
      this.setData({
        userInfo: userInfo,
        activityUpdateTimer: setInterval(async () => {
          if (this.data.activityStatus === 'NOT_STARTED') {
            await this.updateActivity(await getCurrentActivity(false));
          }
        }, 5000)
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
})