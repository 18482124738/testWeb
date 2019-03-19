import { query, remove, add, update, treeList } from '@/services/courseCategoryAPI';
import { message } from 'antd';
// import { runInNewContext } from 'vm';

export default {
  namespace: 'courseCategory',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    tree:[]
  },
  effects: {
    *query({ payload }, { call, put }) {
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
        response = yield call(query, {courseTermId:payload.courseTerId});
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
    *treeList({ payload, callback }, { call, put }) {
      const response = yield call(treeList, payload);
      if (response.Success) {
        yield put({
          type: 'saveTree',
          payload: response.Data,
        });
        if (callback) callback(response.Data);
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
     saveTree(state, action) {
      return {
        ...state,
        tree: action.payload,
      };
    },
  },
};
