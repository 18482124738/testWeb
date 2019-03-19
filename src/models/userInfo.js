import { query, remove, add, update, queryCurrent, queryOne } from '@/services/userInfoAPI';
import { message } from 'antd';
// import { runInNewContext } from 'vm';

export default {
  namespace: 'userInfo',

  state: {
    currentUser: {},
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      if (!response) {
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
      if (response.Success) {
        response = yield call(query, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback) callback();
      } else {
        message.error(response.Message);
      }
    },
    *remove({ payload, callback }, { call, put }) {
      let response = yield call(remove, payload);
      if (response.Success) {
        response = yield call(query, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback) callback();
      } else {
        message.error(response.Message);
      }
    },
    *update({ payload, callback }, { call, put }) {
      let response = yield call(update, payload);
      if (response.Success) {
        if (callback) callback(response);
        response = yield call(queryOne, payload);
        if (response.Data.RealName) {
          response.Data.Name = response.Data.RealName;
        }
        yield put({
          type: 'saveCurrentUser',
          payload: response.Data,
        });
        message.success('修改成功！');
      } else {
        message.error(response.Message);
      }
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response.Success === false) {
        yield put({
          type: 'saveCurrentUser',
          payload: {},
        });
      } else {
        yield put({
          type: 'saveCurrentUser',
          payload: response.Data,
        });
      }
    },
    *queryOne({ payload }, { call, put }) {
      const response = yield call(queryOne, payload);
      if (response.Success) {
        if (response.Data.RealName) {
          response.Data.Name = response.Data.RealName;
        }
        yield put({
          type: 'saveCurrentUser',
          payload: response.Data,
        });
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
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};
