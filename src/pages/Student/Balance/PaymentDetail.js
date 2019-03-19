import React, { PureComponent, Fragment } from 'react';
import { Alert } from 'antd';
import { connect } from 'dva';
import SimpleTable from '@/components/SimpleTable';
import layoutStyles from '../StudentLayout.less';


const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


// 课程管理
@connect(({ paymentDetail, loading }) => ({
  paymentDetail,
  loading: loading.models.courseInfo,
}))
class PaymentDetail extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  columns = [{
    title: '类型',
    dataIndex: 'Name',
  }, {
    title: '时间',
    dataIndex: 'CreateTime'
  }, {
    title: '金额',
    dataIndex: 'Price',
  }];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'paymentDetail/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      PageNumber: pagination.current,
      PageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'paymentDetail/fetch',
      payload: params,
    });
  };

  creatCourse = () => {
    window.location.href = "/user/teacher/tearchMenu/creatCourse";
  };

  render() {
    const {
      paymentDetail: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <div className={layoutStyles.rightModule}>
        <div style={{ position: 'relative' }}>
          <h2>我的余额</h2>
        </div>
        <div style={{ marginTop: 10 }}>
          <Alert
            message={
              <Fragment>
                积分兑换余额有效期为7天，兑换后请尽快使用
              </Fragment>
            }
            type="info"
            showIcon
          />
          <h2>0.00</h2>
        </div>
        <div style={{ position: 'relative' }}>
          <h2>余额明细</h2>
        </div>
        <div style={{ marginTop: 40 }}>
          <SimpleTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </div>
    );
  }
}

export default PaymentDetail;

