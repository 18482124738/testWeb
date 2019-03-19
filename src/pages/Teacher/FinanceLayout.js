import React, { Component } from 'react';
import { Row, Col, } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UserMenu from '@/layouts/UserMenu';

class FinanceLayout extends Component {
  menus = [
  {
    title: '订单管理',
    Icon: 'user',
    secondMenu: [{
      title: '订单结算',
      Icon: 'user',
      LinkTo: '/user/management/teacher/index/courseManagement',
    },
    {
      title: '订单明细',
      Icon: 'user',
      LinkTo: '',
    }],
  }]

  defaultOpenKeys=['全部订单']

  render() {
    const { children } = this.props;
    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={5}>
            <UserMenu menu={this.menus} defaultOpenKeys={this.defaultOpenKeys} />
          </Col>
          <Col lg={17} md={19}>
            {children}
          </Col>
        </Row>
      </GridContent>
    );
  }
}
    
export default FinanceLayout;
    
