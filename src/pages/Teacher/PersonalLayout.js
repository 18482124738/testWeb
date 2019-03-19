import React, { Component } from 'react';
import { Row, Col } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UserMenu from '@/layouts/UserMenu';

class PersonalLayout extends Component {
  // menus = [
  //   {
  //     title: '课程表',
  //     Icon: 'user',
  //     secondMenu: [],
  //     LinkTo: '/user/management/teacher/personal/courseList',
  //   },
  //   {
  //     title: '全部订单',
  //     Icon: 'user',
  //     secondMenu: [],
  //     LinkTo: '/user/management/teacher/personal/order',
  //   },
  //   {
  //     title: '我的余额',
  //     Icon: 'user',
  //     secondMenu: [],
  //     LinkTo: '/user/management/teacher/personal/balance',
  //   },
  //   {
  //     title: '个人信息',
  //     Icon: 'user',
  //     secondMenu: [],
  //     LinkTo: '/user/management/teacher/personal/teacherInfo',
  //   },
  // ];

  menus = [
    {
      title: '个人信息',
      Icon: 'user',
      secondMenu: [
        {
          title: '课程表',
          Icon: 'user',
          LinkTo: '/user/management/teacher/personal/courseList',
        },
        {
          title: '全部订单',
          Icon: 'user',
          LinkTo: '/user/management/teacher/personal/order',
        },
        {
          title: '我的余额',
          Icon: 'user',
          LinkTo: '/user/management/teacher/personal/balance',
        },
        {
          title: '个人信息',
          Icon: 'user',
          LinkTo: '/user/management/teacher/personal/teacherInfo',
        },
      ],
    },
  ];

  defaultOpenKeys = ['个人信息'];

  render() {
    const { children } = this.props;
    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={5} md={5}>
            <UserMenu menu={this.menus} defaultOpenKeys={this.defaultOpenKeys} />
          </Col>
          <Col lg={19} md={19}>
            {children}
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default PersonalLayout;
