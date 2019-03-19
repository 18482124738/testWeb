import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Icon, List, Divider, Form, Row, Modal } from 'antd';
import StandardTable from '@/components/StandardTable';
import Ellipsis from '@/components/Ellipsis';

import styles from './TermList.less';

@connect(({ courseInfo, courseTerm, loading }) => ({
  currentCourse: courseInfo.current,
  CourseTerm: courseTerm,
  courseTeacherLoading: loading.effects['courseTerm/fetch'],
}))
@Form.create()
class TermList extends PureComponent {
  state = {
    selectedRows: [],
  };

  columns = [
    {
      title: '课程',
      dataIndex: 'CourseInfo.Name',
      align: 'center',
    },
    {
      title: '学期名称',
      dataIndex: 'Name',
      align: 'center',
    },

    {
      title: '购买人数',
      dataIndex: 'BuyersNum',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <span>
          {/* <a onClick={() => this.management(record)}>管理</a> */}
          <a onClick={() => this.showCourseTerm(record)}>管理</a>
          <Divider type="vertical" />
          <a onClick={() => this.updateCourse(record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.deleteData(record)}>删除</a>
        </span>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch, currentCourse } = this.props;
    dispatch({
      type: 'courseTerm/fetch',
      payload: {
        courseInfoId: currentCourse.Id,
      },
    });
  }

  /* 管理 */
  management = record => {
    // router.push({
    //   pathname: '/user/management/teacher/index/termDetail',
    //   query: {
    //     CourseTermId: record.Id,
    //   },
    // });
  };

  showCourseTerm = courseTerm => {
    router.push({ pathname: '/user/management/teacher/index/termDetail', state: courseTerm });
  };

  // 修改学期
  updateCourse = record => {
    router.push({ pathname: '/user/management/teacher/index/TermRedactCtn', state: { ...record, updateStatus: 'update' } });
  };

  // 删除学期
  deleteData = data => {
    const that = this;
    Modal.confirm({
      title: '删除提示',
      content: `您确定要删除选中这条学期信息吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const { dispatch } = that.props;
        const ids = [];
        ids.push(data.Id);
        dispatch({
          type: 'courseTerm/remove',
          payload: ids
        });
      },
      onCancel() { },
    });
  };

  render() {
    const {
      CourseTerm: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <div className={styles.cardList}>
        {/* <div className={styles.tableListOperator}> */}
        {/* <Checkbox onChange={(e) => { console.log(`checked = ${e.target.checked}`); }}>我的授课</Checkbox> */}
        {/* <Table columns={columns} dataSource={data} onChange={this.onChange} /> */}
        <StandardTable
          selectedRows={selectedRows}
          loading={loading}
          data={data}
          columns={this.columns}
          onSelectRow={this.handleSelectRows}
          onChange={this.handleStandardTableChange}
        />
        {/* </div> */}
        {/* <List
          rowKey="id"
          loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={['', ...Rows]}
          renderItem={item =>
            item ? (
              <List.Item key={item.Id}>
                <Card hoverable className={styles.card} actions={[<a onClick={this.management}>管理</a>,<a>修改</a>, <a>删除</a>]}>
                  <Card.Meta
                    avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                    title={<a>{item.Name}</a>}
                    description={
                      <Ellipsis className={styles.item} lines={3}>
                        {item.description}
                      </Ellipsis>
                    }
                  />
                </Card>
              </List.Item>
            ) : (
              <List.Item>
                <Button type="dashed" className={styles.newButton}>
                  <Icon type="plus" /> 新增学期
                </Button>
              </List.Item>
              )
          }
        /> */}
      </div>
    );
  }
}

export default TermList;
