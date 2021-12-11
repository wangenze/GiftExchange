// components/popupNotice.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    noticeTitle: String,
    noticeContent: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    showNotice: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChangeShowHide() {
      this.setData({
        showNotice: !this.data.showNotice
      });
    },
  }
})
