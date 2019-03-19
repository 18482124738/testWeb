
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Button, Modal, Select, Radio, Icon, InputNumber, Input, Checkbox } from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import styles from './EditQuestion.less'


const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

// const formItemLayout = {
//   labelCol: { span: 6 },
//   wrapperCol: { span: 18 },
// };
@connect(({ courseCatalog }) => ({
  courseCatalog
}))
@Form.create()
class EditQuestion extends PureComponent {
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
      },
      questionEditorState: EditorState.createEmpty(),
      analysisEditorState: EditorState.createEmpty()
    };
  }


  componentDidMount() {
    const { dispatch } = this.props;
    const { formVals: { CourseTermId: termId } } = this.state;
    dispatch({
      type: 'courseCatalog/fetch',
      payload: { courseTermId: termId },
    });
  }

  onAnalysisEditorStateChange = (editorState) => {
    this.setState({
      analysisEditorState: editorState,
    });
  };

  onQuestionEditorStateChange = (editorState) => {
    this.setState({
      questionEditorState: editorState,
    });
  };

  onAnswerEditorStateChange = (editorState, answerIndex) => {
    const { form } = this.props;
    const answersEditState = form.getFieldValue('answanswerItemsers');
    answersEditState[answerIndex] = editorState
    form.setFieldsValue({
      answers: answersEditState,
    });
  };

  handleOk = () => {
    const { form, handleEditOk } = this.props;
    const { formVals: oldValue, questionEditorState, analysisEditorState } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const questionType = form.getFieldValue('Type');
      let answerStr = '';
      let answerItemStr = '';
      const answer = form.getFieldValue('Answer');
      const answersEditState = form.getFieldValue('answerItems');
      if (questionType === '1' || questionType === '2') {
        const answerArray = [];
        answersEditState.forEach((item, i) => {
          answerArray.push({
            index: i,
            text: draftToHtml(convertToRaw(item.getCurrentContent())),
          })
        });
        answerItemStr = JSON.stringify(answerArray)
        if (questionType === "1") {
          answerStr = answer;
        } else {
          answer.forEach(item => {
            answerStr += `${item},`;
          })
        }
      } else if (questionType === '5') {
        const answerArray = [];
        answer.forEach((item, i) => {
          answerArray.push({
            index: i,
            text: item
          })
        });
        answerStr = JSON.stringify(answer)
      } else {
        answerStr = answer;
      }
      const formVals = {
        ...oldValue, ...fieldsValue,
        Name: draftToHtml(convertToRaw(questionEditorState.getCurrentContent())),
        Analysis: draftToHtml(convertToRaw(analysisEditorState.getCurrentContent())),
        Answer: answerStr,
        AnswerItem: answerItemStr
      };
      this.setState(
        {
          formVals,
        },
        () => {
          handleEditOk(formVals);
        }
      );
    });
  };

  removeAnswer = (index) => {
    const { form } = this.props;
    // can use data-binding to get
    const answers = form.getFieldValue('answerItems');
    // We need at least one passenger
    // can use data-binding to set
    form.setFieldsValue({
      answerItems: answers.filter((key, i) => i !== index),
    });
  }

  addAnswer = () => {
    const { form } = this.props;
    const answers = form.getFieldValue('answerItems');
    const nextKeys = answers.concat(EditorState.createEmpty())
    form.setFieldsValue({
      answerItems: nextKeys
    });
  }


  renderContent = (formVals) => {
    const { form, courseCatalog: { data } } = this.props;
    const { questionEditorState, analysisEditorState } = this.state;
    form.getFieldDecorator('answerItems', { initialValue: [] });
    const answersEditorState = form.getFieldValue('answerItems');
    const answersType = form.getFieldValue('Type');

    const editer = (answersItem,answerIndex) => <Editor
      localization={{ locale: 'zh' }}
      wrapperClassName={styles.answerWrapper}
      editorClassName={styles.answerEditor}
      editorState={answersItem}
      onEditorStateChange={(editorState) => { this.onAnswerEditorStateChange(editorState, answerIndex) }}
      toolbar={{
        options: ['inline', 'textAlign', 'colorPicker', 'link', 'embedded', 'image', 'remove'],
        inline: { inDropdown: true },
        textAlign: { inDropdown: true },
        link: { inDropdown: true },
        history: { inDropdown: true },
        image: { alt: { present: true, mandatory: true } },
      }}
    />
    const formItems = answersEditorState.map((answersItem, index) => (
      <Form.Item
        label={`${index + 1}.`}
        required={false}
        key={`Answer[${index}]`}
      >
        {form.getFieldDecorator(`Answer[${index}]`, {
          rules: [{
            required: true,
            message: "请输入答案内容",
          }],
        })(
          (answersType === "5" ? <Input style={{ width: 100 }} /> : <Checkbox value={`${index}`}>{editer(answersItem)}</Checkbox>)
        )}
        <Icon className={styles.deletButton} type="minus-circle-o" onClick={() => this.removeAnswer(index)} />
      </Form.Item>
    ));
    const mulitItems = answersEditorState.map((answersItem, index) => (
      <Radio value={`${index}`}>{editer(answersItem,index)}</Radio>
    ));

    const AnswerContent = (questionType) => {
      let input = ""
      switch (questionType) {
        case 1:// 单选
          input =
            <Form.Item key="Answer">
              {form.getFieldDecorator('Answer', {
                // initialValue: creatForm.CourseInfo.Name,
                rules: [{ message: '请填写答案' }],
              })(
                <Radio.Group>
                  {mulitItems}
                </Radio.Group>
              )}
            </Form.Item>;
          break;
        case 2:// 多选
          input = formItems;
          break;
        case 3:// 判断
          input =
            <Form.Item key="Answer">
              {form.getFieldDecorator('Answer', {
                // initialValue: creatForm.CourseInfo.Name,
                rules: [{ message: '请填写答案' }],
              })(
                <Radio.Group>
                  <Radio value="1">正确</Radio>
                  <Radio value="0">错误</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          break;
        case 4:// 简答
          input =
            <Form.Item key="Answer">
              {form.getFieldDecorator('Answer', {
                // initialValue: creatForm.CourseInfo.Name,
                rules: [{ message: '请填写答案' }],
              })(
                <TextArea />
              )}
            </Form.Item>
          break;
        case 5:// 填空
          input = formItems;
          break;
        default:
      }
      return input;
    }

    return (
      <Form layout="inline">
        <Row gutter={24}>
          <Col span={8}>
            <FormItem key="courseCatalogId" label="章节">
              {form.getFieldDecorator('CourseCatalogId', {
                initialValue: formVals.CourseCatalogId,
                rules: [{ required: true, message: '请输入课程章节！' }],
              })(
                <Select style={{ width: 160 }}>
                  {data.Rows.map(catalog => <Option value={catalog.Id} key={catalog.Id}>{catalog.Name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem key="difficulty" label="难度">
              {form.getFieldDecorator('Difficulty', {
                // rules: [{ required: true, message: '请输入问题难度！' }],
                initialValue: formVals.Difficulty,
              })(
                <Select style={{ width: 160 }}>
                  <Option value={1} key={1}>1</Option>
                  <Option value={2} key={2}>2</Option>
                  <Option value={3} key={3}>3</Option>
                  <Option value={4} key={4}>4</Option>
                  <Option value={5} key={5}>5</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem key="score" label="分数">
              {form.getFieldDecorator('Score', {
                // rules: [{ required: true, message: '请输入问题分数！' }],
                initialValue: formVals.Score,
              })(
                <InputNumber min={0} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <FormItem key="name" label="题干">
              {form.getFieldDecorator('Name', {
                rules: [{ required: true, message: '请输入问题题干！' }],
                initialValue: formVals.Name,
              })(
                <Editor
                  localization={{ locale: 'zh' }}
                  editorState={questionEditorState}
                  onEditorStateChange={this.onQuestionEditorStateChange}
                  wrapperClassName={styles.demoWrapper}
                  editorClassName={styles.questionEditor}
                  toolbar={{
                    options: ['inline', 'fontSize', 'fontFamily', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove'],
                    inline: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    image: { alt: { present: true, mandatory: true } },
                  }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem key="analysis" label="试题解析">
              <Editor
                localization={{ locale: 'zh' }}
                editorState={analysisEditorState}
                onEditorStateChange={this.onAnalysisEditorStateChange}
                wrapperClassName={styles.demoWrapper}
                editorClassName={styles.questionEditor}
                toolbar={{
                  options: ['inline', 'fontSize', 'fontFamily', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove'],
                  inline: { inDropdown: true },
                  textAlign: { inDropdown: true },
                  link: { inDropdown: true },
                  image: { alt: { present: true, mandatory: true } },
                }}
              />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <FormItem key="type" label="问题类型">
              {form.getFieldDecorator('Type', {
                rules: [{ required: true, message: '请输入问题类型！' }],
                initialValue: formVals.Type,
              })(
                <Radio.Group>
                  <Radio value={1}>单选</Radio>
                  <Radio value={2}>多选</Radio>
                  <Radio value={3}>判断</Radio>
                  <Radio value={4}>简答</Radio>
                  <Radio value={5}>填空</Radio>
                </Radio.Group>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            答案:
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            {AnswerContent(form.getFieldValue('Type'))}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item>
              <Button type="dashed" onClick={this.addAnswer} style={{ width: '100%' }}>
                <Icon type="plus" />增加答案
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }

  renderFooter = () => {
    const { handleEditModalVisible, values } = this.props;
    return [
      <Button key="cancel" onClick={() => handleEditModalVisible(false, values)}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={() => this.handleOk()}>
        完成
      </Button>,
    ];
  };

  render() {
    const { editModalVisible, handleEditModalVisible, values, formTitle } = this.props;
    const { currentStep, formVals } = this.state;

    return (
      <Modal
        width={1000}
        destroyOnClose
        title={formTitle}
        keyboard={false}
        maskClosable={false}
        visible={editModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleEditModalVisible(false, values)}
        afterClose={() => handleEditModalVisible()}
      >
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}

export default EditQuestion;

