import ServerHost from '../../config/server.config';
import request from '@/utils/request';

// 查询API
export async function single(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseCategory/Get`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 查询API
export async function query(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseCategory/GetList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 删除API
export async function remove(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseCategory/Delete`, {
    method: 'POST',
    body: params,
  });
}
// 新增API
export async function add(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseCategory/Save`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 更新API
export async function update(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseCategory/Update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 树状结构API
export async function treeList(params) {
  return request(`${ServerHost.OnlineEducationServer}/CourseCategory/GetTreeList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
