import React, { Component } from 'react';
import { Row, Col, } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UserMenu from '@/layouts/UserMenu';

class OrgLayout extends Component {
  menus = [
    {
      title: '机构信息',
      Icon: 'user',
      secondMenu: [{
        title: '机构资料',
        Icon: 'user',
        LinkTo: '/user/management/teacher/index/courseManagement',
      },
      {
        title: '习题管理',
        Icon: 'user',
        LinkTo: '',
      }],
    },
    {
      title: '机构主页',
      Icon: 'user',
      secondMenu: [{
        title: '主页设置',
        Icon: 'user',
        LinkTo: '/user/management/teacher/index/courseManagement',
      },
      {
        title: '课程分类',
        Icon: 'user',
        LinkTo: '',
      },
      {
        title: '机构介绍',
        Icon: 'user',
        LinkTo: '',
      }],
    },
    {
      title: '人员管理',
      Icon: 'user',
      secondMenu: [{
        title: '成员和群',
        Icon: 'user',
        LinkTo: '/user/management/teacher/org/personnelManagement',
      },
      {
        title: '身份权限设置',
        Icon: 'user',
        LinkTo: '',
      }],
    }]

    defaultOpenKeys=['机构信息','机构主页','人员管理']

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

export default OrgLayout;

