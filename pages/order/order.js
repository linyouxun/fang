// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: 0,
    data: [{
      id: 1, 
      orderId: 23333,
      img: 'http://m.youju360.com/static/5c3ee3a132d6087897686b8f/img/1547625488741_565197075668512284_01.png',
      name: '名字',
      star: '三星级',
      house: '单床房',
      startTime: '1-15',
      endTime: '1-16',
      time: '16:15',
      count: '1间',
    }],

  },

  selectItem(e) {
    this.setData({
      key: e.target.dataset.key
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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