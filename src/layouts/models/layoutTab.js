export default {
  namespace: 'layoutTab',

  state: {
    currentKey: 'index'
  },
  effects: {
    *change({ payload }, { put }) {
      const key = payload;
      yield put({
        type: 'save',
        payload: key,
      });
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        currentKey: action.payload,
      };
    },
  },
};
