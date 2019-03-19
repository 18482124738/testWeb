import React, { PureComponent } from 'react';
import { Input, Form, Button, Modal, message } from 'antd';
import { connect } from 'dva';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 8,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 8,
    },
    sm: {
      span: 8,
    },
  },
};
@Form.create()
@connect(({ userInfo, loading }) => ({
  userInfo,
  loading: loading.models.courseInfo,
}))
class ChangePasModal extends PureComponent {
  /* 取消修改密码 */
  handleCancel = () => {
    const { form } = this.props;
    form.resetFields(); // 重置表单
    this.props.changePas(); // 关闭modal
  };
  /* 确认修改密码 */
  handleOK = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.newPas1 != values.newPas2) {
          message.error('两次新密码不一致！');
          return;
        }
        // dispatch({
        //   type: 'userInfo/update',
        //   payload: {
        //     password: values.newPas1,
        //   },
        // });
        console.log(values);
        form.resetFields();
        this.props.changePas();
      }
    });
  };
  render() {
    const { form } = this.props;
    const { getFieldDecorator, validateFields } = form;
    return (
      <Modal
        title="修改密码"
        visible={this.props.isChangePas}
        onCancel={this.handleCancel}
        onOk={this.handleOK}
      >
        <Form name="form1" onSubmit={this.handleChangePas} layout="horizontal">
          <Form.Item {...formItemLayout} label="旧密码">
            {getFieldDecorator('oldPas', {
              rules: [
                {
                  required: true,
                  message: '请输入旧密码',
                },
              ],
            })(
              <Input
                style={{ display: true ? '' : 'none', width: 200 }}
                placeholder="请输入旧密码"
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="新密码">
            {getFieldDecorator('newPas1', {
              rules: [
                {
                  required: true,
                  message: '请输入新密码',
                },
              ],
            })(
              <Input.Password
                style={{ display: true ? '' : 'none', width: 200 }}
                placeholder="请输入新密码"
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="验证新密码">
            {getFieldDecorator('newPas2', {
              rules: [
                {
                  required: true,
                  message: '请再次输入新密码',
                },
              ],
            })(
              <Input.Password
                style={{ display: true ? '' : 'none', width: 200 }}
                placeholder="请再次输入新密码"
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default ChangePasModal;
