import React, { PureComponent } from 'react';
import { Button, Modal, Tabs, Input, Select, Divider, Form, Row, Col, DatePicker, } from 'antd';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
import router from 'umi/router';
import teachStyles from '../TeachLayout.less';
import Styles from './ExaminationManagement.less';
import ExaminationManagementEdit from './ExaminationManagementEdit';

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const FormItem = Form.Item;

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

// 课程管理
@connect(({ testPaper, loading, courseCatalog, teacherInfo, courseInfo }) => ({
  testPaper,
  courseCatalog,
  loading: loading.models.testPaper,
  courseInfo,
  teacherInfo,
}))
@Form.create()
class ExaminationManagement extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    currentStep: 0,
    editModalVisible: false,
    visible: false
  };

  columns = [
    {
      title: '试卷名称',
      dataIndex: 'Name',
    },
    {
      title: '副标题',
      dataIndex: "SubName"
    },
    {
      title: '考试时间（分）',
      dataIndex: "Span"
    },
    {
      title: '总分',
      dataIndex: 'Score',
    }, {
      title: '操作',
      render: (text, record) => (
        <span>
          {/* <a onClick={() => this.showCourseTerm(record)}>管理</a> */}
          <a>管理</a>
          <Divider type="vertical" />
          <a onClick={() => this.delectTestPaper(record.Id)}>删除</a>
        </span>
      )
    }];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'testPaper/fetch',
    });
  }

  handleEditModalVisible = () => {
    const { editModalVisible } = this.state;
    this.setState({
      editModalVisible: !editModalVisible,
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
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'testPaper/fetch',
      payload: params,
    });
  };
 
  // 通过课程来查找
  searchTestPaperList = (CourseInfoId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'testPaper/fetch',
      payload: {
        CourseInfoId: CourseInfoId
      },
    });
  }

  // 删除试卷提示弹出框显示
  delectTestPaper = (Id) => {
    this.setState({
      visible: true,
      testPaperId:Id
    }) 
  }

   //隐藏删除试卷弹出框
   handleCancel = () => {
    this.setState({
      visible: false,
      testPaperId:'',
    });
  }

  //确认删除试卷
  handleOk = () => {
    const { dispatch } = this.props;
    this.setState({
      visible: false,
    });
    dispatch({
      type: 'testPaper/remove',
      payload: [this.state.testPaperId],
    });
  }
  
  renderForm() {
    const { form, courseInfo: { data }, } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem key="CourseInfoId" label="课程">
              {form.getFieldDecorator('CourseInfoId', {
                rules: [{ required: false }],
                initialValue: '',
              })(
                <Select
                  showSearch
                  placeholder="Select a person"
                  optionFilterProp="children"
                  allowClear={true}
                  onChange={this.searchTestPaperList}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    data ? data.Rows.map((v, k) => {
                      return (
                        <Option key={v.Id} value={v.Id}>{v.Name}</Option>
                      )
                    }) : ''
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          {/* <Col md={6} sm={24}>
            <FormItem label="学期">
              {getFieldDecorator('name')(
                <Search
                  placeholder="学期"
                  onSearch={value => console.log(value)}
                />)
              }
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="章节">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">停用</Option>
                  <Option value="1">启用中</Option>
                </Select>
              )}
            </FormItem>
          </Col> */}
          <Col md={6} sm={24}>
            <span className={Styles.submitButtons}>
              {/* <Button type="primary" htmlType="submit">
                查询
              </Button> */}
              <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleEditModalVisible}>
                新增
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }


  render() {
    const { testPaper: { data }, loading, values, formTitle, teacherInfo } = this.props;
    const formMethods = { handleEditOk: this.handleEditOk, handleEditModalVisible: this.handleEditModalVisible };

    const { selectedRows, currentStep, editModalVisible, visible } = this.state;
    return (
      <div className={teachStyles.rightModule}>
        <ExaminationManagementEdit  {...formMethods} editModalVisible={editModalVisible} />
        <div style={{ position: 'relative' }}>
          <h2>试卷管理</h2>
          {/* <Button type="primary" className="main-button" style={{ position: 'absolute', top: 0, right: 0 }} onClick={this.creatCourse}>创建课程</Button> */}
        </div>
        <Tabs defaultActiveKey="1" onChange={(key) => { console.log(key); }}>
          <TabPane tab="收费课" key="1" />
          <TabPane tab="免费课" key="2" />
        </Tabs>
        <div className={Styles.tableList}>
          <div className={Styles.tableListForm}>{this.renderForm()}</div>
          <div className={Styles.tableListOperator}>
            <StandardTable
              selectedRows={selectedRows}
              // loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </div>
        <Modal
          // title="是否取消新增试卷？"
          visible={visible}
          zIndex={1500}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <h3>是否删除该试题？</h3>
        </Modal>
      </div>
    );
  }
}

export default ExaminationManagement;

