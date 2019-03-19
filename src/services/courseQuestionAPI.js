import ServerHost from '../../config/server.config';
import request from '@/utils/request';

// 查询单个API
export async function single(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseQuestion/Get`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 查询API
export async function query(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseQuestion/GetList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 查询当前API
export async function queryCurrent(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseQuestion/GetUserList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 删除API
export async function remove(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseQuestion/Delete`, {
    method: 'POST',
    body: params,
  });
}
// 新增API
export async function add(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseQuestion/Save`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 更新API
export async function update(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseQuestion/Update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 习题上传
export async function upload(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseQuestion/Single`, {
    method: 'POST',
    body: params,
  });
}
