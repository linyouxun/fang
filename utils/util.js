const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const request = (params) => {
  const { success, complete } = params;
  delete params['success'];
  delete params['complete'];
  wx.request(Object.assign(params, {
    complete: function (res) {
      if (!!complete) {
        complete(res)
      }
    },
    success: function (res) {
      if (!!success) {
        success(res)
      }
    }
  }));
}

module.exports = {
  formatTime: formatTime,
  request
}
