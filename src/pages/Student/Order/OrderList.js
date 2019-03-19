import React, { PureComponent } from 'react';
import { Tabs, Divider } from 'antd';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
import layoutStyles from '../StudentLayout.less';

const { TabPane } = Tabs;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


// 课程管理
@connect(({ userOrder, loading }) => ({
  userOrder,
  loading: loading.models.courseInfo,
}))
class OrderList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  columns = [{
    title: '课程信息',
    dataIndex: 'Name',
  }, {
    title: '创建时间',
    dataIndex: 'CreateTime',
    sorter: (a, b) => a.age - b.age,
  }, {
    title: '招生截止时间',
    dataIndex: 'address',
  }, {
    title: '报名人数',
    dataIndex: 'age',
    sorter: (a, b) => a.age - b.age,
  }, {
    title: '状态',
    dataIndex: 'age1',
    sorter: (a, b) => a.age - b.age,
  }, {
    title: '操作',
    render: (text, record) => (
      <span>
        <a href="">Invite {record.name}</a>
        <Divider type="vertical" />
        <a href="">Delete</a>
      </span>
    )
  }];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userOrder/fetch',
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
      type: 'userOrder/fetch',
      payload: params,
    });
  };

  creatCourse = () => {
    window.location.href = "/user/teacher/tearchMenu/creatCourse";
  };

  render() {
    const {
      userOrder: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <div className={layoutStyles.rightModule}>
        <div style={{ position: 'relative' }}>
          <h2>课程管理</h2>
        </div>
        <div style={{ marginTop: 20 }}>
          <Tabs defaultActiveKey="1" onChange={(key) => { console.log(key); }}>
            <TabPane tab="全部订单" key="1" />
            <TabPane tab="等待付款" key="2" />
            <TabPane tab="赠送/重学" key="3" />
            <TabPane tab="课程售后" key="4" />
          </Tabs>

        </div>
        <StandardTable
          selectedRows={selectedRows}
          loading={loading}
          data={data}
          columns={this.columns}
          onSelectRow={this.handleSelectRows}
          onChange={this.handleStandardTableChange}
        />
      </div>
    );
  }
}

export default OrderList;

