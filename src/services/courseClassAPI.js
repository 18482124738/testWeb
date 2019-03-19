import ServerHost from '../../config/server.config';
import request from '@/utils/request';

// 查询单个API
export async function single(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseClass/Get`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 查询API
export async function query(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseClass/GetList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 删除API
export async function remove(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseClass/Delete`, {
    method: 'POST',
    body: params,
  });
}
// 新增API
export async function add(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseClass/Save`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 更新API
export async function update(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseClass/Update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
