import ServerHost from '../../config/server.config';
import request from '@/utils/request';

// 查询API
export async function query(params) {
  return request(`${ServerHost.OnlineEducationServer}/FileUpLoad/GetList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 查询登录用户API
export async function queryUserList(params) {
  return request(`${ServerHost.OnlineEducationServer}/FileUpLoad/GetUserList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 删除视频API
export async function queryDelete(params) {
  return request(`${ServerHost.OnlineEducationServer}/FileUpLoad/Delete`, {
    method: 'POST',
    body:params,
  });
}
