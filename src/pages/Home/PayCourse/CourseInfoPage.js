import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Breadcrumb, Divider, Spin, Alert, Button, Select } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './CourseInfoPage.less';
import showTitleImg from '@/assets/cImg.png';
import showIntroImg from '@/assets/usdImg.jpg';
import Comment from '@/components/Home/Comment'
import CourseDetailPanel from '@/components/Home/CourseDetailPanel'
import CourseCatalog from '@/components/Home/CourseCatalog'

const { Option } = Select;


@connect(({ loading, courseTeacher, courseTerm }) => ({
  courseTermLoading: loading.effects['courseTerm/fetch'],
  courseTermList: courseTerm.data,
  currentCourseLoading: loading.effects['courseInfo/fetchSingle'],
  courseTeacher: courseTeacher.data,
  courseTeacherLoading: loading.effects['courseTeacher/fetch'],

}))
class CourseInfoPage extends Component {

  constructor(props) {
    super(props)
    const { location } = props;
    this.state = {
      tabKey: 'catalog',
      courseInfo: location.state
    };
  }

  componentDidMount() {
    const { dispatch, location } = this.props;


    // console.log(history.location.query.item.Id)
    // if (location.query.item) {
    //   dispatch({
    //     type: 'courseInfo/fetchSingle',
    //     payload: { Id: location.query.item.Id }
    //   });
    // }
    dispatch({
      type: 'courseTerm/fetch',
      payload: { courseInfoId: location.state.item.Id }
    });
  }

  onTabChange = key => {
    this.setState({ tabKey: key });
  };

  selectChange = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseCatalog/fetch',
      payload: { courseTermId: value }
    });
  }

  render() {
    const {
      listLoading,
      courseTeacher: { Rows },
      courseTeacherLoading,
      courseTermList
    } = this.props;
    const { tabKey, courseTerm, courseInfo } = this.state

    const operationTabList = [

      {
        key: 'detail',
        tab: (
          <span>
            课程概述 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      }, {
        key: 'catalog',
        tab: (
          <span>
            课程目录 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
      {
        key: 'comment',
        tab: (
          <span>
            学员评论 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      }
    ];

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>最近在学 4282人</p>
        </div>
        <div className={styles.statItem}>
          <p>累计报名<span>1万人</span>
          </p>
        </div>
        <div className={styles.statItem}>
          <p>好评度 96% </p>
        </div>
        <div className={styles.statItem}>
          <p>分享 收藏</p>
        </div>
      </div>
    );

    const teacherMessage = (
      <div className={styles.teacherMessage}>
        <div className={styles.statItem}>
          <p>好评度</p>
          <p>90%</p>
        </div>
        <div className={styles.statItem}>
          <p>课程数</p>
          <p>9</p>
        </div>
        <div className={styles.statItem}>
          <p>学习人次</p>
          <p>788</p>
        </div>
      </div>
    )

    const tabContent = () => {

      switch (tabKey) {
        case "detail":
          return <CourseDetailPanel courseTerm={courseTerm} />
        case "comment":
          return <Comment courseTerm={courseInfo} />
        default:
          return <CourseCatalog courseTerm={courseTerm} />
      }

    }

    return (
      <div>
        <section>
          <GridContent className={styles.userCenter}>
            <Row gutter={24}>
              <Alert
                message="与老师或机构私下交易造成的任何损失与纠纷，腾讯课堂不承担任何责任，若曾经有老师向你提出私下交易，请立即投诉。了解更多"
                type="warning"
                closable
              />
              <Breadcrumb className={styles.step}>
                <Breadcrumb.Item>全部课程</Breadcrumb.Item>
                <Breadcrumb.Item><a href="">兴趣生活</a></Breadcrumb.Item>
                <Breadcrumb.Item><a href="">文艺修养</a></Breadcrumb.Item>
                <Breadcrumb.Item><a href="">棋牌</a></Breadcrumb.Item>
                <Breadcrumb.Item><a href="">象棋基础杀法（共53课）</a></Breadcrumb.Item>
              </Breadcrumb>
              <Select className={styles.selectStyle} onChange={this.selectChange}>
                {
                  courseTermList.Rows.map(item => (<Option value={item.Id}>{item.Name}</Option>))
                }

              </Select>
            </Row>
            <Row>
              <Col lg={12} md={12}>
                <div style={{ width: '100%', height: 300, border: '1px solid #ccc' }}>
                  <img alt="example" src={showTitleImg} className={styles.titleImg} />
                </div>
              </Col>
              <Col lg={11} md={11} style={{ marginLeft: 20 }}>
                <h1 className="page-tt"><span className="title-main">余世维：《有效沟通》</span></h1>
                {extraContent}
                <div className="class-content-list ">
                  <div className={styles.courseTitle} data-idx="0" data-termid="100273042">
                    <h3 className="hidden-clip">有效沟通</h3>
                    <p className="class-date">支持随到随学，22年08月过期</p>
                  </div>
                </div>
                <div className={styles.useModel_Button}>
                  <Button type="primary">立即购买</Button>
                  <Button>咨询</Button>
                </div>
              </Col>
            </Row>
            <Row>
              <ul className={styles.pay_policy}>
                <li className={styles.pay_policy_title}>服务承诺 :</li>
                <li>
                  <a title="带有此标识的课程，平台内的付款由腾讯课堂承诺保障">
                    <i className={styles.icon_policy} />支付保障
                  </a>
                </li>
                <li>
                  <a title="带有此标识的课程，平台内付费用户在课程开始前可无条件退款">
                    <i className={styles.refund_icon1} />开课前随时退
                  </a>
                </li>
              </ul>
            </Row>
          </GridContent>
        </section>
        <GridContent className={styles.userCenter}>
          <Row gutter={24}>
            <Col lg={17} md={24}>
              <Card
                className={styles.tabsCard}
                bordered={false}
                tabList={operationTabList}
                activeTabKey={tabKey}
                onTabChange={this.onTabChange}
                loading={listLoading}
              >
                {tabContent()}
              </Card>
            </Col>
            <Col lg={7} md={24}>
              <Card bordered={false} style={{ marginBottom: 24 }}>

                <div>
                  <div className={styles.avatarHolder}>
                    <div style={{ width: 104, height: 104, border: '1px solid #ccc', float: 'left' }}>
                      <img alt="example" src={showIntroImg} className={styles.titleImg} />
                    </div>
                    <div className={styles.littleTitle}>
                      <div className={styles.name}>{courseInfo.Name}</div>
                      <div>{courseInfo.Introduction}</div>
                    </div>
                  </div>
                  <div className={styles.detail}>
                    {teacherMessage}
                    <p>
                      棋疯子，自幼酷爱象棋，专注于象棋残局，江湖残局研究。2016年录制完成系列象棋教程《棋经十三篇》。
                    </p>
                  </div>
                  <Divider dashed />
                  <div className={styles.tags}>
                    <div className={styles.tagsTitle}>标签</div>
                  </div>
                  <Divider style={{ marginTop: 16 }} dashed />
                  <div className={styles.team}>
                    <div className={styles.teamTitle}>教师</div>
                    <Spin spinning={courseTeacherLoading}>
                      <Row gutter={36}>
                        {Rows.map(item => (
                          <Col lg={24} xl={12}>
                            {/* <Link to={item.href}>
                            <Avatar size="small" src={item.logo} /> */}
                            {item.Id}
                            {/* </Link> */}
                          </Col>
                        ))}
                      </Row>
                    </Spin>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </GridContent>
      </div>
    );
  }
}

export default CourseInfoPage;
