import { query, remove, add, update } from '@/services/resourceFolderApi';
import { message } from 'antd';
// import { runInNewContext } from 'vm';

export default {
  namespace: 'resourceFolder',

  state: {
    data: {
      Rows: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      if(!response){
        message.error('请求服务器出错');
      }
      if (response.Success === false) {
        message.error(response.Message);
      } else {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *add({ payload, callback }, { call, put }) {
      let response = yield call(add, payload);
      if (callback) callback(response);
      if (response.Success) {
        response = yield call(query, payload);
        yield put({
          type: 'save',
          payload: response,
        });
      } else {
        message.error(response.Message);
      }
    },
    *remove({ payload, callback }, { call, put }) {
      let response = yield call(remove, payload.ids);
      if (response.Success) {
        if (callback) callback(response);
        message.success('删除成功！');
        response = yield call(query, payload.folderquery);
        yield put({
          type: 'save',
          payload: response,
        });
      } else {
        message.error(response.Message);
      }
    },
    *update({ payload, callback }, { call, put }) {
      let response = yield call(update, payload);
      if (response.Success) {
        response = yield call(query, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback) callback(response);
      } else {
        message.error(response.Message);
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
