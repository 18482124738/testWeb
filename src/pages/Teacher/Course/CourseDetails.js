import React, { Component } from 'react';
import { Form, Steps, Button, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import detailsStyles from './CourseDetails.less';
import teachStyles from '../TeachLayout.less';

const { Step } = Steps;




@connect(({ courseInfo, loading }) => ({
  courseInfo,
  loading: loading.models.courseInfo,
}))
@Form.create()
class CourseDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
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
      current: 1,
    }
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    const self = this;
    dispatch({
      type: 'courseInfo/editInit',
      payload: location.state,
      callback: returnObj => {
        const contentBlock = htmlToDraft(returnObj.Data.Content);
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        self.setState({
          editorState
        })
      }
    });
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  // 保存修改
  saveUpdate = () => {
    const {
      dispatch,
      courseInfo: { creatForm } } = this.props;
    const { editorState } = this.state;
    creatForm.CourseDetail.Content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const creatFormData = creatForm.CourseInfo;
    creatFormData.Id = creatForm.Id;
    dispatch({
      type: 'courseDetail/update',
      payload: creatForm.CourseDetail
    });
    dispatch({
      type: 'courseInfo/update',
      payload: creatFormData,
      callback() {
        message.success('修改成功');
        router.push('/user/management/teacher/index/courseManagement');
      }
    });

  }

  // 取消修改
  cancelUpdate = () => {
    router.push('/user/management/teacher/index/courseManagement');
  }


  backPage = () => {
    router.push('/user/management/teacher/index/creatCourse');
  }

  render() {
    const { editorState, current, steps } = this.state;
    const {
      dispatch,
      courseInfo: { creatForm } } = this.props;
    const onValidateForm = () => {
      creatForm.CourseDetail = { Content: draftToHtml(convertToRaw(editorState.getCurrentContent())) };
      dispatch({
        type: 'courseInfo/saveStepFormData',
        payload: creatForm,
      });
      router.push('/user/management/teacher/index/teachContent');

    };

    return (
      <div className={teachStyles.rightModule}>
        <Steps current={current}>
          {steps.map(item => <Step key={item.index} title={item.title} />)}
        </Steps>
        <Form layout="horizontal">
          <Form.Item>
            <Editor
              localization={{ locale: 'zh' }}
              editorState={editorState}
              wrapperClassName={detailsStyles.demoWrapper}
              editorClassName={detailsStyles.demoEditor}
              onEditorStateChange={this.onEditorStateChange}
            />
          </Form.Item>
          <div style={{ display: creatForm.updateStatus ? "none" : 'block' }} className={teachStyles.buttonGather}>
            <Button type="primary" onClick={onValidateForm}>下一步</Button>
            <Button onClick={this.backPage}>上一步</Button>
          </div>
          <div style={{ display: creatForm.updateStatus ? "block" : 'none' }} className={teachStyles.saveButtonGather}>
            <Button type="primary" onClick={this.saveUpdate}>保存修改</Button>
            <Button onClick={this.backPage}>上一步</Button>
            <Button onClick={this.cancelUpdate}>取消修改</Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default CourseDetails;