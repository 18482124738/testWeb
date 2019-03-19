import ServerHost from '../../config/server.config';
import request from '@/utils/request';

// 查询API
export async function query(params) {
  return request(`${ServerHost.OnlineEducationServer}/UserInfo/GetList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 查询API
export async function queryCurrent() {
  return request(`${ServerHost.OnlineEducationServer}/UserInfo/GetCurrent`, {
    method: 'POST'
  });
}
// 查询API
export async function queryOne() {
  return request(`${ServerHost.OnlineEducationServer}/UserInfo/Get`, {
    method: 'POST'
  });
}
// 删除API
export async function remove(params) {
  return request(`${ServerHost.OnlineEducationServer}/UserInfo/Delete`, {
    method: 'POST',
    body: params,
  });
}
// 新增API
export async function add(params) {
  return request(`${ServerHost.OnlineEducationServer}/UserInfo/Save`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 更新API
export async function update(params) {
  return request(`${ServerHost.OnlineEducationServer}/UserInfo/Update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
