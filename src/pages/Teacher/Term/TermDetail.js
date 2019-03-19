import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import Link from 'umi/link';
import { Card, Row, Col } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './TermDetail.less';
import QuestionList from '../Question/QuestionList'
import CatalogList from '@/components/Teacher/CatalogList'
import ClassList from '@/components/Teacher/ClassList'

@connect(({ loading, courseTeacher }) => ({
  courseTeacher: courseTeacher.data,
  courseTeacherLoading: loading.effects['courseTeacher/fetch'],
}))
class CourseTermDetail extends PureComponent {
  state = {
    tabKey: 'catalog'
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    // dispatch({
    //   type: 'courseTerm/saveCurrent',
    //   payload: location.state,
    // });
    dispatch({
      type: 'courseTeacher/fetch',
      payload: { courseInfoId: location.state.CourseInfoId, CourseTermId: location.state.Id },
    });
  }



  onTabChange = (key) => {
    this.setState({tabKey: key });
  }


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
    const { location: { state: courseTerm } } = this.props;
    const { tabKey } = this.state

    const operationTabList = [
      {
        key: 'catalog',
        tab: (
          <span>
            章节 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
      {
        key: 'question',
        tab: (
          <span>
            习题 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
      {
        key: 'class',
        tab: (
          <span>
            班级 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
    ];
    const tabContent = () => {

      switch (tabKey) {
        case "class":
          return <ClassList courseTerm={courseTerm} />
        case "question":
          return <QuestionList courseTerm={courseTerm} />
        default:
          return <CatalogList courseTerm={courseTerm} />
      }

    }
    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={7} md={7}>
            <div className={styles.avatarHolder}>
              {/* <img alt="" src="currentUser.avatar" /> */}
              <div className={styles.name}>{courseTerm.Name}</div>
              <div>{courseTerm.CourseInfo.Name}</div>
            </div>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={24} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              activeTabKey={tabKey}
              tabList={operationTabList}
              onTabChange={this.onTabChange}
            >
              {tabContent()}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default CourseTermDetail;
