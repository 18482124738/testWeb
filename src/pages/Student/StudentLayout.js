import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UserMenu from '@/layouts/UserMenu';
import styles from './StudentLayout.less';

class StudentLayout extends PureComponent {
  // menu = [
  //   {
  //     title: '课程表',
  //     Icon: 'user',
  //     secondMenu: [],
  //     LinkTo: '/user/student/layout/courseList',
  //   },
  //   {
  //     title: '全部订单',
  //     Icon: 'user',
  //     secondMenu: [],
  //     LinkTo: '/user/student/layout/order',
  //   },
  //   {
  //     title: '我的余额',
  //     Icon: 'user',
  //     secondMenu: [],
  //     LinkTo: '/user/student/layout/balance',
  //   },
  //   {
  //     title: '个人信息',
  //     Icon: 'user',
  //     secondMenu: [],
  //     LinkTo: '/user/student/layout/userinfo',
  //   },
  // ];

  menu = [
    {
      title: '个人信息',
      Icon: 'user',
      secondMenu: [
        {
          title: '课程表',
          Icon: 'user',
          LinkTo: '/user/student/layout/courseList',
        },
        {
          title: '全部订单',
          Icon: 'user',
          LinkTo: '/user/student/layout/order',
        },
        {
          title: '我的余额',
          Icon: 'user',
          LinkTo: '/user/student/layout/balance',
        },
        {
          title: '个人信息',
          Icon: 'user',
          LinkTo: '/user/student/layout/userinfo',
        },
      ],
    },
  ];

  render() {
    const { children } = this.props;
    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={5} md={5}>
            <UserMenu menu={this.menu} />
          </Col>
          <Col lg={19} md={19}>
            {children}
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default StudentLayout;
