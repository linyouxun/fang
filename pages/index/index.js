//index.js
//获取应用实例
const app = getApp();
const { stars, bed, time, house } = require('../../utils/const.js');

Page({
  data: {
    stars: stars,
    bed: bed, 
    time: time,
    house: house,
    windowHeight: 1206,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    latitude:22.547951,
    longitude:114.127348,
    // 标注信息
    markers: [{
      callout: {
        content: '选择中心点',
        color: '#aaa',
        padding: '5px',
        borderWidth: '1px',
        borderColor: '#efefef',
        borderRadius: '5px',
      },
      id: 2,
      latitude: 22.547951,
      longitude: 114.127348,
      name: '选择中心点',
      iconPath: '/images/location.png'
    // }, {
    //   callout: {
    //     content: '汉庭酒店(广州天河店)2\r\n 地址:广州市天河区天河路97-99号\r\n 电话:(020)22132600',
    //     color: '#aaa',
    //     padding: '5px',
    //     borderWidth: '1px',
    //     borderColor: '#efefef',
    //     borderRadius: '5px',
    //   },
    //   // label: {
    //   //   content: '汉庭酒店1',
    //   //   fontSize: '25rpx',
    //   //   color: '#ff0000'
    //   // },
    //   id: 1,
    //   latitude: 23.10346770738263,
    //   longitude: 113.33679378845213,
    //   name: '汉庭酒店(广州天河店)',
    //   iconPath: '/images/hotel.png'
    }],
    // circles: {
    //   latitude: 23.10346770738263,
    //   longitude: 113.33679378845213,
    //   color: '#0f0',
    //   fillColor: '#f0f',
    //   radius: 10,
    //   strokeWidth: 1
    // }
    more: false,
    // 统计信息
    money: 0,
    startDate: '',
    endDate: '',
    position: '',
    starIndex: 0,
    bedIndex: 0,
    timeIndex: 0,
    houseIndex: 0,
  },
  resetData() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = 11;
    console.log(day);
    const dateStr = year + '-' + '00'.substr(0, 2 - ((month + 1) + '').length) + (month + 1) + '-' + '00'.substr(0, 2- (day + '').length) + day ;
    this.setData({
      money: 0,
      startDate: dateStr,
      endDate: dateStr,
      starIndex: 0,
      bedIndex: 0,
      timeIndex: 0,
      houseIndex: 0,
    })
  },
  sendForm() {
    const { money, startDate, endDate, starIndex, bedIndex, timeIndex, houseIndex } = this.data;
    console.log(money, startDate, endDate, starIndex, bedIndex, timeIndex, houseIndex);
  },
  bindChange(e) {
    this.setData({
      [e.target.dataset.name]: e.detail.value
    })
  },
  bindtap(e) {
  },
  moreInfo() {
    const { more } = this.data;
    this.setData({
      more: !more
    })
  },
  translateMarker: function () {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 23.10229,
        longitude: 113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  markertap(e) {
    console.log(e)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  regionchange(e) {
    this.mapCtx.getCenterLocation({
      success:(res) => {
        console.log(res.longitude)
        console.log(res.latitude)
        const markers = this.data.markers;
        markers[0].longitude = res.longitude;
        markers[0].latitude = res.latitude;
        this.setData({
          markers
        })
      }
    })
  },
  //事件处理函数
  bindViewTap: function() {
    console.log('更新头像信息');
  },
  onLoad: function () {
    this.setData({
      windowHeight: 750 / wx.getSystemInfoSync().windowWidth * wx.getSystemInfoSync().windowHeight
    });
    this.resetData();
    this.mapCtx = wx.createMapContext('map');
    // this.mapCtx.moveToLocation();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
