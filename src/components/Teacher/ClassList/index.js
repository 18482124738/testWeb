import React, { PureComponent } from 'react';
import { Button, Select, Divider, Form, Row, Col, Input } from 'antd';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
import styles from './index.less';
import EditForm from './Edit';

const FormItem = Form.Item;
const { Option } = Select;


// 课程管理
@connect(({ courseClass }) => ({
  courseClass
}))
@Form.create()
class ClassList extends PureComponent {
  state = {
    editModalVisible: false,
    editFormTitle: '',
    selectedRows: [],
    formValues: {}
  };

  columns = [
    {
      title: '班级名称',
      dataIndex: 'Name',
      width: 100
    },
    {
      title: '班主任',
      width: 100,
      dataIndex: 'Headmaster',
    },
    {
      title: '学生人数',
      dataIndex: 'BuyersNum',
      width: 100
    },

    {
      title: '操作',
      width: 100,
      render: (text, record) => (
        <span>
          <a onClick={() => this.showCourseInfo(record.Id)}>编辑</a>
          <Divider type="vertical" />
          <a>删除</a>
        </span>
      )
    }];

  componentDidMount() {

    this.loadClassList();
  }

  loadClassList = () => {
    const { dispatch, courseTerm } = this.props;
    dispatch({
      type: 'courseClass/fetch',
      payload: { CourseTermId: courseTerm.Id }
    });
  }

  // handleStandardTableChange = (pagination, filtersArg, sorter) => {
  //   const { dispatch } = this.props;
  //   const { formValues } = this.state;

  //   const filters = Object.keys(filtersArg).reduce((obj, key) => {
  //     const newObj = { ...obj };
  //     newObj[key] = getValue(filtersArg[key]);
  //     return newObj;
  //   }, {});

  //   const params = {
  //     PageNumber: pagination.current,
  //     PageSize: pagination.pageSize,
  //     ...formValues,
  //     ...filters,
  //   };
  //   if (sorter.field) {
  //     params.sorter = `${sorter.field}_${sorter.order}`;
  //   }

  //   dispatch({
  //     type: 'courseClass/fetch',
  //     payload: params,
  //   });
  // };



  handleEditModalVisible = (flag, record, title) => {
    const { courseTerm } = this.props;
    this.setState({
      editModalVisible: !!flag,
      editFormTitle: title || '',
      formValues: { CourseTermId: courseTerm.Id, ...record } || { CourseTermId: courseTerm.Id },
    });
  };

  handleEditOk = fields => {
    const { dispatch, courseTerm } = this.props;
    let typeStr = 'courseClass/update';
    if (fields.Id === 0) {
      typeStr = 'courseClass/add';
    }
    dispatch({
      type: typeStr,
      payload: {
        CourseTermId: courseTerm.Id,
        ...fields,
      },
      callback: () => {
        this.handleEditModalVisible(true);
      },
    });
  }

  renderForm() {
    const { form } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem key="Name" label="班级名称">
              {form.getFieldDecorator('Name', {
                rules: [{ required: false }],
                initialValue: '',
              })(
                <Input width={200} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleEditModalVisible(true, { Id: 0 }, '新增班级')}
              >
                新建
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { selectedRows, editModalVisible, editFormTitle, formValues } = this.state;
    const { courseClass: { data }, courseQuestionLoading, } = this.props;
    const formMethods = { handleEditModalVisible: this.handleEditModalVisible, handleEditOk: this.handleEditOk, };
    return (
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>{this.renderForm()}</div>

        <StandardTable
          selectedRows={selectedRows}
          loading={courseQuestionLoading}
          data={data}
          columns={this.columns}
          onSelectRow={this.handleSelectRows}
          onChange={this.handleStandardTableChange}
        />
        {formValues && Object.keys(formValues).length ? (
          <EditForm
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

export default ClassList;

