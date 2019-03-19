import React, { PureComponent } from 'react';
import { Button, Tabs, Input, Select, Checkbox, Divider } from 'antd';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
import layoutStyles from '../StudentLayout.less';

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


// 课程管理
@connect(({ courseInfo, loading }) => ({
  courseInfo,
  loading: loading.models.courseInfo,
}))
class CourseList extends PureComponent {
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
      type: 'courseInfo/fetch',
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
      type: 'userInfo/fetch',
      payload: params,
    });
  };

  creatCourse = () => {
    window.location.href = "/user/teacher/tearchMenu/creatCourse";
  };

  render() {
    const {
      courseInfo: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <div className={layoutStyles.rightModule}>
        <div style={{ position: 'relative' }}>
          <h2>课程管理</h2>
          <Button type="primary" className="main-button" style={{ position: 'absolute', top: 0, right: 0 }} onClick={this.creatCourse}>创建课程</Button>
        </div>
        <div style={{ marginTop: 20 }}>
          <Tabs defaultActiveKey="1" onChange={(key) => { console.log(key); }}>
            <TabPane tab="收费课" key="1" />
            <TabPane tab="免费课" key="2" />
          </Tabs>
          <Search
            placeholder="课程名称"
            onSearch={value => console.log(value)}
            style={{ width: 250, marginRight: 25 }}
          />
          <Select defaultValue="课程状态" style={{ width: 250, marginRight: 25 }} onChange={(value) => { console.log(`selected ${value}`) }}>
            <Option value="课程状态">课程状态</Option>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
          </Select>
          <Checkbox onChange={(e) => { console.log(`checked = ${e.target.checked}`); }}>我的授课</Checkbox>
          {/* <Table columns={columns} dataSource={data} onChange={this.onChange} /> */}
          <StandardTable
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

export default CourseList;

