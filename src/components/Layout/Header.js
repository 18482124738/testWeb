import React, { Component } from 'react';
import { Input, Select, Menu, Modal, Button, Divider } from 'antd';

const Search = Input.Search;
const InputGroup = Input.Group;

const Option = Select.Option;

const SubMenu = Menu.SubMenu;

var storage = window.localStorage;

class Header extends Component {
    constructor(props) {
        super(props);
    };

    state = {
        logoImage: '',
        menuList: [{
            title: '开课/合作',
            icon: '',
            subMenu: [
                {
                    title: '个人开课'
                },
                {
                    title: '机构开课'
                },
                {
                    title: '分销课程'
                },
                {
                    title: '企业合作'
                }
            ],
        },
        {
            title: '下载',
            icon: '',
            subMenu: [
                {
                    title: 'Win客户端'
                },
                {
                    title: 'Mac客户端'
                },
                {
                    title: 'App客户端'
                }
            ],
        },
        {
            title: '私信',
            icon: '',
            subMenu: [],
        }],
        inputGroup: ['课程', '机构'],
        visible: false,
        accoun: '',
        password: '',
        userData: {
            title: '登录',
            icon: '',
            subMenu: [],
        },
        userIcon: false,
    }

    componentDidMount() {
        // var Token = storage.getItem("verification");
        // var self = this;
        // if(Token === "1"){
        //     self.setState({
        //         userData: {
        //             title: storage.getItem("user"),
        //             icon: storage.getItem("icon"),
        //             subMenu: [{
        //                 title: '课程表'
        //             },{
        //                 title: '全部课程'
        //             },{
        //                 title: '收藏'
        //             },{
        //                 title: '订单'
        //             },{
        //                 title: '退出登录'
        //             }],
        //         },
        //         userIcon: true,
        //     })
        // }else{
        //     self.setState({
        //         userData: {
        //             title: '登录',
        //             icon: '',
        //             subMenu: [],
        //         }
        //     })
        // }
    }

    menuClick = () => {
        var self = this;
        self.setState({ visible: true })
    }

    handleCancel = () => {
        var self = this;
        self.setState({ visible: false })
    }

    accountInput = (e) => {
        var self = this;
        self.setState({ accoun: e.target.value })
    }

    passwordInput = (e) => {
        var self = this;
        self.setState({ password: e.target.value })
    }

    onKeyDownLogin = (e) => {
        var self = this;
        if (e.keyCode == 13) {
            // var user = "Cary超";
            // var icon = require("../../styles/images/head.JPG");
            // storage.setItem("user", user);
            // storage.setItem("icon", icon);
            // storage.setItem("verification", 1);
            // self.setState({
            //     userData: {
            //         title: user,
            //         icon: icon,
            //         subMenu: [{
            //             title: '课程表'
            //         },{
            //             title: '全部课程'
            //         },{
            //             title: '收藏'
            //         },{
            //             title: '订单'
            //         },{
            //             title: '退出登录'
            //         }],
            //     },
            //     visible: false,
            //     userIcon: true,
            // })
        }
    }

    render() {
        return (
            <header className="header-container">
                <div className="header-logo" style={{ background: '#ccc' }}></div>
                <InputGroup compact style={{ float: 'left', width: '50%', margin: '14px 30px' }}>
                    <Select defaultValue={this.state.inputGroup[0]}>
                        {
                            this.state.inputGroup.map((track, index) => {
                                return <Option value={index} key={index}>{track}</Option>
                            })
                        }
                    </Select>
                    <Search
                        placeholder="input search text"
                        onSearch={value => console.log(value)}
                        enterButton
                        style={{ width: '80%' }}
                    />
                </InputGroup>
                <Menu
                    selectedKeys={['mail']}
                    mode="horizontal"
                    style={{ margin: '7px 0' }}
                >
                    {
                        this.state.menuList.map((track, index) => {
                            return <SubMenu title={<span className="submenu-title-wrapper">{track.title}</span>} key={index}>
                                {
                                    track.subMenu.map((subTrack, subIndex) => {
                                        return <Menu.Item key={'setting:' + subIndex}>{subTrack.title}</Menu.Item>
                                    })
                                }
                            </SubMenu>
                        })
                    }
                    <SubMenu title={<span className="submenu-title-wrapper" onClick={this.menuClick}>
                        <img src={this.state.userData.icon} className="login-headPortrait" style={{ display: this.state.userIcon ? 'block' : 'none' }} />{this.state.userData.title}</span>}>
                        {
                            this.state.userData.subMenu.map((subTrack, subIndex) => {
                                return <Menu.Item key={'setting:' + subIndex}>{subTrack.title}</Menu.Item>
                            })
                        }
                    </SubMenu>
                </Menu>
                <Modal
                    visible={this.state.visible}
                    // title=""
                    centered
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <h2 className="login-title">账号密码登录</h2>
                    <Input placeholder="账号" className="login-input" onChange={this.accountInput} />
                    <Input placeholder="密码" className="login-input" onChange={this.passwordInput} onKeyDown={this.onKeyDownLogin} />
                    <Button type="primary" style={{ width: '70%', margin: '0 auto 20px', display: 'block' }}>Primary</Button>
                    <div className="login-other">
                        <a href="javascript:;">忘了密码？</a>
                        <Divider type="vertical" />
                        <a href="javascript:;">注册账号</a>
                    </div>
                </Modal>
            </header>
        );
    }

}

export default Header;
