import { fakeRegister } from '@/services/registerAPI';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { getverificationCodeKey } from '@/utils/verificationCode';
import { message } from 'antd';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(fakeRegister, { key: getverificationCodeKey(), ...payload });
      if (!response) {
        message.error('请求服务器出错');
      }
      if (response.Success === true) {
        yield put({
          type: 'registerHandle',
          payload: response,
        });
      } else {
        message.error(response.Message);
      }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.Success,
      };
    },
  },
};
