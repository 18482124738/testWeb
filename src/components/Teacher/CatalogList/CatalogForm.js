
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Button,
  Input
} from 'antd';


const FormItem = Form.Item;


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


@connect(({ courseCatalog }) => ({
  courseCatalog
}))
@Form.create()
class CatalogForm extends PureComponent {
  static defaultProps = {
    handleOk: () => { },
    handleVisible: () => { },
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        ...props.values,
      },
    };
  }


  componentDidMount() {

  }

  handleOk = () => {
    const { form, handleOk } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
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



  render() {
    const { form, handleVisible, values } = this.props;
    const { formVals } = this.state;

    return (
      <div>
        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} key="name" {...this.formLayout} label="课程章节">
            {form.getFieldDecorator('Name', {
              rules: [{ required: true, message: '请输入课程目录名称' }],
              initialValue: formVals.Name,
            })(
              <Input placeholder="目录名称" />
            )}
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button key="cancel" onClick={() => handleVisible(false, values)}>
              取消
            </Button>
            <Button style={{ marginLeft: 8 }} key="submit" type="primary" onClick={() => this.handleOk()}>
              完成
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default CatalogForm;

