
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Button,
  Select,
  Input,
  Modal,
  Radio
} from 'antd';
import styles from './RecordedBroadcast.less';
import addIcon from '@/assets/add.png';
import RecourcePanel from '@/components/Teacher/RecourcePanel'

const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 },
  },
};

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ courseCatalog, fileUpLoad, loading }) => ({
  courseCatalog,
  videoFile: fileUpLoad.data,
  courseTeacherLoading: loading.effects['fileUpLoad/fetchUserList'],
}))
@Form.create()
class TaskForm extends PureComponent {
  static defaultProps = {
    handleOk: () => { },
    handleVisible: () => { },
    radio: {},
    selectedFile: {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        ...props.values,
        videoVisible: false,
        fileVisible: false
      }
    };
  }


  componentDidMount() {

  }

  handleOk = () => {
    const { form, handleOk } = this.props;
    const { formVals: oldValue, selectedFile } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue, FileId: selectedFile.Id };
      this.setState(
        {
          formVals,
        },
        () => {
          handleOk(formVals);
        }
      );
    });
  };

  relevanceVideo = () => {
    const { dispatch } = this.props;
    this.setState({
      videoVisible: true,
      selectedFile: {}
    })
    dispatch({
      type: 'fileUpLoad/fetchUserList',
      payload: {},
    });
  }

  // 关联资料
  relevanceFile = () => {
    const { dispatch } = this.props;
    this.setState({
      fileVisible: true,
      selectedFile: {}
    })
  }

  SelectOk = () => {
    this.setState({
      videoVisible: false,
      fileVisible: false,
    })
  }

  render() {
    const { form, handleVisible, values, videoFile: { Rows } } = this.props;
    const { formVals, videoVisible, selectedFile, fileVisible } = this.state;
    const vidoModal = (
      <Modal
        visible={videoVisible}
        title="请选择关联视频"
        onOk={() => this.SelectOk()}
        onCancel={() => { this.setState({ videoVisible: false }) }}
      >
        <RadioGroup onChange={(e) => { this.setState({ selectedFile: e.target }) }}>
          {
            Rows.map((item) => (
              <Radio value={item.Name} id={item.Id} style={{ display: 'block', margin: '15px 0' }}>{item.Name}</Radio>
            ))
          }
        </RadioGroup>
      </Modal>
    )
    const fileModal = (
      <Modal
        visible={fileVisible}
        width='800px'
        title="请选择关联资料"
        onOk={() => this.SelectOk()}
        onCancel={() => { this.setState({ fileVisible: false }) }}
      >
        <RecourcePanel onFileSelected={file => {
          this.setState({
            selectedFile: file,
          })
        }}
        />
      </Modal>
    )
    const RenderFileInput = (taskType) => {
      let input = ""
      switch (taskType) {
        case '2':
          input =
            <Form.Item {...formItemLayout} label="关联录播视频">
              {form.getFieldDecorator('FileId', {
                // initialValue: creatForm.CourseInfo.Name,
                rules: [{ message: '请选择录播视频' }],
              })(
                <div>
                  <div className={styles.courseAddButton} onClick={this.relevanceVideo}>
                    <img alt="" src={addIcon} />
                    <p>关联录播视频</p>
                  </div>
                  <p><a>{selectedFile ? selectedFile.Name : ""}</a></p>
                </div>
              )}
            </Form.Item>
          break;
        case '3':
          input =
            <Form.Item {...formItemLayout} label="关联资料">
              {form.getFieldDecorator('FileId', {
                initialValue: selectedFile ? selectedFile.Name : '',
                rules: [{ message: '请选择关联资料' }],
              })(
                <div>
                  <div className="ant-input" onClick={this.relevanceFile} style={{ width: 250, float: 'left', cursor: 'pointer' }}>
                    <span style={{ color: 'rgba(0 ,0 ,0, 0.35)' }}>{selectedFile ? selectedFile.Name : "请选择关联资料"}</span>
                  </div>
                </div>
              )}
            </Form.Item>
          break;
        case '4':
          input =
            <Form.Item {...formItemLayout} label="关联习题">
              {form.getFieldDecorator('FileId', {
                // initialValue: creatForm.CourseInfo.Name,
                rules: [{ message: '请选择关联习题' }],
              })(
                <div>
                  <div className="ant-input" onClick={this.relevanceVideo} style={{ width: 250, float: 'left', cursor: 'pointer' }}>
                    <span style={{ color: 'rgba(0 ,0 ,0, 0.35)' }}>请选择关联习题</span>
                  </div>
                </div>
              )}
            </Form.Item>
          break;
        default:
      }
      return input;
    }
    return (
      <div>
        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
          <Form.Item {...formItemLayout} label="任务类型">
            {form.getFieldDecorator('TaskType', {
              initialValue: formVals.TaskType.toString(),
              rules: [{ required: true, message: '请选择任务类型' }],
            })(
              <Select style={{ width: 250 }} onChange={this.handleChange}>
                <Option value="2">录播</Option>
                <Option value="3">学习资料</Option>
                <Option value="4">习题</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="任务名称">
            {form.getFieldDecorator('Name', {
              initialValue: formVals.Name,
              rules: [{ required: true, message: '请输入任务名称' }],
            })(
              <Input placeholder="Basic usage" style={{ width: 250 }} />
            )}
          </Form.Item>
          {RenderFileInput(form.getFieldValue('TaskType'))}
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button key="cancel" onClick={() => handleVisible(false, values)}>
              取消
            </Button>
            <Button style={{ marginLeft: 8 }} key="submit" type="primary" onClick={() => this.handleOk()}>
              完成
            </Button>
          </FormItem>
        </Form>
        {vidoModal}
        {fileModal}
      </div>
    );
  }
}

export default TaskForm;

