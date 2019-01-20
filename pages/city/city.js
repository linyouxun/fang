// pages/city/city.js
const Util = require('../../utils/util.js');
const { serverPath } = require('../../utils/const.js');
function sortAsc(item, item2) {
  if (item.pinyin == item2.pinyin) {
    return 0
  }
  return item.pinyin > item2.pinyin ? 1 : -1;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    cityList: [],
    tempCityList: [],
    cityName: ''
  },

  selectCity(e) {
    const { city } = e.currentTarget.dataset;
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      cityName: city
    });
    wx.navigateBack();
  },

  inputChange(e) {
    let { tempCityList, cityList } = this.data;
    const data = e.detail.value;
    cityList = tempCityList.filter(function(item) {
      if (!data) {
        return true;
      }
      return (item.name.toLowerCase().indexOf(data) > -1) || (item.pinyin.toLowerCase().indexOf(data) > -1)
    })
    this.setData({
      cityList
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
    this.getLocation();
    this.getCityList();
  },  

  /***
  * 获取定位城市
  */
  getLocation() {
    Util.request({
      url: 'http://www.yoju360.com/api/location',
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
            cityName: res.data.result.cityData.city_name
          });
        }
      },
      complete() {
      }
    })
  },

  /***
  * 获取城市列表
  */
  getCityList() {
    let cityList = wx.getStorageSync('cityList')
    if (!!cityList) {
      return this.setData({
        cityList,
        tempCityList: cityList
      })
    }
    // 获取城市
    // 获取微信信息
    Util.request({
      url: serverPath + '/hotel/listCity',
      method: "GET",
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        if (res.data.errorCode == 0) {
          cityList = res.data.data.sort(sortAsc);
          wx.setStorageSync('cityList', cityList);
          this.setData({
            cityList,
            tempCityList: cityList
          })
        } else {
          console.log('城市列表加载出错了')
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