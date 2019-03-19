import React, {
  Component
} from 'react';
import {
  Row,
  Col,
} from 'antd';
import {
  connect
} from 'dva'
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UserMenu from '@/layouts/UserMenu';

@connect()
class TeachLayout extends Component {
  menus = [{
    title: '教务管理',
    Icon: 'user',
    secondMenu: [{
      title: '课程管理',
      Icon: 'user',
      LinkTo: '/user/management/teacher/index/courseManagement',
    },
    {
      title: '学期管理',
      Icon: 'user',
      LinkTo: '/user/management/teacher/index/termManagement',
    },
    {
      title: '习题管理',
      Icon: 'user',
      LinkTo: '/user/management/teacher/index/courseQusetionList',
    },
    {
      title: '试卷管理',
      Icon: 'user',
      LinkTo: '/user/management/teacher/index/examinationManagement',
    },
    {
      title: '资料管理',
      Icon: 'user',
      LinkTo: '/user/management/teacher/index/recource',
    },
    {
      title: '视频管理',
      Icon: 'user',
      LinkTo: '/user/management/teacher/index/video',
    }
    ],
  }, {
    title: '教学管理',
    Icon: 'user',
    secondMenu: [{
      title: '课程安排',
      Icon: 'user',
      LinkTo: '/user/management/teacher/index/courseManagement',
    },
    {
      title: '作业批改',
      Icon: 'user',
      LinkTo: '/',
    },
    {
      title: '评价管理',
      Icon: 'user',
      LinkTo: '/',
    },
    {
      title: '纪律管理',
      Icon: 'user',
      LinkTo: '/',
    }
    ],
  }]

  defaultOpenKeys = ['教务管理', '教学管理']

  componentDidMount() {
    const {
      dispatch
    } = this.props;
    dispatch({
      type: 'courseCategory/treeList',
    });
  }



  render() {
    const {
      children
    } = this.props;
    return (
      <GridContent>
        <Row gutter={24}>
          <Col
            lg={5}
            md={5}
          >
            <UserMenu
              menu={this.menus}
              defaultOpenKeys={this.defaultOpenKeys}
            />
          </Col>
          <Col
            lg={19}
            md={19}
          >
            {
              children
            }
          </Col>
        </Row>
      </GridContent>);
  }
}

export default TeachLayout;
