import { query, remove, add, update } from '@/services/courseCatalogAPI';
import { message } from 'antd';
// import { runInNewContext } from 'vm';

export default {
  namespace: 'courseCatalog',

  state: {
    data: {
      Rows: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload ,callback}, { call, put }) {
      const response = yield call(query, payload);
      if (response.Success===false) {
        message.error(response.Message);
      } else {
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback) callback(response);

      }
    },
    *add({ payload, callback }, { call, put }) {
      let response = yield call(add, payload);
      if (response.Success) {
        response = yield call(query, {courseTermId:payload.courseTermId});
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
      const response = yield call(remove, payload);
      if (response.Success) {
        // response = yield call(query, payload);
        // yield put({
        //   type: 'save',
        //   payload: response,
        // });
        if (callback) callback(response);
        message.success(response.Message);
      } else {
        message.error(response.Message);
      }
    },
    *update({ payload, callback }, { call, put }) {
      let response = yield call(update, payload, {courseTermId:payload.courseTermId});
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
