import React, { PureComponent } from 'react';
import { Input, Checkbox, Modal, List, Form } from 'antd';
import { connect } from 'dva';
// import ArticleListContent from '@/components/ArticleListContent';
import styles from './RecordedBroadcast.less';
import addIcon from '@/assets/add.png';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const data = [
  '11.mp3',
  '22.wmv',
  '33.avi',
];

@connect(({ list }) => ({
  list,
}))
@Form.create()
class RecordedBroadcast extends PureComponent {
  state= {
    videoVisible: false,
  }

  

  relevanceVideo = () => {
    this.setState({videoVisible: true})
  }

  render() {
    const {
      form,
      // dispatch,
      // courseCategory: { tree },
      // courseInfo: { creatForm } 
    } = this.props;
    const { getFieldDecorator } = form;
    const { videoVisible } = this.state;
    const vidoModal = (
      <Modal
        title="请选择关联视频"
        visible={videoVisible}
        onOk={() => {this.setState({videoVisible: false})}}
        onCancel={() => {this.setState({videoVisible: false})}}
      >
        <List
          bordered={false}
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <Checkbox><a>{item}</a></Checkbox>
            </List.Item>
          )}
        />
      </Modal>
    )
    return (
      <div>
        <Form layout="horizontal">
          <Form.Item {...formItemLayout} label="任务名称">
            {getFieldDecorator('Name', {
              // initialValue: creatForm.CourseInfo.Name,
              rules: [{ required: true, message: '请输入任务名称' }],
            })(
              <Input placeholder="Basic usage" style={{ width: 250 }} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="关联录播视频">
            {getFieldDecorator('Name', {
              // initialValue: creatForm.CourseInfo.Name,
              rules: [{ required: true, message: '请选择录播视频' }],
            })(
              <div className={styles.courseAddButton} onClick={this.relevanceVideo}>
                <img alt="" src={addIcon} />
                <p>关联录播视频</p>
              </div>
            )}
          </Form.Item>
        </Form>
        <div className={styles.videoModel}>
          <div className="ant-col-5 ant-form-item-label">
          </div>
          <Checkbox>支持免费试学</Checkbox>
        </div>
        {vidoModal}}
      </div>
    );
  }
}

export default RecordedBroadcast;
