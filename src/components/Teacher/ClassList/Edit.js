
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Modal,
  DatePicker
} from 'antd';

const FormItem = Form.Item;

@connect(({ courseClass, orgPerson }) => ({
  courseClass,
  orgPerson
}))
@Form.create()
class EditClass extends PureComponent {
  static defaultProps = {
    handleEditOk: () => { },
    handleEditModalVisible: () => { },
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        ...props.values,
      }
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }


  componentDidMount() {

  }

  handleOk = () => {
    const { form, handleEditOk } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          handleEditOk(formVals);
        }
      );
    });
  }

  renderContent = () => {
    const { form } = this.props;
    return [
      <Form>
        <FormItem {...this.formLayout} label="班级名称">
          {form.getFieldDecorator('Name', {
            rules: [{ required: true, message: '请输入班级名称！' }],
          })(
            <Input width={200} />
          )}
        </FormItem>
        <FormItem {...this.formLayout} label="班主任名称">
          {form.getFieldDecorator('HeadmasterId', {
            rules: [{ required: true, message: '请输入班主任名称！' }],
          })(
            <Input width={200} />
          )}
        </FormItem>
        <FormItem {...this.formLayout} label="报名限额">
          {form.getFieldDecorator('StudentQuota', {
            rules: [{ required: true, message: '请输入报名限额' }],
          })(
            <Input width={200} />
          )}
        </FormItem>
        <FormItem {...this.formLayout} label="招生截至日期">
          {form.getFieldDecorator('RegistrationDeadline', {
            rules: [{ required: true, message: '请输入招生截至日期' }],
          })(
            <DatePicker style={{ float: 'left' }} />
          )}
          <span style={{ float: 'left' }}> 前可以报名</span>
        </FormItem>
        <FormItem {...this.formLayout} label="学习截至日期">
          {form.getFieldDecorator('LearningDeadline', {
            rules: [{ required: true, message: '请输入学习截至日期' }],
          })(
            <DatePicker style={{ float: 'left' }} />
          )}
          <span style={{ float: 'left' }}> 前可以学习</span>
        </FormItem>
      </Form>

    ];
  };

  renderFooter = () => {
    const { handleEditModalVisible } = this.props;

    return [
      <Button key="cancel" onClick={() => handleEditModalVisible(false)}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={this.handleOk}>
        确定
      </Button>,
    ];
  };

  render() {
    const { editModalVisible, handleEditModalVisible, formTitle } = this.props;
    const { currentStep, formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        title={formTitle}
        visible={editModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleEditModalVisible(false)}
        afterClose={() => handleEditModalVisible()}
      >

        {this.renderContent(formVals)}
      </Modal>
    );
  }
}

export default EditClass;

