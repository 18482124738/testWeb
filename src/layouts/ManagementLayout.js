import React, { PureComponent } from 'react';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { Card, Row } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './ManagementLayout.less';

@connect(({ layoutTab }) => ({
  layoutTab
}))
class ManagementLayout extends PureComponent {

  componentDidMount() {
    this.onTabChange = this.onTabChange.bind(this);
  }

  onTabChange = key => {
    const { dispatch } = this.props;

    dispatch({
      type: 'layoutTab/change',
      payload: key,
    });

    switch (key) {
      case 'org':
        router.push(`/user/management/teacher/org`);
        break;
      case 'index':
        router.push('/user/management/teacher/index')
        break;
      case 'finance':
        router.push(`/user/management/teacher/finance`);
        break;
      case 'personal':
        router.push(`/user/management/teacher/personal`);
        break;
      default:
        break;
    }
  };

  render() {
    const { listLoading, children, layoutTab: { currentKey } } = this.props;
    const operationTabList = [
      {
        key: 'org',
        tab: (
          <span>
            机构管理
          </span>
        ),
      },
      {
        key: 'index',
        tab: (
          <span>
            教务教学
          </span>
        ),
      },
      {
        key: 'finance',
        tab: (
          <span>
            财务管理
          </span>
        ),
      },
      {
        key: 'personal',
        tab: (
          <span>
            个人中心
          </span>
        ),
      },
    ];
    return (
      <GridContent>
        <Row gutter={24}>

          <Card
            className={styles.tabsCard}
            bordered={false}
            tabList={operationTabList}
            activeTabKey={currentKey}
            onTabChange={this.onTabChange}
            loading={listLoading}
          >
            {children}
          </Card>
        </Row>
      </GridContent>
    );
  }
}

export default ManagementLayout;

