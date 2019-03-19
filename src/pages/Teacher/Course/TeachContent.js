import React, { PureComponent } from 'react';
import { Form, Steps, Input, Button } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import teachStyles from '../TeachLayout.less';
import contentStyles from './CreatCourse.less';

const { Step } = Steps;


const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};



@connect(({ courseInfo, courseCategory, loading }) => ({
  courseInfo,
  courseCategory,
  loading: loading.models.courseInfo,
}))
@Form.create()
// 课程概况
class CreatCourse extends PureComponent {
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
  }

  backPage = () => {
    router.push('/user/management/teacher/index/courseDetails');
  }

  render() {
    const { current, steps } = this.state;
    const {
      form,
      dispatch,
      courseInfo: { creatForm } } = this.props;
    const { getFieldDecorator, validateFields } = form;

    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          creatForm.CourseTerm = {
            ...values,
          };
          creatForm.InstructorId = values.InstructorId;
          creatForm.TeacherId = values.TeacherId;
          creatForm.HeadmasterId = values.HeadmasterId;
          dispatch({
            type: 'courseInfo/add',
            payload: creatForm,
          });
        }
      });
    };

    return (
      <div className={teachStyles.rightModule}>
        <Steps current={current}>
          {steps.map(item => <Step key={item.index} title={item.title} />)}
        </Steps>
        <Form>
          <p className={teachStyles.title}>本期信息</p>
          <div className={contentStyles.course}>
            <Form.Item {...formItemLayout} label="学期名称">
              {getFieldDecorator('Name', {
                initialValue: creatForm.CourseTerm.Name,
                rules: [{ required: true, message: '请输入学期名称' }],
              })(
                <Input placeholder="请输入学期名称" style={{ width: 250 }} />
              )}
            </Form.Item>
            <div className={teachStyles.buttonGather}>
              <Button type="primary" onClick={onValidateForm}>提交</Button>
              <Button onClick={this.backPage}>上一步</Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default CreatCourse;

