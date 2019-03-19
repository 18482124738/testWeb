import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Tabs, Row, Modal } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import CourseList from './CourseList';
import styles from './HobyModal.less';
import { colorList } from './ColorList';

@connect(({ courseCategory, interestCategory }) => ({
  courseCategory,
  interestCategory,
}))
class HobyModal extends PureComponent {
  state = {
    ModalText: 'Content of the modal',
    visible: this.props.visible,
    confirmLoading: false,
    list: [],
    checkList: [],
    changeC: false,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseCategory/treeList',
      callback: list => {
        this.showHobyColor(list);
      },
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.checkList == this.state.checkList) return;
    this.setState(
      {
        checkList: nextProps.checkList,
      },
      () => {
        this.showHobyColor(this.state.list, nextProps.checkList);
      }
    );
  }
  //初始化兴趣颜色
  showHobyColor = (list, checkList) => {
    let that = this;
    let colorlist = colorList();
    let checkList1 = [];
    list.forEach((element, i) => {
      element.colorC = colorlist[i].colorC;
      element.ChildNode.forEach(s => {
        s.backgroundColorC = colorlist[i].backgroundColorC;
        s.colorC = colorlist[i].colorC;
        if (checkList) {
          checkList1 = [];
          checkList.forEach(z => {
            // 如果对应就check
            checkList1.push(z.CourseCategoryID);
            if (z.Category.PId == element.Id && z.CourseCategoryID == s.Id) {
              s.backgroundColorC = colorlist[i].colorC;
              s.colorC = colorlist[i].backgroundColorC;
            }
          });
        }
      });
    });
    that.setState({
      list: list,
      checkList: checkList1,
    });
  };
  //兴趣选中过后改变颜色
  changeHobyColor = (v, k, bgColor, color, Id) => {
    let checkList = this.state.checkList;
    let checkListLen = this.state.checkList.length;
    if (checkListLen < 6 || bgColor != 'white') {
      let list = this.state.list;
      list[v].ChildNode[k].backgroundColorC = color;
      list[v].ChildNode[k].colorC = bgColor;
      if (bgColor == 'white') {
        checkListLen += 1;
        checkList.push(Id);
      } else {
        checkListLen -= 1;
        checkList.splice(checkList.indexOf(Id), 1);
      }
      this.setState({
        list: list,
        changeC: !this.state.changeC,
        checkList: checkList,
      });
    } else {
      this.warning();
    }
  };

  //保存
  handleOk = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'interestCategory/saveList',
      payload: this.state.checkList,
    });
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.props.show_CloseModal();
      this.setState({
        confirmLoading: false,
      });
    }, 2000);
  };
  handleCancel = () => {
    this.props.show_CloseModal();
  };

  // 超过六个兴趣时弹出
  warning = () => {
    Modal.warning({
      title: '最多可以选择6个兴趣哦！',
    });
  };

  render() {
    const { visible, confirmLoading, ModalText } = this.state;
    return (
      <Modal
        // title={ModalText}
        visible={this.props.visible}
        footer={null}
        centered={true}
        forceRender={this.state.changeC}
        closable={false}
        maskClosable={false}
        style={{ textAlign: 'center' }}
        width={1200}
        zIndex={1000}
        onCancel={this.handleCancel}
      >
        <div className={styles.hobyModal}>
          <div className={styles.hobyModalHead}>
            设置学习兴趣 <span className={styles.hobyModalHeadSpan}> 我们帮你挑选内容</span>
          </div>
          <div className={styles.hobyModalBody}>
            {this.state.list &&
              this.state.list.map((v, k) => {
                return (
                  <div key={k} style={{ color: v.colorC }} className={styles.hobyModalBodyItem}>
                    <div style={{ fontSize: 22 }}>{v.Name}</div>
                    <div className={styles.bodyItemChildBox}>
                      {v.ChildNode.map((s, i) => {
                        return (
                          <div
                            key={i}
                            style={{ backgroundColor: s.backgroundColorC, color: s.colorC }}
                            onClick={() => {
                              this.changeHobyColor(k, i, s.backgroundColorC, s.colorC, s.Id);
                            }}
                            className={styles.bodyItemChild}
                          >
                            {s.Name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
          <Button
            type="primary"
            loading={confirmLoading}
            style={{ marginRight: 50 }}
            onClick={this.handleOk}
          >
            保存
          </Button>
          <Button onClick={this.handleCancel}>下次再选</Button>
        </div>
      </Modal>
    );
  }
}

export default HobyModal;
