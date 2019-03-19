import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Row, Col, Divider, Spin } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './CourseInfoDetail.less';

@connect(({ loading, courseInfo, courseTeacher, courseTerm }) => ({
  listLoading: loading.effects['list/fetch'],
  currentCourse: courseInfo.current,
  CourseInfo: courseInfo.data,
  CourseTerm: courseTerm.data,
  currentCourseLoading: loading.effects['courseInfo/fetchSingle'],
  courseTeacher: courseTeacher.data,
  courseTeacherLoading: loading.effects['courseTeacher/fetch'],
}))
class CourseInfoDetail extends PureComponent {
  state = {
    newTags: [],
    inputValue: '',
  };

  componentDidMount() {
    const { dispatch, currentCourse } = this.props;
    dispatch({
      type: 'courseTeacher/fetch',
      payload: { courseInfoId: currentCourse.Id },
    });
  }

  onTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'catalog':
        router.push(`${match.url}/catalog`);
        break;
      case 'recource':
        router.push(`${match.url}/recource`);
        break;
      case 'term':
        router.push(`${match.url}/term`);
        break;
      case 'comment':
        router.push(`${match.url}/comment`);
        break;
      case 'question':
        router.push(`${match.url}/question`);
        break;
      default:
        break;
    }
  };

  saveInputRef = input => {
    this.input = input;
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let { newTags } = state;
    if (inputValue && newTags.filter(tag => tag.label === inputValue).length === 0) {
      newTags = [...newTags, { key: `new-${newTags.length}`, label: inputValue }];
    }
    this.setState({
      newTags,
      inputValue: '',
    });
  };

  render() {
    const {
      listLoading,
      currentCourse,
      CourseTerm,
      CourseInfo,
      courseTeacher: { Rows },
      courseTeacherLoading,
      match,
      location,
      children,
    } = this.props;

    const operationTabList = [
      {
        key: 'term',
        tab: (
          <span>
            学期 <span style={{ fontSize: 14 }}>({CourseTerm.Total})</span>
          </span>
        ),
      },
      {
        key: 'recource',
        tab: (
          <span>
            资源 <span style={{ fontSize: 14 }}>({CourseInfo.Total})</span>
          </span>
        ),
      },
      {
        key: 'comment',
        tab: (
          <span>
            评论 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
    ];

    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={7} md={7}>
            <div className={styles.avatarHolder}>
              <img alt="" src={currentCourse.CoverImage ? currentCourse.CoverImage : '暂无'} />
              <div className={styles.name}>{currentCourse.Name ? currentCourse.Name : '暂无'}</div>
              <div>{currentCourse.Introduction ? currentCourse.Introduction : '暂无'}</div>
            </div>
          </Col>
          <Col lg={17} md={17}>
            <div className={styles.detail}>
              <p>
                <i className={styles.group} />
                分类：
                {currentCourse.CourseCategory.Name ? currentCourse.CourseCategory.Name : '暂无'}
              </p>
            </div>
            <Divider style={{ marginTop: 16 }} dashed />
            <div className={styles.tags}>
              <div className={styles.tagsTitle}>标签</div>
              {/* {currentUser.tags.concat(newTags).map(item => (
                    <Tag key={item.key}>{item.label}</Tag>
                  ))} */}
            </div>
            <Divider style={{ marginTop: 16 }} dashed />
            <div className={styles.team}>
              <div className={styles.teamTitle}>教师</div>
              <Spin spinning={courseTeacherLoading}>
                <Row gutter={36}>
                  {Rows.map(item => (
                    <Col key={item.Id} lg={24} xl={12}>
                      {/* <Link to={item.href}>
                            <Avatar size="small" src={item.logo} /> */}
                      {item.Id}
                      {/* </Link> */}
                    </Col>
                  ))}
                </Row>
              </Spin>
            </div>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={24} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={location.pathname.replace(`${match.path}/`, '')}
              onTabChange={this.onTabChange}
              loading={listLoading}
            >
              {children}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default CourseInfoDetail;
