// pages/userHome/index.js
const {
  getUserInfo,
  getUserInfoFromCache,
  getForeignUserInfos,
} = require('../../utils/user');
const {
  getCurrentActivity,
  createActivity,
  exitActivity
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
    this.updateUserInfo(getUserInfoFromCache());
    if (this.data.userInfo) {
      this.updateActivity(await getCurrentActivity());
      if (options.activityId) {
        this.joinActivity(options.activityId);
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
    this.updateActivity(await getCurrentActivity());
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

  },

  login: async function () {
    this.updateUserInfo(await getUserInfo());
  },

  onCreateActivity: async function() {
    this.updateActivity(await createActivity());
  },

  onExitActivity: async function() {
    this.updateActivity(await exitActivity())
  },
  
  joinActivity: function (activityId) {

  },

  updateUserInfo: function (userInfo) {
    if (!!userInfo) {
      this.setData({
        userInfo: userInfo
      })
    }
  },

  updateActivity: function (activity) {
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
    this.updateActivityUserInfos();
  },

  updateActivityUserInfos: function () {
    if (this.activityMembers) {
      const userInfos = getForeignUserInfos(this.activityMembers);
      this.setData({
        activityUserInfos: userInfos
      })
    }
  },
})