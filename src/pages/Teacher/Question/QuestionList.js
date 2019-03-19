import React, { PureComponent } from 'react';
import { Button, Menu, Select, Icon, Divider, Dropdown, Form, Row, Col, Input, message } from 'antd';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
import router from 'umi/router';
import styles from './QuestionList.less';
import EditQuestion from './EditQuestion';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['启动', '停用'];
const questionType = ['', '单选', '多选', '判断', '简答'];
// 课程管理
@connect(({ courseQuestion, loading }) => ({
  courseQuestion,
  courseQuestionLoading: loading.effects['courseQuestion/fetch'],
}))
@Form.create()
class QuestionList extends PureComponent {
  state = {
    editModalVisible: false,
    editFormTitle: '',
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '类型',
      dataIndex: 'Type',
      width: 100
    },
    {
      title: '标题',
      width: 200,
      dataIndex: 'Name',
      render(val) {
        return <div dangerouslySetInnerHTML={{ __html: val }} />;
      }
    },
    {
      title: '难度',
      dataIndex: 'Difficulty',
      width: 40
    },
    {
      title: '章节',
      dataIndex: 'CourseCatalogId',
      width: 80
    },
    {
      title: '分数',
      dataIndex: 'Score',
      width: 40
    },
    {
      title: '状态',
      dataIndex: 'Enable',
      width: 40,
      render(val) {
        return questionType[val];
      }
    },
    {
      title: '操作',
      width: 100,
      render: (text, record) => (
        <span>
          <a onClick={() => this.handleEditModalVisible(true, record, '修改问题')}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.deleteQuestion(record)}>删除</a>
        </span>
      )
    }];

  componentDidMount() {
    const { dispatch, courseTerm } = this.props;
    dispatch({
      type: 'courseQuestion/fetch',
      payload: {
        courseTermId: courseTerm.Id,
        PageNumber: 1,
        PageSize: 20,
      }
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, courseTerm } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      PageNumber: pagination.current,
      PageSize: pagination.pageSize,
      courseTermId: courseTerm.Id,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'courseQuestion/fetch',
      payload: params,
    });
  };

  deleteQuestion = (question) => {
    const { dispatch, courseTerm } = this.props;
    dispatch({
      type: "courseQuestion/remove",
      payload: {
        courseTermId: courseTerm.Id,
        ids: [question.Id]
      }
    });
  };

  handleEditModalVisible = (flag, record, title) => {
    const { courseTerm } = this.props;
    this.setState({
      editModalVisible: !!flag,
      formValues: { CourseTermId: courseTerm.Id, ...record } || { CourseTermId: courseTerm.Id },
      editFormTitle: title || '',
    });
  };

  handleEditOk = fields => {
    const { dispatch, courseTerm } = this.props;
    let typeStr = 'courseQuestion/update';
    if (fields.Id === 0) {
      typeStr = 'courseQuestion/add';
    }
    dispatch({
      type: typeStr,
      payload: {
        ...fields,
        CourseTermId: courseTerm.Id
      },
      callback: () => {
        message.success(fields.Id === 0 ? '新增成功' : '修改成功');
        this.handleEditModalVisible();
      },
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
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
            <span className={styles.submitButtons}>
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
    const { selectedRows, editModalVisible, formValues, editFormTitle } = this.state;
    const {
      courseTerm,
      courseQuestion: { data },
      courseQuestionLoading,
    } = this.props;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );
    const formMethods = {
      handleEditModalVisible: this.handleEditModalVisible,
      handleEditOk: this.handleEditOk,
    };
    return (
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>{this.renderForm()}</div>
        <div className={styles.tableListOperator}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => this.handleEditModalVisible(true, { Id: 0, courseTermId: courseTerm.Id }, '新增文件表')}
          >
            新建
          </Button>
          {selectedRows.length > 0 && (
            <span>
              {/* <Button>批量操作</Button> */}
              <Dropdown overlay={menu}>
                <Button>
                  更多操作 <Icon type="down" />
                </Button>
              </Dropdown>
            </span>
          )}
        </div>
        <StandardTable
          selectedRows={selectedRows}
          loading={courseQuestionLoading}
          data={data}
          columns={this.columns}
          onSelectRow={this.handleSelectRows}
          onChange={this.handleStandardTableChange}
        />
        {formValues && Object.keys(formValues).length ? (
          <EditQuestion
            {...formMethods}
            editModalVisible={editModalVisible}
            values={formValues}
            formTitle={editFormTitle}
          />
        ) : null}
      </div>
    );
  }
}

export default QuestionList;

