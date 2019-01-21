// pages/order/order.js

const app = getApp();
const Util = require('../../utils/util.js');
const { stars, bed, time, house, serverPath, orderStatus } = require('../../utils/const.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: 0,
    data: [],
    tempData: []
  },

  selectItem(e) {
    const { data } = this.data;
    if (e.target.dataset.key == 0) {
      this.setData({
        tempData: data
      })
    }
    if (e.target.dataset.key == 1) {
      this.setData({
        tempData: data.filter(item => item.state == 2)
      })
    }
    if (e.target.dataset.key == 2) {
      this.setData({
        tempData: data.filter(item => item.state == 3)
      })
    }
    this.setData({
      key: e.target.dataset.key
    });
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
    // app.globalData.userInfo = { "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eohaTjL6SHyhuKYqq1Ezlx5tDf0lmITmyicfhECAKmfx3jxmGurW58jsYh3LJ3cOL8NZMVHVicOnFjQ/132", "gender": "1", "id": 3, "nickName": "眼睛", "openId": "o7DVH4zxyEq9LX267lL9IKAp2PGI" };
    wx.showLoading({
      title: '订单正在加载...',
    });
    Util.request({
      url: serverPath + '/user/listOrder',
      method: "GET",
      data: {
        userId: app.globalData.userInfo.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        if (res.data.errorCode == 0) {
          const data = res.data.data.map(item => {
            try {
              const d = JSON.parse(item.info);
              item['img'] = app.globalData.userInfo.avatarUrl;
              item['name'] = d.position;
              item['star'] = stars[d.starIndex].name;
              item['startTime'] = d.startDate.substr(5, 10);
              item['endTime'] = d.endDate.substr(5, 10);
              item['time'] = time[d.timeIndex].name;
              item['count'] = house[d.houseIndex].name;
              item['house'] = bed[d.bedIndex].name;
              item['statusName'] = orderStatus[item.state];
              item['money'] = d.money;
            } catch(e) {
              
            }
            return item;
          });
          this.setData({
            data,
            tempData: data,
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // app.globalData.userInfo = { "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eohaTjL6SHyhuKYqq1Ezlx5tDf0lmITmyicfhECAKmfx3jxmGurW58jsYh3LJ3cOL8NZMVHVicOnFjQ/132", "gender": "1", "id": 3, "nickName": "眼睛", "openId": "o7DVH4zxyEq9LX267lL9IKAp2PGI" };
    wx.showLoading({
      title: '订单正在加载...',
    });
    Util.request({
      url: serverPath + '/user/listOrder',
      method: "GET",
      data: {
        userId: app.globalData.userInfo.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        if (res.data.errorCode == 0) {
          const data = res.data.data.map(item => {
            try {
              const d = JSON.parse(item.info);
              item['img'] = app.globalData.userInfo.avatarUrl;
              item['name'] = d.position;
              item['star'] = stars[d.starIndex].name;
              item['startTime'] = d.startDate.substr(5, 10);
              item['endTime'] = d.endDate.substr(5, 10);
              item['time'] = time[d.timeIndex].name;
              item['count'] = house[d.houseIndex].name;
              item['house'] = bed[d.bedIndex].name;
              item['statusName'] = orderStatus[item.state];
              item['money'] = d.money;
            } catch (e) {

            }
            return item;
          });
          this.setData({
            data,
            tempData: data,
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
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