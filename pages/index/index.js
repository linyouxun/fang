//index.js
//获取应用实例

const app = getApp();
const Util = require('../../utils/util.js');
const { stars, bed, time, house, priceList, serverPath } = require('../../utils/const.js');

Page({
  data: {
    stars: stars,
    bed: bed, 
    time: time,
    house: house,
    priceList: priceList,
    windowHeight: 1206,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    latitude:22.547951,
    longitude:114.127348,
    cityName: '深圳',
    isGetOrder: true, // 是否在抢单
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
    position: '',
    isShowModel: false,
    orderObj: {}
  },
  bindPrice(e) {
    const { priceList, orderObj } = this.data;
    const price = priceList[e.detail.value];
    delete orderObj['info'];
    orderObj['money'] = +orderObj['money'] + price.price;
    this.updateOrder(orderObj)
  },
  updateOrder(orderObj) {
    wx.showLoading({
      title: '订单正在加价...',
    });
    Util.request({
      url: serverPath + '/order/update',
      method: "GET",
      data: {
        orderId: orderObj.id,
        info: JSON.stringify(orderObj),
        state: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        if (res.data.errorCode == 0) {
          this.setData({
            orderObj
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  moreDetail() {
    wx.navigateTo({
      url: '/pages/moreDetail/moreDetail',
    });
  },
  resetData() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = 11;
    const dateStr = year + '-' + '00'.substr(0, 2 - ((month + 1) + '').length) + (month + 1) + '-' + '00'.substr(0, 2- (day + '').length) + day ;
    this.setData({
      money: 0,
      startDate: dateStr,
      endDate: dateStr,
      starIndex: 0,
      bedIndex: 0,
      timeIndex: 0,
      houseIndex: 0,
      position: ''
    })
  },
  sendForm() {
    let { money, startDate, endDate, starIndex, bedIndex, timeIndex, houseIndex, position, userInfo, latitude, longitude } = this.data;
    let breakfast = [];
    let addbed = [];
    let facilities = [];
    let remark = '';
    try {
      breakfast = wx.getStorageSync('breakfast');
      addbed = wx.getStorageSync('addbed');
      facilities = wx.getStorageSync('facilities');
      remark = wx.getStorageSync('remark');
    } catch (e) {
      // Do something when catch error
    }
    money = parseInt(money);
    const params = { 
      money, 
      startDate, 
      endDate, 
      starIndex, 
      bedIndex, 
      timeIndex, 
      houseIndex, 
      position,
      createTime: new Date().Format('yyyy-MM-dd hh:mm:ss'),
      breakfast: breakfast, 
      addbed: addbed, 
      facilities: facilities, 
      remark
    };
    if (isNaN(money)) {
      return wx.showToast({
        title: '输入非法',
        icon: 'none'
      });
    }
    if (money < 10) {
      return wx.showToast({
        title: '价格太低了',
        icon: 'none'
      });
    }
    wx.showLoading({
      title: '正在发布中...',
    });
    Util.request({
      url: serverPath + '/order/add',
      method: "GET",
      data: {
        info: JSON.stringify(params),
        userId: userInfo.id,
        position: [longitude, latitude].join(','),
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        if (res.data.errorCode == 0) {
          this.setData({
            isGetOrder: true,
            more: false,
            orderObj: Object.assign(params, {id: res.data.data})
          })
          return wx.showToast({
            title: '发布成功',
            icon: 'none'
          });
        }
      },
      complete() {
        wx.hideLoading();
      }
    })

  },

  myOrder() {
    console.log('log', '抢单');
    Util.request({
      url: serverPath + '/user/myOrder',
      method: "GET",
      data: {
        userId: app.globalData.userInfo.id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        if (res.data.errorCode == 0) {
          let info = {};
          try {
            info = JSON.parse(res.data.data.info || '{}')
          } catch(e) {}
          // 是否在抢单
          if (!!res.data.data.id) {
            this.setData({
              isGetOrder: true,
              orderObj: Object.assign(info, res.data.data, {
                position: info.position
              })
            })
            this.getLocation(true);
          } else {
            this.setData({
              isGetOrder: false,
              orderObj: {}
            })
            this.getLocation(false);
          }
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },

  bindChange(e) {
    this.setData({
      [e.target.dataset.name]: e.detail.value
    })
  },
  bindtap(e) {
  },
  addPrice() {
    console.log('price');
  },
  moreInfo() {
    const { more, isGetOrder } = this.data;
    if (isGetOrder) return;
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
    const { markers } = this.data;
    for(let i = 1; i < markers.length; i++) {
      if (markers[i].id == e.markerId) {
        // 更新位置
        this.setData({
          position: markers[i].street
        })
        break;
      }
    }
  },
  controltap(e) {
    console.log(e.controlId)
  },
  regionchange(e) {
    this.mapCtx.getCenterLocation({
      success:(res) => {
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
  onLoad: function (options) {
    this.setData({
      windowHeight: 750 / wx.getSystemInfoSync().windowWidth * wx.getSystemInfoSync().windowHeight
    });
    this.resetData();
    this.mapCtx = wx.createMapContext('map');
    // if (!!options.cityName) {
    //   // 加载酒店列表
    //   this.getHotelList({
    //     // longi: res.data.result.lng,
    //     // lati: res.data.result.lat,
    //     // distance: 10000,
    //     // longi: 114.022637,
    //     // lati: 22.547901,
    //     // distance: 10000,
    //     // cityName: '深圳'  经度:114.022637 纬度: 22.547901
    //     cityName: options.cityName
    //   })
    // } else {
    //   // 获取定位信息
    //   this.getLocation();
    // }

    // // this.mapCtx.moveToLocation();
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },

  /***
   * 获取城市酒店列表
   * params 定位参数
   */
  getHotelList(params) {
    console.log('log', '酒店列表', params);
    // 获取城市
    // 获取微信信息
    Util.request({
      url: serverPath + '/hotel/listHotel',
      method: "GET",
      data: params,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        if (res.data.errorCode == 0) {
          if (!!res.data.data) {
            if (res.data.data.length > 0) {
              const markers = res.data.data.map(item => {
                const ll = item.map.split(',');
                let lat = 0;
                let lon = 0;
                if (ll.length > 0) {
                  lon = ll[0];
                  lat = ll[1];
                }
                return {
                  street: item.street,
                  telephone: item.telephone,
                  callout: {
                    content: item.hotelName + '\r\n地址: ' + (item.street || '无') + '\r\n电话: ' + (item.telephone || '无'),
                    color: '#aaa',
                    padding: '10px',
                    borderWidth: '1px',
                    borderColor: '#efefef',
                    borderRadius: '5px',
                  },
                  id: item.hotelId,
                  latitude: +lat,
                  longitude: +lon,
                  name: item.hotelName,
                  iconPath: '/images/hotel.png'
                }
              });
              const pos = {
                callout: {
                  content: '选择中心点',
                  color: '#aaa',
                  padding: '5px',
                  borderWidth: '1px',
                  borderColor: '#efefef',
                  borderRadius: '5px',
                },
                id: 1,
                latitude: markers[0].latitude,
                longitude: markers[0].longitude,
                name: '选择中心点',
                iconPath: '/images/location.png'
              }
              let data = {
                markers: [pos, ...markers]
              }
              if (markers.length > 0) {
                data['position'] = markers[0].street;
                data['latitude'] = markers[0].latitude;
                data['longitude'] = markers[0].longitude;
              }
              this.setData(data)

            } else {
              wx.showModal({
                title: '该城市还没有引入相关酒店',
                content: '是否查找其他周边城市',
                success(res) {
                  wx.navigateTo({
                    url: '/pages/city/city',
                  })
                  if (res.confirm) {
                    console.log('用户点击确定');
                  } else if (res.cancel) {
                    console.log('用户点击取消');
                  }
                }
              })
            }
          } else {
            // wx.showToast({
            //   title: '选择区域没有酒店',
            // })
          }
        } else {
          wx.showModal({
            title: '该城市还没有引入相关酒店',
            content: '是否查找其他周边城市',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  /***
   * 设置经纬度
   * flat 是否不加载酒店列表
   */
  getLocation(flat) {
    console.log('log', '定位', flat);
    Util.request({
      url: 'https://sso.yoju360.net/api/location',
      method: "GET",
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        if (res.data.code == 200) {
          // res.data.result.lng = 114.022637;
          // res.data.result.lat = 22.547901;
          this.setData({
            latitude: res.data.result.lat,
            longitude: res.data.result.lng,
            cityName: res.data.result.cityData.city_name
          });
          if (!flat) {
            // 加载酒店列表
            this.getHotelList({
              longi: res.data.result.lng,
              lati: res.data.result.lat,
              distance: 10000,
              // longi: 114.022637,
              // lati: 22.547901,
              // distance: 10000,
              // cityName: '深圳'  经度:114.022637 纬度: 22.547901
              // cityName: '广州'
            })
          }
        }
      },
      complete() {
      }
    })
  },

  hideMode() {
    this.setData({
      isShowModel: false
    })
  },
  getUserInfo: function(e) {
    if (e.detail.errMsg == 'getUserInfo:ok') {
      // 获取到用户信息
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      Util.request({
        url: serverPath + '/user/bindWechat',
        method: "GET",
        data: {
          openId: app.globalData.openId,
          // userInfo: JSON.stringify(Object.assign(e.detail.userInfo, {
          //   "nickName": "眼睛"
          // }))
          userInfo: JSON.stringify(e.detail.userInfo)
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: (res) => {
          if (res.data.errorCode == -1) {
            // 没有找到用户信息
            this.setData({
              isShowModel: true
            });
          } else {
            // 获取微信信息
            Util.request({
              url: serverPath + '/user/get',
              method: "GET",
              data: {
                openId: app.globalData.openId
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: (res) => {
                if (res.data.errorCode == -1) {
                  // 没有找到用户信息
                  this.setData({
                    isShowModel: true
                  });
                } else {
                  // 获取用户信息
                  app.globalData.userInfo = res.data.data
                  this.setData({
                    userInfo: res.data.data,
                    hasUserInfo: true
                  })
                  // 是否在抢单
                  this.myOrder();
                }
              },
              complete() {
                wx.hideLoading();
              }
            })
          }
        },
        complete() {
          wx.hideLoading();
        }
      })
    } else {
      this.setData({
        isShowModel: true
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: '喵个房',
      desc: '快速定位查找你所需要的酒店',
      path: '/pages/index/index'
    }
  },

  onShow() {
    console.log('onShow');
    const { cityName, isGetOrder } = this.data;
    // 原来状态是抢单
    if (isGetOrder) {
      if (!app.globalData.userInfo) {
        this.setData({
          isGetOrder: false
        });
        // 登录
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.showLoading({
              title: '正在登陆...',
            });
            Util.request({
              url: serverPath + '/user/wechatLogin',
              method: "GET",
              data: {
                code: res.code
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: (res) => {
                wx.hideLoading();
                if (res.data.errorCode === 0) {
                  app.globalData.openId = res.data.data;
                  wx.showLoading({
                    title: '正在获取登陆信息...',
                  });
                  // 获取微信信息
                  Util.request({
                    url: serverPath + '/user/get',
                    method: "GET",
                    data: {
                      openId: res.data.data
                    },
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success: (res) => {
                      if (res.data.errorCode == -1) {
                        // 没有找到用户信息
                        this.setData({
                          isShowModel: true
                        });
                      } else {
                        // 获取用户信息
                        app.globalData.userInfo = res.data.data
                        this.setData({
                          userInfo: res.data.data,
                          hasUserInfo: true
                        });
                        // 是否在抢单
                        this.myOrder();
                      }
                    },
                    complete() {
                      wx.hideLoading();
                    }
                  })
                } else {
                  // todo 登陆失败
                }
              },
              fail() {
                wx.hideLoading();
              }
            })
          }
        });
      } else {
        // 是否在抢单
        console.log('登陆时已有用户信息')
        this.myOrder();
      }
      return;
    };
    // 加载酒店列表
    this.getHotelList({
      // longi: res.data.result.lng,
      // lati: res.data.result.lat,
      // distance: 10000,
      // longi: 114.022637,
      // lati: 22.547901,
      // distance: 10000,
      // cityName: '深圳'  经度:114.022637 纬度: 22.547901
      cityName: cityName
    })
  }
})
