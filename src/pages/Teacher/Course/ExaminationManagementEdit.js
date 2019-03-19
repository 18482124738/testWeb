
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Modal, Steps, Select, DatePicker, Checkbox } from 'antd';
const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

@connect(({ courseInfo, courseTerm, courseCatalog,testPaper }) => ({
  courseInfo,
  courseTerm,
  courseCatalog,
  testPaper,
}))
@Form.create()
class ExaminationManagementEdit extends PureComponent {
  static defaultProps = {
    handleEditOk: () => { },
    handleEditModalVisible: () => { },
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      // checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false,
      currentStep: 0,
      visible: false,
      plainOptions: []
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }



  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseInfo/fetchUserList'
    })

  }

  //取消退出弹出框
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  //确认退出弹出框
  handleOk = () => {
    const { form, handleEditModalVisible } = this.props;
    form.resetFields();
    handleEditModalVisible();
    this.setState({
      visible: false,
    });

  }
  //退出新增重置表单数据
  quitEditFormData = () => {
    this.setState({
      visible: true,
    });
  }
  //试卷新增保存确认
  handleEditModalOd = () => {
    const { form ,dispatch,handleEditModalVisible} = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        values.ChapterNameIds = this.state.checkedList;
        values.Span = parseInt(values.Span);
        values.Score = parseInt(values.Score);
        values.PassScore = parseInt(values.PassScore);
        values.SingleNum = parseInt(values.SingleNum);
        values.SingleScore = parseFloat(values.SingleScore);
        values.MultipleNum = parseInt(values.MultipleNum);
        values.MultipleScore = parseFloat(values.MultipleScore);
        values.ShortAnswerNum = parseInt(values.ShortAnswerNum);
        values.ShortAnswerScore = parseFloat(values.ShortAnswerScore);
        values.JudgeNum = parseInt(values.JudgeNum);
        values.JudgeScore = parseFloat(values.JudgeScore);
        values.FillAddNum = parseInt(values.FillAddNum);
        values.FillAddScore = parseFloat(values.FillAddScore);
        dispatch({
          type: 'testPaper/testPaperSave',
          payload: values,
          callback:(response)=>{
            if(response.Success){
              form.resetFields();
              handleEditModalVisible();
            }
          }
        })
      }
    });
  }
  onChange = (checkedList) => {
    console.log(checkedList, 222)
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < this.state.plainOptions.length),
      checkAll: checkedList.length === this.state.plainOptions.length,
    });
  }
  // 课程改变时获取学期
  changeCourse = (a) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseTerm/fetch',
      payload: {
        "CourseInfoId": a,
      }
    })
  }
  // 学期改变时章节改变
  changeTerm = (a) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseCatalog/fetch',
      payload: {
        "CourseTermId": a,
      },
      callback: (response) => {
        let list = [];
        response.Rows.forEach(element => {
          list.push({ Name: element.Name, Id: element.Id })
        });
        this.setState({
          plainOptions: list
        })
      }
    })
  }
  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? this.state.plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }
  renderContent = (currentStep, formVals) => {
    const { form, courseInfo: { data }, courseTerm, courseCatalog } = this.props;
    const { plainOptions,checkedList,checkAll,indeterminate } = this.state;
    let courseTermList = [];
    let list = [];
    if (courseTerm.data.Rows != []) {
      courseTermList = courseTerm.data.Rows;
    }
    return [
      <Form style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 640, borderRight: '0.5px dashed #ccc', textAlign: 'center' }}>
          <h3 style={{ marginBottom: 15 }}>试题基本信息</h3>
          <FormItem key="Name" {...this.formLayout} label="试卷名称">
            {form.getFieldDecorator('Name', {
              rules: [{ required: true, message: '请输入试卷名称！' }],
              initialValue: '',
            })(
              <Input width={200}></Input>
            )}
          </FormItem>
          <FormItem key="TeacherName" {...this.formLayout} label="出卷教师">
            {form.getFieldDecorator('TeacherName', {
              rules: [{ required: true, message: '请输入出卷教师！' }],
              initialValue: '',
            })(
              <Input width={200}></Input>
            )}
          </FormItem>
          <FormItem key="SubName" {...this.formLayout} label="副标题名称">
            {form.getFieldDecorator('SubName', {
              rules: [{ required: true, message: '请输入副标题名称！' }],
              initialValue: '',
            })(
              <Input width={200}></Input>
            )}
          </FormItem>
          <FormItem key="CourseInfoId" {...this.formLayout} label="课程名称">
            {form.getFieldDecorator('CourseInfoId', {
              rules: [{ required: true, message: '请输入课程名称！' }],
              initialValue: '',
            })(
              <Select
                showSearch
                width={200}
                placeholder="Select a person"
                optionFilterProp="children"
                allowClear={true}

                onChange={this.changeCourse}
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
          <FormItem key='TermId' {...this.formLayout} label="学期名称">
            {form.getFieldDecorator('TermId', {
              initialValue: '',
              rules: [{ required: true, message: '请输入学期名称' }],
            })(
              <Select
                showSearch
                width={200}
                placeholder="Select a person"
                optionFilterProp="children"
                allowClear={true}
                onChange={this.changeTerm}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  courseTermList ? courseTermList.map((v, k) => {
                    return (
                      <Option key={v.Id} value={v.Id}>{v.Name}</Option>
                    )
                  }) : ''
                }
              </Select>)}
          </FormItem>

          <FormItem key="Span" {...this.formLayout} label="考试时长（分钟）">
            {form.getFieldDecorator('Span', {
              rules: [{ required: true, message: '请输入考试时长！' }],
              initialValue: '',
            })(
              <Input width={200}></Input>
            )}
          </FormItem>
          <FormItem key="Score" {...this.formLayout} label="试题总分">
            {form.getFieldDecorator('Score', {
              rules: [{ required: true, message: '请输入试题总分！' }],
              initialValue: '',
            })(
              <Input width={200}></Input>
            )}
          </FormItem>
          <FormItem key="PassScore" {...this.formLayout} label="及格分数">
            {form.getFieldDecorator('PassScore', {
              rules: [{ required: true, message: '请输入及格分数！' }],
              initialValue: '',
            })(
              <Input width={200}></Input>
            )}
          </FormItem>
        </div>
        <div style={{ width: 640, textAlign: 'center' }}>
          <h3 style={{ marginBottom: 15 }}>编辑试题内容</h3>
          <FormItem style={{ textAlign: 'left' }} key="ChapterNameIds" {...this.formLayout} label="章节选择">
            {form.getFieldDecorator('ChapterNameIds', {
              initialValue: '',
              rules: [{ required: true, message: '请选择试题章节' }],
            })(
              <div>
                <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                  <Checkbox
                    indeterminate={indeterminate}
                    onChange={this.onCheckAllChange}
                    checked={checkAll}
                  >
                    Check All
                  </Checkbox>
                </div>
                <CheckboxGroup   onChange={this.onChange} >
                  {
                    plainOptions.map((v, k) => {
                      return (
                        <Checkbox key={k} value={v.Id}>{v.Name}</Checkbox>
                      )
                    })
                  }
                </CheckboxGroup>
              </div>
            )}
          </FormItem>
          <FormItem key="Single" {...this.formLayout} label="单选题数">
            {form.getFieldDecorator('SingleNum', {
              rules: [{ required: false }],
              initialValue: '',
            })(
              <Input style={{ width: 123, textAlign: 'center' }}></Input>
            )}
            {form.getFieldDecorator('SingleScore', {
              rules: [{ required: false }],
              initialValue: '',
            })(
              <span style={{ padding: '0 10px' }}> 总分: <Input style={{ width: 120, textAlign: 'center' }}></Input></span>
            )}
          </FormItem>
          <FormItem key="Multiple" {...this.formLayout} label="多选题数">
            {form.getFieldDecorator('MultipleNum', {
              rules: [{ required: false }],
              initialValue: '',
            })(
              <Input style={{ width: 123, textAlign: 'center' }}></Input>
            )}
            {form.getFieldDecorator('MultipleScore', {
              rules: [{ required: false }],
              initialValue: '',
            })(
              <span style={{ padding: '0 10px' }}> 总分: <Input style={{ width: 120, textAlign: 'center' }}></Input></span>
            )}
          </FormItem>
          <FormItem key="Judge" {...this.formLayout} label="判断题数">
            {form.getFieldDecorator('JudgeNum', {
              rules: [{ required: false }],
              initialValue: '',
            })(
              <Input style={{ width: 123, textAlign: 'center' }}></Input>
            )}
            {form.getFieldDecorator('JudgeScore', {
              rules: [{ required: false }],
              initialValue: '',
            })(
              <span style={{ padding: '0 10px' }}> 总分: <Input style={{ width: 120, textAlign: 'center' }}></Input></span>
            )}
          </FormItem>
          <FormItem key="ShortAnswer" {...this.formLayout} label="简答题数">
            {form.getFieldDecorator('ShortAnswerNum', {
              rules: [{ required: false }],
              initialValue: '',
            })(
              <Input style={{ width: 123, textAlign: 'center' }}></Input>
            )}
            {form.getFieldDecorator('ShortAnswerScore', {
              rules: [{ required: false }],
              initialValue: '',
            })(
              <span style={{ padding: '0 10px' }}> 总分: <Input style={{ width: 120, textAlign: 'center' }}></Input></span>
            )}
          </FormItem>
          <FormItem key="FillAdd" {...this.formLayout} label="填空题数">
            {form.getFieldDecorator('FillAddNum', {
              rules: [{ required: false }],
              initialValue: '',
            })(
              <Input style={{ width: 123, textAlign: 'center' }}></Input>
            )}
            {form.getFieldDecorator('FillAddScore', {
              rules: [{ required: false }],
              initialValue: '',
            })(
              <span style={{ padding: '0 10px' }}> 总分: <Input style={{ width: 120, textAlign: 'center' }}></Input></span>
            )}
          </FormItem>
        </div>



        {/* <FormItem {...this.formLayout} label="招生截至日期">
          {form.getFieldDecorator('RegistrationDeadline', {
            // initialValue: formVals.RegistrationDeadline,
            rules: [{ required: true, message: '请输入招生截至日期' }],
          })(
            <DatePicker style={{ float: 'left' }} />
          )}
          <span style={{ float: 'left' }}> 前可以报名</span>
        </FormItem> */}

      </Form>

    ];
  };
  renderFooter = () => {
    const { handleEditModalVisible } = this.props;
    return [
      <Button key="cancel" onClick={this.quitEditFormData}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={this.handleEditModalOd}>
        确定
      </Button>,
    ];
  };
  render() {
    const { editModalVisible, values, formTitle } = this.props;
    const { currentStep, formVals, visible } = this.state;

    return (
      <div>
        {/* 新增信 */}
        <Modal
          width={1280}
          bodyStyle={{ padding: '32px 40px 48px' }}
          visible={editModalVisible}
          title={formTitle}
          zIndex={1000}
          onCancel={this.quitEditFormData}
          footer={this.renderFooter()}
        >
          {this.renderContent(currentStep)}
        </Modal>
        {/* 退出弹出框 */}
        <Modal
          // title="是否取消新增试卷？"
          visible={visible}
          zIndex={1500}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <h2>是否取消新增试卷？</h2>
        </Modal>
      </div>

    );
  }
}

export default ExaminationManagementEdit;

