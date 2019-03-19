import React, { PureComponent } from 'react';
import {
  Form,
  Steps,
  Input,
  Cascader,
  Radio,
  Button,
  InputNumber,
  Upload,
  message,
  Icon,
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import teachStyles from '../TeachLayout.less';
import creatStyles from './CreatCourse.less';

const { Step } = Steps;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
let toIsCharge = false;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

// 课程管理
@connect(({ courseInfo, courseCategory, loading }) => ({
  courseInfo,
  courseCategory,
  loading: loading.models.courseInfo,
}))
@Form.create()
class CreatCourse extends PureComponent {
  state = {
    steps: [
      {
        title: '课程概况',
        index: 0,
      },
      {
        title: '课程详情',
        index: 1,
      },
      {
        title: '教学内容',
        index: 2,
      },
    ],
    current: 0,
    imageUrl: '',
  };

  componentDidMount() {
    const {
      dispatch,
      location,
      courseInfo: { creatForm },
    } = this.props;
    dispatch({
      type: 'courseInfo/saveStepFormData',
      payload: location.state,
    });
    if (creatForm.CourseInfo.IsCharge === false) {
      toIsCharge = true;
    } else if (creatForm.CourseInfo.IsCharge === true) {
      toIsCharge = false;
    }
  }

  backPage = () => {
    router.push('/user/management/teacher/index/courseManagement');
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        })
      );
    }
  };

  onRadioChange = e => {
    const {
      dispatch,
      courseInfo: { creatForm },
    } = this.props;
    const key = e.target.value;
    if (key === true) {
      toIsCharge = false;
      if (creatForm.Price) {
        creatForm.CourseInfo.Price = creatForm.Price;
      }
    } else if (key === false) {
      toIsCharge = true;
      if (creatForm.CourseInfo.Price !== 0) {
        creatForm.CourseInfo.Price = 0;
        dispatch({
          type: 'courseInfo/saveStepFormData',
          payload: creatForm,
        });
      }
    }
  };

  render() {
    const { current, steps, imageUrl, loading } = this.state;
    const {
      form,
      courseCategory: { tree },
      courseInfo: { creatForm },
    } = this.props;
    const { getFieldDecorator, validateFields } = form;

    const onValidateForm = () => {
      validateFields((err, values) => {
        creatForm.CourseInfo = {
          ...values,
          CategoryPath: values.CategoryPath.join(','),
          CoverImage:
            creatForm.updateStatus && creatForm.CourseInfo.CoverImage !== '' && imageUrl === ''
              ? creatForm.CourseInfo.CoverImage
              : imageUrl,
        };
        if (!err) {
          // dispatch({
          //   type: 'courseInfo/saveStepFormData',
          //   payload: creatForm,
          // });
          // router.push('/user/management/teacher/index/courseDetails');
          router.push({
            pathname: '/user/management/teacher/index/courseDetails',
            state: creatForm,
          });
        }
      });
    };

    const beforeUpload = file => {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        message.error('只能上传JPG的图片格式!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过2MB!');
      }
      return isJPG && isLt2M;
    };

    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">
          {creatForm.updateStatus ? '点击更换封面' : '上传封面'}
        </div>
      </div>
    );

    return (
      <div className={teachStyles.rightModule}>
        {/* <Button onClick={this.returnCourse} className={creatStyles.backButton}>返回</Button> */}
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.index} title={item.title} />
          ))}
        </Steps>
        <p className={teachStyles.title}>基本信息</p>
        <div className={creatStyles.course}>
          <Form layout="horizontal">
            <Form.Item {...formItemLayout} label="课程名称">
              {getFieldDecorator('Name', {
                initialValue: creatForm.CourseInfo.Name ? creatForm.CourseInfo.Name : '',
                rules: [{ required: true, message: '请输入课程名称' }],
              })(<Input placeholder="请输入课程名称" style={{ width: 250 }} />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="所属类目">
              {getFieldDecorator('CategoryPath', {
                initialValue: creatForm.CourseInfo.CategoryPath,
                rules: [{ required: true, message: '请选择所属类目' }],
              })(
                <Cascader
                  options={tree}
                  fieldNames={{ label: 'Name', value: 'Id', children: 'ChildNode' }}
                  placeholder="请选择所属类目"
                  style={{ width: 250 }}
                />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="课程封面">
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="//jsonplaceholder.typicode.com/posts/"
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
              >
                {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
              </Upload>
              <div style={{ width: '102px', display: creatForm.updateStatus ? 'block' : 'none' }}>
                <p
                  style={{
                    width: '102px',
                    textAlign: 'center',
                    margin: '0px',
                    border: '1px dashed #d9d9d9',
                  }}
                >
                  当前封面
                </p>
                <div style={{ width: '102px', height: '102px', border: '1px dashed #d9d9d9' }}>
                  <img
                    style={{ width: '100%', height: '100%' }}
                    alt=""
                    src={creatForm.CourseInfo.CoverImage}
                  />
                </div>
              </div>
              <div className={creatStyles.lg_div}>
                <p style={{ width: '266px' }}>
                  图片要求:尺寸大于1080*608 分辨率小于96dpi,大小小于2M,只支持JPG格式图片。
                </p>
              </div>
            </Form.Item>
            <Form.Item {...formItemLayout} label="课程简介">
              {getFieldDecorator('Introduction', {
                initialValue: creatForm.CourseInfo.Introduction,
                rules: [{ required: true, message: '请输入课程简介' }],
              })(<TextArea rows={4} />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="是否收费">
              {getFieldDecorator('IsCharge', {
                initialValue: creatForm.CourseInfo.IsCharge,
                rules: [{ required: true, message: '请输入是否收费' }],
              })(
                <RadioGroup onChange={this.onRadioChange}>
                  <Radio value={false}>免费</Radio>
                  <Radio value={!false}>收费</Radio>
                </RadioGroup>
              )}
              <div className={creatStyles.hintDiv}>
                <p>课程发布后，课程价格（含任意学）修改规则如下：</p>
                <ol>
                  <li>每次修改价格生效后，需确定是否修改成功。</li>
                  <li>修改价格后，价格不会变动。</li>
                </ol>
              </div>
            </Form.Item>
            <Form.Item {...formItemLayout} label="课程价格">
              {getFieldDecorator('Price', {
                initialValue: creatForm.CourseInfo.Price,
                rules: [{ required: true, message: '请输入课程价格' }],
              })(
                <InputNumber
                  min={0}
                  disabled={toIsCharge}
                  placeholder="请输入课程价格"
                  style={{ width: 180 }}
                />
              )}
              <span className={creatStyles.topSpan}>元</span>
            </Form.Item>
            <div className={teachStyles.buttonGather}>
              <Button type="primary" onClick={onValidateForm}>
                下一步
              </Button>
              <Button onClick={this.backPage}>返回</Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default CreatCourse;
