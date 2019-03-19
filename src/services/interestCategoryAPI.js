import ServerHost from '../../config/server.config';
import request from '@/utils/request';

// 查询API
export async function single(params) {
  return request(`${ServerHost.OnlineEducationServer}/InterestCategory/Get`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 查询API
export async function query(params) {
  return request(`${ServerHost.OnlineEducationServer}/InterestCategory/GetList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 删除API
export async function remove(params) {
  return request(`${ServerHost.OnlineEducationServer}/InterestCategory/Delete`, {
    method: 'POST',
    body: params,
  });
}
// 新增API
export async function add(params) {
  return request(`${ServerHost.OnlineEducationServer}/InterestCategory/Save`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 更新API
export async function update(params) {
  return request(`${ServerHost.OnlineEducationServer}/InteresetCategory/Update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
