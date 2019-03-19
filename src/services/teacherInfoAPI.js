import ServerHost from '../../config/server.config';
import request from '@/utils/request';

// 查询API
export async function query(params) {
  return request(`${ServerHost.OnlineEducationServer}/TeacherInfo/GetList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 查询API
export async function queryCurrent() {
  return request(`${ServerHost.OnlineEducationServer}/TeacherInfo/Get`, {
    method: 'POST'
  });
}
// 删除API
export async function remove(params) {
  return request(`${ServerHost.OnlineEducationServer}/TeacherInfo/Delete`, {
    method: 'POST',
    body: params,
  });
}
// 新增API
export async function add(params) {
  return request(`${ServerHost.OnlineEducationServer}/TeacherInfo/Save`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 更新API
export async function update(params) {
  return request(`${ServerHost.OnlineEducationServer}/TeacherInfo/Update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
