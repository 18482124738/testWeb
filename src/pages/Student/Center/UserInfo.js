import React, { PureComponent } from 'react';
import { Divider, Input, Form, Button, message, Modal } from 'antd';
import { connect } from 'dva';
import layoutStyles from '../StudentLayout.less';
import UserInfoStyles from './UserInfo.less';
import ChangePasModal from './../../Account/ChangePasModal';

const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 4 },
    sm: { span: 4 },
  },
};
@Form.create()
// 学员个人中心
@connect(({ userInfo, loading }) => ({
  userInfo,
  loading: loading.models.courseInfo,
}))
class UserInfo extends PureComponent {
  state = {
    isUpdate: false,
    isChangePas: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userInfo/queryOne',
    });
  }

  /* 确认修改个人信息 */
  onSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'userInfo/update',
          payload: {
            RealName: values.Name,
            Number: values.Number,
          },
        });
        this.setState({
          isUpdate: false,
        });
        console.log(values);
      }
    });
  };

  /* 触发修改个人信息 */
  handleIsUpdate = () => {
    const { form } = this.props;
    let { isUpdate } = this.state;
    if (isUpdate) {
      form.resetFields();
    }
    this.setState({
      isUpdate: !isUpdate,
    });
  };

  /* 触发（或关闭）修改密码 */
  changePas = () => {
    const { isChangePas } = this.state;
    this.setState({
      isChangePas: !isChangePas,
    });
  };

  render() {
    const { isUpdate, phoneNum } = this.state;
    const {
      form,
      userInfo: { currentUser },
    } = this.props;
    const { getFieldDecorator, validateFields } = form;

    return (
      <div className={layoutStyles.rightModule}>
        <div style={{ position: 'relative' }}>
          <span className={UserInfoStyles.titleSpan}>个人信息({currentUser.Name})</span>
          <a
            style={{ cursor: 'pointer', border: 'none', marginRight: 10 }}
            onClick={this.handleIsUpdate}
          >
            {isUpdate ? '取消修改' : '修改信息'}
          </a>
          {isUpdate ? (
            <a style={{ cursor: 'pointer', border: 'none' }} onClick={this.onSubmit}>
              确认修改
            </a>
          ) : (
            ''
          )}
        </div>
        <div style={{ margin: 30 }}>
          <Form name="form1" onSubmit={this.onSubmit} layout="horizontal">
            <Form.Item {...formItemLayout} label="用户名">
              {getFieldDecorator('Name', {
                initialValue: currentUser.Name,
                rules: [
                  {
                    required: true,
                    message: '请输入用户名',
                  },
                ],
              })(
                <div>
                  <Input
                    style={{ display: isUpdate ? '' : 'none', width: 200 }}
                    placeholder={currentUser.Name ? currentUser.Name : '请输入用户名'}
                  />
                  <span style={{ display: !isUpdate ? '' : 'none' }}>
                    {currentUser.Name ? currentUser.Name : '暂无'}
                  </span>
                </div>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="学号">
              {getFieldDecorator('Number', {
                initialValue: currentUser.Number,
                rules: [
                  {
                    required: true,
                    message: '请输入学号',
                  },
                ],
              })(
                <div>
                  <Input
                    style={{ display: isUpdate ? '' : 'none', width: 200 }}
                    placeholder={currentUser.Number ? currentUser.Number : '请输入学号'}
                  />
                  <span style={{ display: !isUpdate ? '' : 'none' }}>
                    {currentUser.Number ? currentUser.Number : '暂无'}
                  </span>
                </div>
              )}
            </Form.Item>
          </Form>
        </div>
        <Divider />
        <div style={{ position: 'relative' }}>
          <span className={UserInfoStyles.titleSpan}>账户信息</span>
        </div>
        <div style={{ margin: 30 }}>
          <Form layout="horizontal">
            <Form.Item {...formItemLayout} label="余额">
              {getFieldDecorator('Balance', {
                initialValue: currentUser.Balance,
              })(<span>{currentUser.Balance ? currentUser.Balance : '暂无'}</span>)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="积分">
              {getFieldDecorator('BonusPoints', {
                initialValue: currentUser.BonusPoints,
              })(<span>{currentUser.BonusPoints ? currentUser.BonusPoints : '暂无'}</span>)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="课程数量">
              {getFieldDecorator('CourseNum', {
                initialValue: currentUser.CourseNum,
              })(<span>{currentUser.CourseNum ? currentUser.CourseNum : '暂无'}</span>)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="手机号码">
              {getFieldDecorator('Tel', {
                initialValue: currentUser.Tel,
              })(<span>{currentUser.Tel ? currentUser.Tel : '暂无'}</span>)}
            </Form.Item>
          </Form>
          <span className={UserInfoStyles.alertSpan}>
            *您的手机号将有助于我们提供更多教学服务，未经授权不会主动公开，请放心
          </span>
        </div>
        <Divider />
        <div style={{ position: 'relative' }}>
          <div>
            <span className={UserInfoStyles.titleSpan}>收货地址</span>
            <a>新增</a>
          </div>
          <div style={{ margin: 30 }}>
            <span className={UserInfoStyles.alertSpan}>
              *部分课程可能会有教材寄送服务，未经授权不会主动公开，请放心
            </span>
          </div>
        </div>
        <Divider />
        <div style={{ position: 'relative' }}>
          <div>
            <span className={UserInfoStyles.titleSpan}>安全设置</span>
            <a onClick={this.changePas}>修改密码</a>
          </div>
          <div style={{ margin: 30 }}>
            <span className={UserInfoStyles.alertSpan}>
              *通过验证旧密码修改密码，未经授权不会主动公开，请放心
            </span>
          </div>
        </div>
        <ChangePasModal isChangePas={this.state.isChangePas} changePas={this.changePas} />
      </div>
    );
  }
}

export default UserInfo;
