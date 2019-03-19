import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Tag, Menu, Icon, Avatar } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import HeaderDropdown from '../HeaderDropdown';
import SelectLang from '../SelectLang';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  changeReadState = clickedItem => {
    const { id } = clickedItem;
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
  };

  render() {
    const {
      currentUser,
      onMenuClick,
      theme,
    } = this.props;
    const courseMenu = (
      <Menu className={styles.courseMenu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="studentCenter">
          <FormattedMessage id="menu.course.person" defaultMessage="个人开课" />
        </Menu.Item>
        <Menu.Item key="teacherCenter">
          <FormattedMessage id="menu.course.org" defaultMessage="机构开课" />
        </Menu.Item>
        <Menu.Item key="userinfo">
          <FormattedMessage id="menu.course.settings" defaultMessage="分销课程" />
        </Menu.Item>
        <Menu.Item key="triggerError">
          <FormattedMessage id="menu.course.trigger" defaultMessage="企业合作" />
        </Menu.Item>
      </Menu>
    );

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="studentCenter">
          <Icon type="user" />
          <FormattedMessage id="menu.user.student.center" defaultMessage="课程表" />
        </Menu.Item>
        <Menu.Item key="teacherCenter">
          <Icon type="user" />
          <FormattedMessage id="menu.user.teacher.center" defaultMessage="全部订单" />
        </Menu.Item>
        <Menu.Item key="userinfo">
          <Icon type="setting" />
          <FormattedMessage id="menu.user.settings" defaultMessage="个人信息" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.user.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        <HeaderDropdown overlay={courseMenu}>
          <span className={`${styles.action} ${styles.account}`}>
            <span className={styles.name}>开课合作</span>
          </span>
        </HeaderDropdown>

        <HeaderDropdown overlay={menu}>
          <span className={`${styles.action} ${styles.account}`}>
            <span className={styles.name}>私信</span>
          </span>
        </HeaderDropdown>

        <HeaderDropdown overlay={menu}>
          <span className={`${styles.action} ${styles.account}`}>
            <Avatar
              size="small"
              className={styles.avatar}
              src={currentUser.avatar}
              alt="avatar"
            />
            <span className={styles.name}>{currentUser.Name}</span>
          </span>
        </HeaderDropdown>

        <Link to='/account/login'>登录</Link>

        <SelectLang className={styles.action} />
      </div>
    );
  }
}