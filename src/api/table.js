import request from '@/utils/request'

export function getShopList(data) {
  return request({
    url: '/goods/list',
    method: 'post',
    data
  })
}
export function updateShopList(data) {
  return request({
    url: '/goods/update',
    method: 'post',
    data
  })
}
export function addShopList(data) {
  return request({
    url: '/goods/add',
    method: 'post',
    data
  })
}

export function deleteShopList(data) {
  return request({
    url: '/goods/remove',
    method: 'post',
    data
  })
}
export function orderList2(data) {
  return request({
    url: '/goods/order/list',
    method: 'post',
    data
  })
}
export function updateOrderList2(data) {
  return request({
    url: '/goods/order/confirm',
    method: 'post',
    data
  })
}
export function subscriptionList(data) {
  return request({
    url: '/order/list',
    method: 'post',
    data
  })
}
export function getList(data) {
  return request({
    url: '/nft/list',
    method: 'post',
    data
  })
}
export function addNft(data) {
  return request({
    url: '/nft/create',
    method: 'post',
    data
  })
}
export function updateNft(data) {
  return request({
    url: '/nft/update',
    method: 'post',
    data
  })
}
export function listingNft(data) {
  return request({
    url: '/nft/listing',
    method: 'post',
    data
  })
}
export function deleteNft(data) {
  return request({
    url: '/nft/remove',
    method: 'post',
    data
  })
}
export function queryTXlist(data) {
  return request({
    url: '/points/withdraw/list',
    method: 'post',
    data
  })
}
export function queryNftTXlist(data) {
  return request({
    url: '/nft/request/list',
    method: 'post',
    data
  })
}
export function queryNftTXFinish(data) {
  return request({
    url: '/nft/updatewithdrawstatus',
    method: 'post',
    data
  })
}
export function updateTXlist(data) {
  return request({
    url: '/points/withdraw/update',
    method: 'post',
    data
  })
}





export function getUserList(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}
export function setUserPoint(data) {
  return request({
    url: '/user/setpoint',
    method: 'post',
    data
  })
}
export function userAudit(data) {
  return request({
    url: '/admin_update_user_certif',
    method: 'post',
    data
  })
}
export function updateStatus(data) {
  return request({
    url: '/admin_update_order',
    method: 'post',
    data
  })
}
export function updateAmount(data) {
  return request({
    url: '/admin_update_order_amount',
    method: 'post',
    data
  })
}
export function setCommission(data) {
  return request({
    url: '/admin_update_user_commission',
    method: 'post',
    data
  })
}

export function getAnnounceList(data) {
  return request({
    url: '/admin_announce_list',
    method: 'post',
    data
  })
}
export function updateAnnounce(data) {
  return request({
    url: '/admin_edit_announce',
    method: 'post',
    data
  })
}
export function addAnnounce(data) {
  return request({
    url: '/admin_add_announce',
    method: 'post',
    data
  })
}
export function topUpList(data) {
  return request({
    url: '/admin_deposits_list',
    method: 'post',
    data
  })
}
export function internaltransfer(data) {
  return request({
    url: '/admin_internaltransfer',
    method: 'post',
    data
  })
}
export function creatOrder(data) {
  return request({
    url: '/admin_add_order',
    method: 'post',
    data
  })
}
export function orderList(data) {
  return request({
    url: '/nft/list',
    method: 'post',
    data
  })
}
export function editOrder(data) {
  return request({
    url: '/admin_edit_order',
    method: 'post',
    data
  })
}
export function deleteOrder(data) {
  return request({
    url: '/admin_delete_order',
    method: 'post',
    data
  })
}
export function setCountdown(data) {
  return request({
    url: '/admin_set_countdown',
    method: 'post',
    data
  })
}
export function userAuditList(data) {
  return request({
    url: '/admin_user_list2',
    method: 'post',
    data
  })
}
export function getuserInfo(data) {
  return request({
    url: '/admin_user_info',
    method: 'post',
    data
  })
}
export function updateUserTradable(data) {
  return request({
    url: '/admin_update_user_tradable',
    method: 'post',
    data
  })
}
export function queryOrder(data) {
  return request({
    url: '/admin_query_order',
    method: 'post',
    data
  })
}
export function sendMsg(data) {
  return request({
    url: '/admin_send_sms',
    method: 'post',
    data
  })
}
export function setCopy(data) {
  return request({
    url: '/admin_set_copy',
    method: 'post',
    data
  })
}
