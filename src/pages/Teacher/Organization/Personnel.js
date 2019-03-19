import React, { Component } from 'react';
import { Button, Input, Divider, Form, Modal } from 'antd';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
import styles from './Personnel.less';
// import router from 'umi/router';

const { Search } = Input;
const FormItem = Form.Item;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="添加成员"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="成员">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入成员学号', min: 5 }],
        })(<Input placeholder="请输入成员学号" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ courseInfo, loading }) => ({
  courseInfo,
  loading: loading.models.courseInfo,
}))

class CourseDetails extends Component {
  state = {
    selectedRows: [],
    modalVisible: false,
  };

  columns = [{
    title: '成员',
    dataIndex: 'Name',
  }, {
    title: '学号',
    dataIndex: 'Number',
  }, {
    title: '关联课程数',
    dataIndex: 'address',
  }, {
    title: '全部状态',
    dataIndex: 'age',
    sorter: (a, b) => a.age - b.age,
  }, {
    title: '操作',
    render: (text, record) => (
      <span>
        <a onClick={() => this.showCourseInfo(record.Id)}>编辑</a>
        <Divider type="vertical" />
        <a>移除</a>
      </span>
    )
  }];

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  render() {
    const {
      courseInfo: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <div>
        <div style={{ position: 'relative' }}>
          <h2>机构成员</h2>
        </div>
        <div style={{ marginTop: 40 }}>
          <Search
            placeholder="成员名称/学号"
            onSearch={value => console.log(value)}
            style={{ width: 250, marginRight: 25 }}
          />
          <Button type="primary" className="main-button" style={{ float: 'right' }} onClick={() => this.handleModalVisible(true)}>添加成员</Button>
          <CreateForm {...parentMethods} modalVisible={modalVisible} />
          {/* <Table columns={columns} dataSource={data} onChange={this.onChange} /> */}
          <StandardTable
            className={styles.personnelList}
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

export default CourseDetails;