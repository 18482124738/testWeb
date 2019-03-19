import React, { PureComponent } from 'react';
import { Button, Tabs, Input, Select, Divider, Form, Row, Col, Modal, message } from 'antd';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
import router from 'umi/router';
import teachStyles from '../TeachLayout.less';
import Styles from './CourseManagement.less';

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const FormItem = Form.Item;
let IsChargeStatus = true;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

// 课程管理
@connect(({ courseInfo, loading }) => ({
  courseInfo,
  loading: loading.models.courseInfo,
}))
@Form.create()
class CourseManagement extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '课程名称',
      dataIndex: 'Name',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
      align: 'center',
      sorter: (a, b) => a.CreateTime - b.CreateTime,
    },
    {
      title: '学期数量',
      dataIndex: 'TermCount',
      align: 'center',
      sorter: (a, b) => a.TermCount - b.TermCount,
    },
    {
      title: '状态',
      dataIndex: 'ReleaseStatus',
      align: 'center',
      render: ReleaseStatus => <span>{ReleaseStatus == 1 ? '已发布' : '未发布'}</span>,
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <span>
          <a onClick={() => this.showCourseInfo(record)}>管理</a>
          <Divider type="vertical" />
          <a onClick={() => this.updateCourse(record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.publishData(record)}>发布</a>
          <Divider type="vertical" />
          <a onClick={() => this.deleteData(record)}>删除</a>
        </span>
      ),
    },
  ];

  // 修改发布状态 
  publishData = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseInfo/updateStatus',
      payload: {
        Id: record.Id,
        ReleaseStatus: true,
        IsCharge: record.IsCharge,
      },
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseInfo/fetchUserList',
      payload: { IsCharge: true },
    });
  }

  getList = value => {
    const { dispatch } = this.props;
    let params = {};
    params = { Name: value };
    dispatch({
      type: 'courseInfo/fetchUserList',
      payload: params,
    });
  };

  deleteData = data => {
    const that = this;
    Modal.confirm({
      title: '删除提示',
      content: `您确定要删除选中这条课程信息吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const { dispatch } = that.props;
        const ids = [];
        ids.push(data.Id);
        dispatch({
          type: 'courseInfo/remove',
          payload: ids,
          callback() {
            message.success('删除成功');
          },
        });
      },
      onCancel() { },
    });
  };

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
      IsCharge: IsChargeStatus,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'courseInfo/fetchUserList',
      payload: params,
    });
  };

  creatCourse = () => {
    // 创建课程清空数据
    const { dispatch } = this.props;
    const record = {
      CourseInfo: {
        IsCharge: true,
        Price: 0.0,
      },
      CourseDetail: {},
      CourseTerm: {},
      InstructorId: '',
      TeacherId: '',
      HeadmasterId: '',
    };
    router.push({ pathname: '/user/management/teacher/index/creatCourse', state: record });
    dispatch({
      type: 'courseInfo/saveStepFormData',
      payload: record,
    });
  };

  // 修改课程
  updateCourse = record => {
    const course = {
      Id: record.Id,
      CourseInfo: {
        ...record,
        CategoryPath: record.CategoryPath.split(','),
      },
      CourseDetail: {
        Id: 0,
        CourseInfoId: record.Id,
        Content: '',
        Enable: true,
      },
      updateStatus: 'update',
    };
    // dispatch({
    //   type: 'courseInfo/saveStepFormData',
    //   payload: record,
    // });
    // router.push('/user/management/teacher/index/creatCourse');
    router.push({ pathname: '/user/management/teacher/index/creatCourse', state: course });
  };

  showCourseInfo = courseInfo => {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseInfo/saveCurrent',
      payload: courseInfo,
    });
    router.push('/user/management/teacher/index/courseInfoDetail');
  };

  // 收费免费课选择
  chooseLesson = key => {
    const { dispatch } = this.props;
    if (key === '1') {
      IsChargeStatus = true;
      dispatch({
        type: 'courseInfo/fetchUserList',
        payload: { IsCharge: true },
      });
    } else if (key === '2') {
      IsChargeStatus = false;
      dispatch({
        type: 'courseInfo/fetchUserList',
        payload: { IsCharge: false },
      });
    }
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="课程名称">
              {getFieldDecorator('name')(
                <Search placeholder="课程名称" onSearch={value => this.getList(value)} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">停用</Option>
                  <Option value="1">启用中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={Styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      courseInfo: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <div className={teachStyles.rightModule}>
        <div style={{ position: 'relative' }}>
          <h2>课程管理</h2>
          <Button
            type="primary"
            className="main-button"
            style={{ position: 'absolute', top: 0, right: 0 }}
            onClick={this.creatCourse}
          >
            创建课程
          </Button>
        </div>

        <Tabs defaultActiveKey="1" onChange={key => this.chooseLesson(key)}>
          <TabPane tab="收费课" key="1" />
          <TabPane tab="免费课" key="2" />
        </Tabs>
        <div className={Styles.tableList}>
          <div className={Styles.tableListForm}>{this.renderForm()}</div>
          <div className={Styles.tableListOperator}>
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
      </div>
    );
  }
}

export default CourseManagement;
