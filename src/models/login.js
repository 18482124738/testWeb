import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { accountLogin, getFakeCaptcha, clientCredentials, SmsLogin } from '@/services/loginAPI';
import { queryCurrent } from '@/services/userInfoAPI';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { setToken } from '@/utils/token';
import { getverificationCodeKey, setverificationCodeKey } from '@/utils/verificationCode';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    // *login({ payload }, { call, put }) {
    //   let response = {};
    //   // 手机验证码登陆
    //   if (payload.type === 'mobile') {
    //     // 得到验证码的key值
    //     // payload.key = getverificationCodeKey();
    //     response = yield call(SmsLogin, { key: getverificationCodeKey(), ...payload });
    //     console.log(response);
    //   }
    //   // 账号密码登陆
    //   else {
    //     response = yield call(accountLogin, payload);
    //   }
    //   // Login successfully
    //   if (response.Success !== false) {
    //     yield put({
    //       type: 'changeLoginStatus',
    //       payload: {
    //         status: true,
    //         currentAuthority: 'user',
    //       },
    //     });
    //     reloadAuthorized();
    //     setToken(response);
    //     response = yield call(queryCurrent);
    //     if (response.Success === false) {
    //       yield put({
    //         type: 'userInfo/saveCurrentUser',
    //         payload: {},
    //       });
    //     } else {
    //       yield put({
    //         type: 'userInfo/saveCurrentUser',
    //         payload: response.Data,
    //       });
    //     }
    //     const urlParams = new URL(window.location.href);
    //     const params = getPageQuery();
    //     let { redirect } = params;
    //     if (redirect) {
    //       const redirectUrlParams = new URL(redirect);
    //       if (redirectUrlParams.origin === urlParams.origin) {
    //         redirect = redirect.substr(urlParams.origin.length);
    //         if (redirect.match(/^\/.*#/)) {
    //           redirect = redirect.substr(redirect.indexOf('#') + 1);
    //         }
    //       } else {
    //         window.location.href = redirect;
    //         return;
    //       }
    //     }
    //     yield put(routerRedux.replace(redirect || '/'));
    //   } else {
    //     yield put({
    //       type: 'changeLoginStatus',
    //       payload: {
    //         status: false,
    //         type: payload.type,
    //         currentAuthority: 'user',
    //       },
    //     });        
    //   }
    // },
    // // 验证码方法
    // *getCaptcha({ payload }, { call }) {
    //   // 获取授权信息
    //   const responseAuthorized = yield call(clientCredentials);
    //   // 设置token
    //   setToken(responseAuthorized);
    //   // 获取验证码的key至
    //   const response = yield call(getFakeCaptcha, payload);
    //   if (response.Success) {
    //     // 设置key
    //     setverificationCodeKey(response.Data.Id)
    //   }
    //   else {
    //     // 报错
    //   }
    // },

    // *logout(_, { put }) {
    //   yield put({
    //     type: 'changeLoginStatus',
    //     payload: {
    //       status: false,
    //       currentAuthority: 'guest',
    //     },
    //   });
    //   reloadAuthorized();
    //   setToken('');
    //   yield put(
    //     routerRedux.push({
    //       pathname: '/user/login',
    //       search: stringify({
    //         redirect: window.location.href,
    //       }),
    //     })
    //   );
    // },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
