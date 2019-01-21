// pages/orderDetail/orderDetail.js
const { stars, bed, time, house, serverPath, orderStatus } = require('../../utils/const.js');
const Util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {}
  },
  cancelOrder() {
    const { item } = this.data;
    let d = {};
    try {
      d = JSON.parse(item.info);
      d['cancelTime'] = new Date().Format('yyyy-MM-dd hh:mm:ss');
    } catch (e) { }
    wx.showLoading({
      title: '订单正在取消...',
    });
    Util.request({
      url: serverPath + '/order/update',
      method: "GET",
      data: {
        orderId: item.id,
        info: JSON.stringify(d),
        state: 3
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        if (res.data.errorCode == 0) {
          item.state = '3';
          item['statusName'] = orderStatus['3'];
          item['cancelTime'] = d['cancelTime'];
          this.setData({
            item
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  clickHotel(e) {
    const { item } = e.currentTarget.dataset;
    console.log(item);
    wx.showActionSheet({
      itemList: [
        `电话咨询(${item.telephone})`,
        // `取消下单(${item.hotelName})`, 
      ],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.makePhoneCall({
            phoneNumber: item.telephone // 仅为示例，并非真实的电话号码
          })
        }
        // if (res.tapIndex === 1) {
        //   this.updateOrder(item, companyList[index].hotelId)
        // }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options = { "info": "{\"money\":\"10\",\"startDate\":\"2019-01-11\",\"endDate\":\"2019-01-11\",\"starIndex\":0,\"bedIndex\":0,\"timeIndex\":0,\"houseIndex\":0,\"position\":\"南湖路3012号\"}", id: "2", "userId": "3", "state": "1" }
    console.log(options);
    let item = {};
    try {
      const hotelEntity = JSON.parse(options.hotelEntityStr);
      if (!!hotelEntity.hotelId) {
        item['hotelEntity'] = [hotelEntity];
      } else {
        item['hotelEntity'] = [];
      }
      const d = JSON.parse(options.info);
      item['star'] = stars[d.starIndex].name;
      item['startTime'] = d.startDate;
      item['endTime'] = d.endDate;
      item['time'] = time[d.timeIndex].name;
      item['count'] = house[d.houseIndex].name;
      item['house'] = bed[d.bedIndex].name;
      item['statusName'] = orderStatus[options.state];
      item['createTime'] = d.createTime;
      item['cancelTime'] = d.cancelTime;
      item['remark'] = d.remark;
      item['money'] = d.money;
      item['id'] = options.id;
      item['info'] = options.info;
      item['state'] = options.state;
      if (!!d.addbed && d.addbed.length > 0) {
        item['addbed'] = d.addbed.filter(item => !!item.select).map(item => item.name).join(', ');
      }
      if (!!d.facilities && d.facilities.length > 0) {
        item['facilities'] = d.facilities.filter(item => !!item.select).map(item => item.name).join(', ');
      }
      if (!!d.breakfast && d.breakfast.length > 0) {
        item['breakfast'] = d.breakfast.filter(item => !!item.select).map(item => item.name).join(', ');
      }
    } catch (e) {}
    this.setData({
      item
    })
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