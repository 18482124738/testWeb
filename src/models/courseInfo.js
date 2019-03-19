
import {
  single,
  query,
  queryInterest,
  queryUserList,
  remove,
  update,
  updateStatus,
} from '@/services/courseInfoApi';
import { single as detailSingle } from '@/services/courseDetailAPI';
import { message } from 'antd';
// import { runInNewContext } from 'vm';

export default {
  namespace: 'courseInfo',

  state: {
    data: {
      Rows: [],
      pagination: {},
    },
    interest: [],
    current: {},
    creatForm: {
      CourseInfo: {
        IsCharge: true,
        Price: 0.0,
      },
      CourseDetail: {},
      CourseTerm: {},
      InstructorId: '',
      TeacherId: '',
      HeadmasterId: '',
    },
  },
  effects: {
    *fetchInterest({ payload }, { call, put }) {
      const response = yield call(queryInterest, payload);
      if (response.Success === false) {
        message.error(response.Message);
      } else {
        yield put({
          type: 'saveInterest',
          payload: response,
        });
      }
    },
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
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(query, payload);
      if (response.Success === false) {
        message.error(response.Message);
      } else {
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback) callback(response);
      }
    },
    // 获取教师自己的课程
    *fetchUserList({ payload, callback }, { call, put }) {
      const response = yield call(queryUserList, payload);
      if (response.Success === false) {
        message.error(response.Message);
      } else {
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback) callback(response);
      }
    },
    *remove({ payload, callback }, { call, put }) {
      let response = yield call(remove, payload);
      if (response.Success) {
        response = yield call(queryUserList, payload);
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
        response = yield call(queryUserList, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback) callback(response);
      } else {
        message.error(response.Message);
      }
    },
    *updateStatus({ payload, callback }, { call, put }) {
      let response = yield call(updateStatus, payload);
      if (response.Success) {
        response = yield call(queryUserList, payload);
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback) callback(response);
      } else {
        message.error(response.Message);
      }
    },
    *editInit({ payload, callback }, { call, put }) {
      let { CourseDetail } = payload;
      if (payload.updateStatus === "update") {
        const response = yield call(detailSingle, { courseInfoId: payload.Id });
        if (response.Success) {
          CourseDetail = response.Data;
          if (callback) callback(response);
        } else {
          message.error(response.Message);
        }
        yield put({
          type: 'saveStepFormData',
          payload: {
            ...payload,
            CourseDetail
          },

        });
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
    saveInterest(state, action) {
      return {
        ...state,
        interest: action.payload,
      };
    },
    saveCurrent(state, action) {
      return {
        ...state,
        current: action.payload,
      };
    },
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        creatForm: {
          ...state.step,
          ...payload,
        },
      };
    },
  },
};
