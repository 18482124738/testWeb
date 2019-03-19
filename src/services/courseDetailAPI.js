import ServerHost from '../../config/server.config';
import request from '@/utils/request';

export async function single(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseDetail/Get`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 查询API
export async function query(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseDetail/GetList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 删除API
export async function remove(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseDetail/Delete`, {
    method: 'POST',
    body: params,
  });
}
// 新增API
export async function add(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseDetail/Save`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 更新API
export async function update(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseDetail/Update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
