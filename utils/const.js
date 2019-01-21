const stars = [{ id: '1', name: '全部' }, { id: '2', name: '三星以下' }, { id: '3', name: '三星' }, { id: '4', name: '四星' }, { id: '5', name: '五星' }, { id: '6', name: '六星' }];
const bed = [{ id: '1', name: '单床房' }, { id: '2', name: '双床房' }, { id: '3', name: '套房' }];
const time = [{ id: '1', name: '17:00' }, { id: '2', name: '18:00' }, { id: '3', name: '19:00' }, { id: '4', name: '20:00' }, { id: '5', name: '21:00' }, { id: '6', name: '22:00' }, { id: '7', name: '23:00' }, { id: '8', name: '次日00:00' }, { id: '9', name: '次日01:00' }, { id: '10', name: '次日02:00' }, { id: '11', name: '次日03:00' }, { id: '12', name: '次日04:00' }, { id: '13', name: '次日05:00' }, { id: '14', name: '次日06:00' }];
const house = [{ id: '1', name: '1间' }, { id: '2', name: '2间' }, { id: '3', name: '3间' }, { id: '4', name: '4间' }, { id: '5', name: '5间' }, { id: '6', name: '6间' }, { id: '7', name: '7间' }, { id: '8', name: '8间' }, { id: '9', name: '9间' }, { id: '10', name: '10间' }]
const breakfast = [{
  id: '0',
  name: '含单早'
}, {
  id: '0',
  name: '含双早'
}]

const addbed = [{
  id: '0',
  name: '加床'
}]

const facilities = [{
  id: '0',
  name: '洗衣服务'
}, {
  id: '0',
  name: '会议厅'
}, {
  id: '0',
  name: '商场'
}, {
  id: '0',
  name: '商务中心'
}, {
  id: '0',
  name: '无烟房'
}, {
  id: '0',
  name: '免费旅游交通图'
}, {
  id: '0',
  name: '接站服务'
}, {
  id: '0',
  name: '24小时前台服务'
}, {
  id: '0',
  name: '免费瓶装水'
}, {
  id: '0',
  name: '免费洗漱用品'
}, {
  id: '0',
  name: '24小时热水'
}, {
  id: '0',
  name: '吹风机'
}, {
  id: '0',
  name: '电热水壶'
}, {
  id: '0',
  name: '残疾人客房'
}, {
  id: '0',
  name: '专职行李员'
}, {
  id: '0',
  name: '餐厅'
}, {
  id: '0',
  name: '自动取款机'
}, {
  id: '0',
  name: 'WIFI无线上网'
}, {
  id: '0',
  name: '免费停车场'
}, {
  id: '0',
  name: '叫醒服务'
}, {
  id: '0',
  name: '接机服务'
}, {
  id: '0',
  name: '叫车服务'
}, {
  id: '0',
  name: '国际长途电话'
}, {
  id: '0',
  name: '前台保险箱'
}, {
  id: '0',
  name: '邮政服务'
}, {
  id: '0',
  name: '票务服务'
}, {
  id: '0',
  name: '电报'
}, {
  id: '0',
  name: '行李寄存'
}, {
  id: '0',
  name: '电梯'
}, {
  id: '0',
  name: '医务室'
}]

const orderStatus = {
  '1': '发布',
  '2': '完成',
  '3': '取消'
}

const priceList = [{ id: '1', price: 10, name: '10元' }, { id: '2', price: 20, name: '20元' }, { id: '3', price: 30, name: '30元' }, { id: '4', price: 40, name: '40元' }, { id: '5', price: 50, name: '50元' }, { id: '6', price: 60, name: '60元' }];

// const serverPath = 'http://127.0.0.1';
// const serverPath = 'http://47.106.174.88:8080/api/app/mock/17';
// const serverPath = 'http://118.24.37.163:5605';
const serverPath = 'https://saas.jia360.com/hapi';

module.exports = {
  stars: stars,
  bed: bed,
  time: time,
  house: house,
  serverPath,
  orderStatus,
  breakfast,
  addbed,
  facilities,
  priceList
}
