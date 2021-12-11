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

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    activityId: null,
    activityStatus: null,
    isActivityCreator: null,
    activityMembers: [],
    activityUserInfos: [],
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
    await this.updateActivity(await getCurrentActivity());
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

  onCreateActivity: async function() {
    await this.updateActivity(await createActivity());
  },

  onExitActivity: async function() {
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

  onStartActivity: async function() {
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
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
      await this.updateActivity(await getCurrentActivity());
    }
  },

  updateActivity: async function (activity) {
    if (activity) {
      this.setData({
        activityId: activity._id,
        activityStatus: activity.status,
        activityMembers: activity.members.map(member => member.user_openid),
        isActivityCreator: activity.isCreator
      })
    } else {
      this.setData({
        activityId: null,
        activityStatus: null,
        activityMembers: [],
        isActivityCreator: null
      })
    }
    await this.updateActivityUserInfos();
  },

  updateActivityUserInfos: async function () {
    if (this.data.activityMembers.length > 0) {
      const userInfos = await getForeignUserInfos(this.data.activityMembers);
      this.setData({
        activityUserInfos: userInfos
      })
    }
  },
})