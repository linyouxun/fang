// pages/moreDetail/moreDetail.js
const { breakfast, addbed, facilities } = require('../../utils/const.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    breakfast: breakfast,
    addbed: addbed,
    facilities: facilities,
    remark: ''
  },
  clickItem(e) {
    const name = e.currentTarget.dataset.name;
    const index = e.currentTarget.dataset.index;
    const itemData = this.data[name];
    if (!![index]) {
      if (!!itemData[index].select) {
        itemData[index].select = 0;
      } else {
        itemData[index].select = 1;
      }
    } 
    this.setData({
      [name]: itemData
    })
  },
  sendMore() {
    const { breakfast, addbed, facilities, remark } = this.data;
    // 信息保存
    wx.setStorage({
      key: 'breakfast',
      data: breakfast
    });
    wx.setStorage({
      key: 'addbed',
      data: addbed
    });
    wx.setStorage({
      key: 'facilities',
      data: facilities
    });
    wx.setStorage({
      key: 'remark',
      data: remark
    });
    // 返回
    wx.navigateBack();
  },
  textChange(e) {
    this.setData({
      remark: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let breakfast = [];
    let addbed = [];
    let facilities = [];
    let remark = ''
    try {
      breakfast = wx.getStorageSync('breakfast');
      addbed = wx.getStorageSync('addbed');
      facilities = wx.getStorageSync('facilities');
      remark = wx.getStorageSync('remark');
    } catch (e) {
      // Do something when catch error
    }
    if (breakfast.length > 0) {
      this.setData({
        breakfast
      })
    }
    if (addbed.length > 0) {
      this.setData({
        addbed
      })
    }
    if (facilities.length > 0) {
      this.setData({
        facilities
      })
    }
    if (!!remark) {
      this.setData({
        remark
      })
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
  onPullDownRefresh: function () {

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

  }
})