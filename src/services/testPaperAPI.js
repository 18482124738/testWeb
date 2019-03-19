import ServerHost from '../../config/server.config';
import request from '@/utils/request';

// 查询单个API
export async function single(params) {
    return request(`${ServerHost.OnlineEducationServer}/TestPaper/Get`, {
        method: 'POST',
        body: {
            ...params
        },
    });
}
// 查询API
export async function query(params) {
    return request(`${ServerHost.OnlineEducationServer}/TestPaper/GetList`, {
        method: 'POST',
        body: {
            ...params
        },
    });
}
// 删除API
export async function remove(params) {
    return request(`${ServerHost.OnlineEducationServer}/TestPaper/Delete`, {
        method: 'POST',
        body: params,
    });
}
// 新增API
export async function add(params) {
    return request(`${ServerHost.OnlineEducationServer}/TestPaper/Save`, {
        method: 'POST',
        body: {
            ...params
        },
    });
}
// 新增试卷保存API
export async function testPaperSave(params) {
    return request(`${ServerHost.OnlineEducationServer}/TestPaper/TestPaperSave`, {
        method: 'POST',
        body: {
            ...params
        },
    });
}
// 更新API
export async function update(params) {
    return request(`${ServerHost.OnlineEducationServer}/TestPaper/Update`, {
        method: 'POST',
        body: {
            ...params
        },
    });
}


