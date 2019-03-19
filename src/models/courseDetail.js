import { single, query, remove, add, update } from '@/services/courseDetailAPI';
import { message } from 'antd';
// import { runInNewContext } from 'vm';

export default {
  namespace: 'courseDetail',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    current: {}
  },
  effects: {
    *fetchSingle({ payload }, { call, put }) {
      const response = yield call(single, payload);
      if (response.Success === false) {
        message.error(response.Message);
      } else {
        yield put({
          type: 'saveCurrent',
          payload: response.Data,
        });
      }
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
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
    *update({ payload }, { call, put }) {
      const response = yield call(update, payload);
      if (response.Success === false) {
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
    saveCurrent(state, action) {
      return {
        ...state,
        current: action.payload,
      };
    },
  },
};
