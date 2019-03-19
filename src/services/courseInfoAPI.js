import ServerHost from '../../config/server.config';
import request from '@/utils/request';

// 查询单个API
export async function single(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseInfo/Get`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 查询兴趣课程列表
export async function queryInterest(params) {
  return request(`${ServerHost.OnlineEducationServer}//CourseInfo/HobbiesInitializationList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 查询API
export async function query(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseInfo/GetList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 查询API
export async function queryUserList(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseInfo/GetUserList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 删除API
export async function remove(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseInfo/Delete`, {
    method: 'POST',
    body: params,
  });
}
// 新增API
export async function add(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseInfo/CreateCourse`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 更新API
export async function update(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseInfo/Update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 修改发布状态API
export async function updateStatus(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseInfo/UpdateStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
