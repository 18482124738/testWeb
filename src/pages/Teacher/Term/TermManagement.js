import React, { PureComponent } from 'react';
import { Button, Input, Divider, Form, Row, Col, Modal, message } from 'antd';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
import router from 'umi/router';
import teachStyles from '../TeachLayout.less';
import Styles from './TermManagement.less';

const { Search } = Input;
const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

// 课程管理
@connect(({ courseTerm, loading }) => ({
  courseTerm,
  // loading: loading.models.courseInfo,
}))
@Form.create()
class TermManagement extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '学期名称',
      dataIndex: 'Name',
      align: 'center',
    },
    {
      title: '课程',
      dataIndex: 'CourseInfo.Name',
      align: 'center',
    },
    {
      title: '购买人数',
      dataIndex: 'BuyersNum',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <span>
          <a onClick={() => this.showCourseTerm(record)}>管理</a>
          <Divider type="vertical" />
          <a onClick={() => this.updateCourse(record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.deleteData(record)}>删除</a>
        </span>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseTerm/fetchUserList',
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
      type: 'courseTerm/fetchUserList',
      payload: params,
    });
  };

  // 搜索
  getList = value => {
    const { dispatch } = this.props;
    let params = {};
    params = { Name: value };
    dispatch({
      type: 'courseTerm/fetchUserList',
      payload: params,
    });
  };

  // 创建学期清空数据
  creatTerm = () => {
    const { dispatch } = this.props;
    const record = {};
    dispatch({
      type: 'courseTerm/saveStepFormData',
      payload: record,
    });
    router.push({ pathname: '/user/management/teacher/index/TermRedactCtn', state: record });
  };

  // 修改学期
  updateCourse = record => {
    const { dispatch } = this.props;
    record.updateStatus = 'update';
    record.Id = record.Id;
    // dispatch({
    //   type: 'courseTerm/saveStepFormData',
    //   payload: record,
    // });
    // router.push('/user/management/teacher/index/TermRedactCtn');
    router.push({ pathname: '/user/management/teacher/index/TermRedactCtn', state: record });
  };

  // 删除学期
  deleteData = data => {
    const that = this;
    Modal.confirm({
      title: '删除提示',
      content: `您确定要删除选中这条学期信息吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const { dispatch } = that.props;
        const ids = [];
        ids.push(data.Id);
        dispatch({
          type: 'courseTerm/remove',
          payload: ids,
          callback() {
            message.success('删除成功');
          },
        });
      },
      onCancel() {},
    });
  };

  showCourseTerm = courseTerm => {
    router.push({ pathname: '/user/management/teacher/index/termDetail', state: courseTerm });
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
        </Row>
      </Form>
    );
  }

  render() {
    const {
      courseTerm: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <div className={teachStyles.rightModule}>
        <div style={{ position: 'relative' }}>
          <h2>学期管理</h2>
          <Button
            type="primary"
            className="main-button"
            style={{ position: 'absolute', top: 0, right: 0 }}
            onClick={this.creatTerm}
          >
            创建学期
          </Button>
        </div>
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

export default TermManagement;
