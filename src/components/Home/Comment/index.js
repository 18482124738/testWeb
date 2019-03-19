import React, { PureComponent } from 'react';
import moment from 'moment';
import { Radio, Card, List, Avatar, Rate, Divider } from 'antd';
import { connect } from 'dva';
// import ArticleListContent from '@/components/ArticleListContent';
import styles from './index.less';

const RadioGroup = Radio.Group;

@connect(({ courseInfo, courseComment, loading }) => ({
  currentCourse: courseInfo.current,
  courseComment: courseComment.data,
  courseCommentLoading: loading.effects['courseComment/fetch'],
}))
class Comment extends PureComponent {
  state = {
    value: 1,
  }

  componentDidMount() {
    const { dispatch, currentCourse } = this.props;
    dispatch({
      type: 'courseComment/fetch',
      payload: { courseInfoId: currentCourse.Id }
    });
  }

  appraiseChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }

  render() {
    // const {
    //   list: { list },
    // } = this.props;
    const { courseComment: { Rows } } = this.props

    const { value } = this.state;
    return (
      <div>
        <div className={styles.evaluateRadio}>
          <div className={styles.reputations}>
            <p>84%</p>
            <p>好评度</p>
          </div>
          <div className={styles.radioBox}>
            <RadioGroup onChange={this.appraiseChange} value={value}>
              <Radio value={1}>全部评价(26)</Radio>
              <Radio value={2} style={{ marginLeft: 10 }}>好评(22)</Radio>
              <Radio value={3} style={{ marginLeft: 10 }}>中评(2)</Radio>
              <Radio value={4} style={{ marginLeft: 10 }}>差评(2)</Radio>
            </RadioGroup>
          </div>
        </div>
        <div className={styles.userComment}>
          <Card
            bodyStyle={{ padding: 0 }}
            bordered={false}
            className={styles.activeCard}
            title="动态"
          >
            <List
              size="large"
              dataSource={Rows}
              renderItem={item => (
                <List.Item key='1'>
                  <div className={styles.activitiesList}>
                    <List.Item.Meta
                      avatar={<Avatar src='123/' />}
                      title={
                        <div>
                          <div>{item.Commentator}</div>
                          <Rate disabled defaultValue={item.Mark} />
                          <div className={styles.userContent}>
                            <span className={styles.event}>{item.Content}</span>
                          </div>
                        </div>
                      }
                      description={
                        <div>
                          <span className={styles.datetime}>
                            {moment(item.CreateTime).fromNow()}
                          </span>
                          <div>
                            <Divider />
                            <p>机构回复：<span>谢谢支持，谢谢反馈信息。我将不断努力做得更好，让大家有更好的体验。</span></p>
                            {moment("2018-01-08").fromNow()}
                          </div>
                        </div>
                      }
                    />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </div>
      </div>
    );
  }
}

export default Comment;
