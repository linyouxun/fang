// pages/orderDetail/orderDetail.js
const { stars, bed, time, house, serverPath, orderStatus } = require('../../utils/const.js');
const app = getApp();
const Util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    options: {},
    companyList: []
  },
  clearTime: null,
  clickHotel(e) {
    const { companyList, item } = this.data;
    const { index } = e.currentTarget.dataset;
    console.log(companyList[index]);
    wx.showActionSheet({
      itemList: [`直接下单(${companyList[index].hotelName})`, `电话咨询(${companyList[index].telephone})`],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.updateOrder(item, companyList[index].hotelId)
        } 
        if (res.tapIndex === 1) {
          wx.makePhoneCall({
            phoneNumber: companyList[index].telephone // 仅为示例，并非真实的电话号码
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
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
          if (!!this.clearTime) {
            clearInterval(this.clearTime)
            this.clearTime = null;
          }
          wx.showModal({
            title: '您已取消成功',
            content: '',
            success(res) {
              wx.redirectTo({
                url: '/pages/order/order',
              })
            }
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options = { "orderId": "70", "userId": "14" };
    console.log(JSON.stringify(options));
    this.setData({
      options
    });
    // 订单列表
    this.myOrder(options.userId);
    this.companyOrder(options.orderId);
    this.clearTime = setInterval(() => {
      // 公司列表
      this.companyOrder(options.orderId);
    }, 2000)
    
    // console.log(options)
    // options = { "info": "{\"money\":\"10\",\"startDate\":\"2019-01-11\",\"endDate\":\"2019-01-11\",\"starIndex\":0,\"bedIndex\":0,\"timeIndex\":0,\"houseIndex\":0,\"position\":\"南湖路3012号\"}", id: "2", "userId": "3", "state": "1" }
  },

  updateOrder(orderObj, hotelId) {
    console.log(orderObj, hotelId);
    Util.request({
      url: serverPath + '/order/pay',
      method: "GET",
      data: {
        ip: '120.77.235.71',
        openId: app.globalData.openId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        if (res.data.errorCode == 0) {
          const d = {
            'timeStamp': res.data.data.timeStamp + '',
            'nonceStr': res.data.data.nonceStr,
            'package': `prepay_id=${res.data.data.prepay_id}`,
            'signType': res.data.data.signType,
            'paySign': res.data.data.paySign
          }
          if (!res.data.data.prepay_id) {
            wx.showModal({
              title: '下单出错了',
              content: '请重新确认'
            });
          } else {
            wx.requestPayment({
              ...d,
              'success': function (res) {
                wx.showModal({
                  title: '恭喜您支付成功',
                  content: '房间已经给你预留好了'
                });
              },
              'fail': function (res) {
                wx.showToast({
                  title: '您已取消支付',
                  icon: 'none',
                  duration: 2000
                });
              }
            });
          }
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
    return ;
    wx.showLoading({
      title: '订单正在生成...',
    });
    Util.request({
      url: serverPath + '/order/update',
      method: "GET",
      data: {
        orderId: orderObj.id,
        info: orderObj.info,
        state: 2,
        hotelId,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        if (res.data.errorCode == 0) {
          // wx.showToast({
          //   title: '您已预订成功',
          //   icon: 'none'
          // });
          if (!!this.clearTime) {
            clearInterval(this.clearTime)
            this.clearTime = null;
          }
          wx.showModal({
            title: '您已预订成功',
            content: '',
            success(res) {
              wx.redirectTo({
                url: '/pages/order/order',
              })
            }
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },

  companyOrder(orderId) {
    Util.request({
      url: serverPath + '/user/myOrderHotels',
      method: "GET",
      data: {
        orderId,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        if (res.data.errorCode == 0) {
          this.setData({
            companyList: res.data.data || []
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },

  myOrder(userId) {
    Util.request({
      url: serverPath + '/user/myOrder',
      method: "GET",
      data: {
        userId,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        if (res.data.errorCode == 0) {
          let item = {};
          try {
            const d = JSON.parse(res.data.data.info);
            item['star'] = stars[d.starIndex].name;
            item['startTime'] = d.startDate;
            item['endTime'] = d.endDate;
            item['time'] = time[d.timeIndex].name;
            item['count'] = house[d.houseIndex].name;
            item['house'] = bed[d.bedIndex].name;
            item['statusName'] = orderStatus[res.data.data.state];
            item['createTime'] = d.createTime;
            item['cancelTime'] = d.cancelTime;
            item['remark'] = d.remark;
            item['money'] = d.money;
            item['id'] = res.data.data.id;
            item['info'] = res.data.data.info;
            item['state'] = res.data.data.state;
            if (!!d.addbed && d.addbed.length > 0) {
              item['addbed'] = d.addbed.filter(item => !!item.select).map(item => item.name).join(', ');
            }
            if (!!d.facilities && d.facilities.length > 0) {
              item['facilities'] = d.facilities.filter(item => !!item.select).map(item => item.name).join(', ');
            }
            if (!!d.breakfast && d.breakfast.length > 0) {
              item['breakfast'] = d.breakfast.filter(item => !!item.select).map(item => item.name).join(', ');
            }
          } catch (e) { }
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
    if (!!this.clearTime) {
      clearInterval(this.clearTime)
      this.clearTime = null;
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (!!this.clearTime) {
      clearInterval(this.clearTime)
      this.clearTime = null;
    }
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