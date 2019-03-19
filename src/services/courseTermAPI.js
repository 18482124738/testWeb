import ServerHost from '../../config/server.config';
import request from '@/utils/request';

// 查询API
export async function query(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseTerm/GetList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 获取当前用户的学期
export async function queryUserList(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseTerm/GetUserTremList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 获取当前用户选中一门课的学期
export async function queryCourseTerm(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseTerm/Get`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 删除API
export async function remove(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseTerm/Delete`, {
    method: 'POST',
    body: params,
  });
}
// 新增API
export async function add(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseTerm/Save`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 更新API
export async function update(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseTerm/Update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
