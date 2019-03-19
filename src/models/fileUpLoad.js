import { query, queryUserList, queryDelete } from '@/services/fileUpLoadAPI';
import { message } from 'antd';
import { replace } from 'react-router-redux';
// import { runInNewContext } from 'vm';

export default {
  namespace: 'fileUpLoad',

  state: {
    data: {
      Rows: [],
      pagination: {},
      Total: '',
      pageNumber: '',
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
    *fetchUserList({ payload }, { call, put }) {
      const response = yield call(queryUserList, payload);
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
    *fetchDelete({ payload, callback }, { call, put }) {
      const response = yield call(queryDelete, payload);
      if(!response){
        message.error('请求服务器出错');
      }
      if (response.Success === false) {
        message.error(response.Message);
      } else {
        yield put({
          type: 'delete',
          payload: response,
        });
        if (callback) callback(response);
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
