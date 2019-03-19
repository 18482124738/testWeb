import React, { PureComponent } from 'react';
import { Menu, Icon } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const { SubMenu } = Menu;


@connect(({ courseCategory, loading }) => ({
  courseCategory,
  loading: loading.models.courseCategory,
}))
class CategroyMenu extends PureComponent {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseCategory/treeList',
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onKeyDown = e => {
    if (e.key === 'Enter') {
      const { onPressEnter } = this.props;
      const { value } = this.state;
      this.timeout = setTimeout(() => {
        onPressEnter(value); // Fix duplicate onPressEnter
      }, 0);
    }
  };


  render() {
    const { courseCategory: { tree } } = this.props;

    const secondSubMenu = (t) => (
      <SubMenu key={t.Id} title={<span>{t.Name}</span>}>
        {
          t.ChildNode.map((node) => (
            <Menu.Item key={node.Id}>{node.Name}</Menu.Item>
          ))
        }
      </SubMenu>
    )

    const menu = (
      <Menu>
        {
          tree.map((track) => {
            let obj = <Menu.Item key={track.Id}>{track.Name}</Menu.Item>;
            if (track.ChildNode.length > 0) {
              obj = secondSubMenu(track);
            }
            return obj
          })
        }
      </Menu>
    );
    const { className, placeholder, open, ...restProps } = this.props;
    delete restProps.defaultOpen; // for rc-select not affected

    return (

      <div className={styles.categroyMenu}>
        <HeaderDropdown overlay={menu}>
          <span>
            <Icon style={{fontSize:'24px',marginRight:'5px'}} type="profile" />
            <span className={styles.name}>分类</span>
          </span>
        </HeaderDropdown>
      </div>

    );
  }
}
export default CategroyMenu;