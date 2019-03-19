import React, { PureComponent } from 'react';
import { Button, Tabs, Input, Select, Form, Row, Col, Modal, Upload, Icon } from 'antd';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
// import router from 'umi/router';
import teachStyles from '../TeachLayout.less';
import Styles from './CourseManagement.less';


const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

// 课程管理
@connect(({ courseQuestion, loading }) => ({
  courseQuestion,
  loading: loading.models.courseInfo,
}))
@Form.create()
class CourseQusetionList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    currentindex: 1,
    delVisible: false,
  };

  columns = [
    {
      title: '题干',
      render: (text, record) => (
        <span>
          <div dangerouslySetInnerHTML={{ __html: record.Name }} />
        </span>
      ),
      // dataIndex: <div dangerouslySetInnerHTML={{__html:"Name"}} />,
    },
    // {
    //   title: '答案',
    //   render: (text, record) => {
    //     let str = "";
    //     if (record.Type === 1 || record.Type === 2) {
    //       const AnswerI = JSON.parse(record.AnswerItems);
    //       AnswerI.forEach((Item) => {
    //         str += `<p> ${Item.text}</p>`
    //       })
    //       str = <div dangerouslySetInnerHTML={{ __html: str }} />
    //     } else if (record.Type === 5) {
    //       if (record.Answer !== "") {
    //         const AnswerI = JSON.parse(record.Answer);
    //         AnswerI.forEach((Item) => {
    //           str += `<p> ${Item.text}</p>`
    //         })
    //       }
    //       str = <div dangerouslySetInnerHTML={{ __html: str }} />
    //     } else {
    //       str = <div dangerouslySetInnerHTML={{ __html: record.Answer }} />
    //     }

    //     return str;
    //   }
    //   // dataIndex: 'AnswerItems',
    // },

    {
      title: '分数',
      dataIndex: 'Score',
    },
    // {
    //   title: '操作',
    //   render: (text, record) => (
    //     <span>
    //       <a onClick={() => this.ShowModel(record)}>编辑</a>
    //     </span>
    //   ),
    // },
    {
      title: '操作',
      render: (text, record) => (
        <span>
          <a onClick={() => this.ShowDelModel(record)}>删除</a>
        </span>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch, location } = this.props;
    let currentindex = 1;
    if (location.query && location.query.index) {
      currentindex = parseInt(location.query.index, 10);
      console.log(currentindex);
      this.setState({
        currentindex,
      });
    }
    dispatch({
      type: 'courseQuestion/fetchCurrent',
      payload: { Type: currentindex },
    });
  }

  /* 点击删除 */
  ShowDelModel = record => {
    console.log(record);
    this.setState({
      delVisible: true,
    });
  };

  /* 弹框是否删除——取消 */
  handleCancel = () => {
    this.setState({
      delVisible: false,
    });
  };

  /* 弹框是否删除——确定 */
  handleOk = () => {
    const { dispatch } = this.props;
    const { currentindex } = this.state;
    dispatch({
      type: 'courseQuestion/remove',
      payload: {
        Id: [currentindex],
      },
    });
    this.setState({
      delVisible: false,
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
      type: 'courseTerm/fetchUserList',
      payload: params,
    });
  };

  TabsChange = key => {
    const { dispatch } = this.props;
    this.setState({
      currentindex: key,
    });
    dispatch({
      type: 'courseQuestion/fetchCurrent',
      payload: { Type: key },
    });
  };

  Scorechange = e => {
    console.log(e.target.value);
  };



  /* 上传模板 */
  beforeUpload = (file, index) => {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('Type', index);
    const { dispatch } = this.props;
    //   const p = new Promise(function (resolved){
    //   //在这里进行处理。也许可以使用ajax
    //   setTimeout(function () {
    //     var result = 10 * 5;
    //     if (result === 50) {
    //       resolve(50);
    //     } else {
    //       reject(new Error('Bad Math'));
    //     }
    //   }, 1000);
    // });
    // p.then(function(result) {
    //   console.log('Resolve with a values of %d', result);
    // });
    dispatch({
      type: 'courseQuestion/upload',
      payload: formData,
    });
  };

  /* 下载模板 */
  downloadTemplate = ci => {
    console.log(ci);
    // 无法从指定url下载文件，只能写content
    // this.blobDownload(
    //   'E:\\MastyJay\\在线教育\\MSC_OnlineEducationWeb\\src\\pages\\Teacher\\Course',
    //   'ceshi.txt'
    // );

    this.formDownload(
      // 'E:\\MastyJay\\在线教育\\MSC_OnlineEducationWeb\\src\\pages\\Teacher\\Course\\测试啦啦.txt/master' // 报错：Not allowed to load local resource
      'https://codeload.github.com/douban/douban-client/legacy.zip/master' // 测试url
    );

    // 会打开新标签页，用户体验稍差
    // window.open('https://codeload.github.com/douban/douban-client/legacy.zip/master');
  };

  /* 通过form下载 */
  formDownload = url => {
    const eleForm = document.createElement('form');
    eleForm.method = 'get';
    eleForm.action = url;
    document.body.append(eleForm);
    eleForm.submit(); // 提交表单，实现下载
  };

  /* 通过blob下载 */
  blobDownload = (content, filename) => {
    const eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    const blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink);
    eleLink.click(); // 触发点击，实现下载
    document.body.removeChild(eleLink);
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="题干">
              {getFieldDecorator('name')(
                <Search placeholder="题干" onSearch={value => console.log(value)} />
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
      courseQuestion: { data },
      loading,
    } = this.props;
    const { selectedRows, currentindex, delVisible } = this.state;
    return (
      <div className={teachStyles.rightModule}>
        <div style={{ position: 'relative' }}>
          <h2>习题列表</h2>
          <Upload
            className="main-button"
            style={{ position: 'absolute', top: 0, right: 120 }}
            beforeUpload={file => this.beforeUpload(file, currentindex)}
            showUploadList={false}
          >
            <Button type="primary">
              <Icon type="upload" />
              导入习题
            </Button>
          </Upload>
          <Button
            className="main-button"
            style={{ position: 'absolute', top: 0, right: 0 }}
            type="default"
            onClick={() => this.downloadTemplate(currentindex)}
          >
            <Icon type="download" />
            下载模板
          </Button>
        </div>
        <Tabs
          activeKey={currentindex.toString()}
          onChange={key => {
            this.TabsChange(key);
          }}
        >
          <TabPane tab="选择题" key="1" />
          <TabPane tab="多选题" key="2" />
          <TabPane tab="判断题" key="3" />
          <TabPane tab="简答题" key="4" />
          <TabPane tab="填空题" key="5" />
        </Tabs>
        <div className={Styles.tableList}>
          <div className={Styles.tableListForm}>{this.renderForm()}</div>
          <div className={Styles.tableListOperator}>
            {/* <Checkbox onChange={(e) => { console.log(`checked = ${e.target.checked}`); }}>我的授课</Checkbox> */}
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
        <Modal visible={delVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <h3>是否删除该试题？</h3>
        </Modal>
      </div>
    );
  }
}

export default CourseQusetionList;
