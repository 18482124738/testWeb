import React, { PureComponent } from 'react';
import { Form, Steps, Input, Select, Button, DatePicker, InputNumber, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import teachStyles from '../TeachLayout.less';
import contentStyles from './TermRedactCtn.less';

// const { Step } = Steps;
const { Option } = Select;


const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};



@connect(({ courseTerm, courseCategory, loading }) => ({
  courseTerm,
  courseCategory,
  loading: loading.models.courseTerm,
}))
@Form.create()
// 课程概况
class TermRedactCtn extends PureComponent {
  state = {
    steps: [{
      title: '课程概况',
      index: 0,
    }, {
      title: '课程详情',
      index: 1,
    }, {
      title: '教学内容',
      index: 2,
    }],
    current: 2,
    medicine: [],
  }

  componentDidMount() {
    const { dispatch,location } = this.props;
    dispatch({
      type: 'courseTerm/saveStepFormData',
      payload: location.state,
    });
    const that = this;
    dispatch({
      type: 'courseInfo/fetchUserList',
      payload: {},
      callback(e) {
        that.setState({
          medicine: e.Rows
        })
      }
    });
  }

  backPage = () => {
    router.push('/user/management/teacher/index/termManagement');
  }

  render() {
    const { current, steps, medicine } = this.state;
    const {
      form,
      dispatch,
      courseTerm: { creatForm } } = this.props;
    const { getFieldDecorator, validateFields } = form;

    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          if (creatForm.updateStatus) {
            dispatch({
              type: 'courseTerm/update',
              payload: {
                Id: creatForm.Id,
                ...values
              },
              callback() {
                message.success("学期修改成功")
                router.push('/user/management/teacher/index/termManagement');
              }
            });
          } else {
            dispatch({
              type: 'courseTerm/add',
              payload: { ...values },
              callback() {
                message.success("学期新增成功")
                router.push('/user/management/teacher/index/termManagement');
              }
            });
          }
        }
      });
    };

    return (
      <div className={teachStyles.rightModule}>
        <Form>
          <p className={teachStyles.title}>学期信息</p>
          <div className={contentStyles.course}>
            <Form.Item {...formItemLayout} label="课程名称">
              {getFieldDecorator('CourseInfoId', {
                initialValue: creatForm.CourseInfoId,
                rules: [{ required: true, message: '请输入课程名称' }],
              })(
                <Select
                  showSearch
                  style={{ width: 250 }}
                  allowClear
                  onChange={this.selectedOption}
                  placeholder="请选择课程名称"
                >
                  {medicine.map((el, index) => {
                    return (
                      <Option
                        value={el.Id}
                        key={el.Id || index}
                        data-self={el}
                      >
                        {"课程："} {el.Name ? el.Name : ""}&nbsp;&nbsp;&nbsp;
                        {"是否免费："} {el.IsCharge ? "收费" : "免费"}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="学期名称">
              {getFieldDecorator('Name', {
                initialValue: creatForm.Name,
                rules: [{ required: true, message: '请输入学期名称' }],
              })(
                <Input placeholder="请输入学期名称" style={{ width: 250 }} />
              )}
            </Form.Item>
            <div style={{ marginLeft: "12%" }}>
              <p style={{ width: "335px" }}>注意：请先选择课程名称再录入学期名称，最后提交保存学期。</p>
            </div>
            <div className={teachStyles.termGather}>
              <Button type="primary" onClick={onValidateForm}>{creatForm.updateStatus ? "保存修改" : "提交"}</Button>
              <Button onClick={this.backPage}>取消</Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default TermRedactCtn;

