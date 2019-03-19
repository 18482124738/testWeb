import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Tabs, Row, Modal } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import CourseList from './CourseList';
import HobyModal from './HobyModal';
import styles from './InterestCategory.less';
const { TabPane } = Tabs;

@connect(({ loading, interestCategory, courseInfo }) => ({
  interestCategory,
  interestCategoryLoading: loading.effects['interestCategory/fetch'],
}))
class InterestCategory extends PureComponent {
  state = {
    ModalText: 'Content of the modal',
    visible: false,
    backgroundColorC: 'white',
    backgroundColorC1: '#75aaef',
    confirmLoading: false,
    list: [],
    changeC: false
  }

  componentDidMount() {
    const { dispatch } = this.props;
    let that = this;
    dispatch({
      type: 'interestCategory/fetch',
    });
  }

  show_CloseModal = () => {
    this.setState({
      visible: !this.state.visible,
    });
  }

  changeInterest = (a) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseInfo/fetch',
      payload: {
        "CategoryId": a
      },
      callback: (s) => {
        console.log(222)
        let list = []
        list.push({ CourseInfoDtoList: s.Rows, Title: s.Rows[0] ? s.Rows[0].CourseCategory.Name : '暂无信息' })
        dispatch({
          type: 'courseInfo/saveInterest',
          payload: list
        })
      }
    });
  }

  render() {
    const { interestCategory: { data } } = this.props;
    const operations = <Button style={{ marginTop: 10 }} onClick={this.show_CloseModal}>修改兴趣</Button>;
    return (
      <GridContent>
        <Row gutter={24} className={styles.tabs}>
          {operations}
          <Tabs defaultActiveKey="1" size='large' onChange={this.changeInterest}>
            {
              data.Rows.map((item, k) => {
                const obj = <TabPane tab={item.Category.Name} key={item.CourseCategoryID} />
                return obj
              })
            }
          </Tabs>
          <CourseList interestList={data} />
        </Row>
        {/* 兴趣弹出框 */}
        <HobyModal checkList={data.Rows} visible={this.state.visible} show_CloseModal={this.show_CloseModal}></HobyModal>
      </GridContent>
    );
  }
}

export default InterestCategory;
