import React, { PureComponent } from 'react';
import { List, Card } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import stylesProjects from './CourseList.less';
import NotCover from '../../assets/notcover1.jpg';

@connect(({ courseInfo }) => ({
  courseInfo,
}))

class CourseList extends PureComponent {
  componentDidMount() {
    const { dispatch, data } = this.props;
    dispatch({
      type: 'courseInfo/fetchInterest',
    });
  }

  lessonInform = (item, index) => {
    router.push({ pathname: '/course/info-page', state: { item } })
  }

  render() {
    let interestList = [{ CourseInfoDtoList: [], Title: '暂无信息' }];
    const { courseInfo: { interest }, } = this.props;
    if (interest != '') {
      interestList = [interest[0]];
    }
    return (
      <div>
        {
          interestList ? interestList.map((interestItem, k) => (
            <div key={k}>
              <h2 style={{ textAlign: "center" }}>{interestItem.Title}<span className={stylesProjects.more}>更多</span></h2>
              <div style={{ marginBottom: 50 }}>
                <List
                  className={stylesProjects.coverCardList}
                  rowKey="id"
                  grid={{ gutter: 24, xxl: 4, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
                  dataSource={interestItem.CourseInfoDtoList}
                  renderItem={item => (
                    <List.Item>
                      <Card
                        bordered={false}
                        onClick={() => this.lessonInform(item)}
                        className={stylesProjects.card}
                        hoverable
                        cover={
                          <img alt="example" src={item.CoverImage ? item.CoverImage : NotCover} className={stylesProjects.coverImg} />
                        }
                      >
                        <Card.Meta title={<a>{item.Name}</a>} />
                        <div className={stylesProjects.cardItemContent}>
                          <span className={stylesProjects.coursePrice}>￥{item.IsCharge ? item.Price : "免费"}</span>
                          <div className={stylesProjects.avatarList}>
                            {item.Introduction}

                          </div>
                        </div>
                      </Card>
                    </List.Item>
                  )}
                />
              </div>
            </div>
          )) : ''
        }
      </div>
    );
  }
}

export default CourseList;
