// pages/userHome/index.js
const {
  getUserInfoFromCache,
  getUserInfoFromBackend,
  setUserInfoToBackend,
} = require('../../utils/user');
const { envList } = require('../../envList.js');
const { getOpenId } = require('../../utils/utils.js');
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: defaultAvatarUrl,
    avatarLocalUrl: null,
    nickName: "",
    openId: null,
  },

  onChooseAvatar: async function(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      avatarUrl: avatarUrl,
      avatarLocalUrl: avatarUrl,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let openId = await getOpenId();
    this.setData({
      openId: openId
    })
    let userInfo = getUserInfoFromCache();
    if (userInfo) {
      this.setData({
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName
      })
    };
    userInfo = await getUserInfoFromBackend();
    if (userInfo) {
      this.setData({
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName
      })
    };
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

  },

  saveUserInfo: async function () {
    let avatarUrl = this.data.avatarUrl;
    if (this.data.avatarLocalUrl) {
      wx.showLoading({
        title: '',
      });
      try {
        const res = await wx.cloud.uploadFile({
          cloudPath: `${this.data.openId}/avatar-${Date.now()}.png`,
          filePath: this.data.avatarLocalUrl,
          config: {
            env: envList[0].envId
          }
        });
        avatarUrl = res.fileID;
      } finally {
        wx.hideLoading();
      }
    }
    const userInfo = {
      avatarUrl: avatarUrl,
      nickName: this.data.nickName,
    };
    await setUserInfoToBackend(userInfo);
    wx.navigateBack();
  },
})