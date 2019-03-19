import React, { Component } from 'react';
import { Menu } from 'antd';
import Link from 'umi/link';

const { SubMenu } = Menu;

class UserMenu extends Component {
  handleClick = () => {
    console.log(111);
  };

  render() {
    const { menu, defaultOpenKeys } = this.props;
    const secondSubMenu = t => (
      <SubMenu key={t.title} title={<span>{t.title}</span>}>
        {t.secondMenu.map(secondTrack => (
          <Menu.Item key={secondTrack.title}>
            <Link to={secondTrack.LinkTo} />
            {secondTrack.title}
          </Menu.Item>
        ))}
      </SubMenu>
    );
    return (
      <Menu
        onClick={this.handleClick}
        defaultOpenKeys={defaultOpenKeys}
        defaultSelectedKeys={['0']}
        mode="inline"
      >
        {menu.map(track => {
          let obj = <Menu.Item key={track.title}>{track.title}</Menu.Item>;
          if (track.secondMenu.length > 0) {
            obj = secondSubMenu(track);
          }
          return obj;
        })}
      </Menu>
    );
  }
}

export default UserMenu;
