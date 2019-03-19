import React, { Component } from 'react';
import { Divider, Steps, Button, Input, Icon } from 'antd';

const Step = Steps.Step;

class ResetPassword extends Component {
    state = {
        steps: [{
            title: '验证',
            index: 0,
        }, {
            title: '设置新密码',
            index: 1,
        }, {
            title: '完成',
            index: 2,
        }],
        verificationAlert: '发送验证短信',
        verificationType: false,
        current: 0,
    }
    
    sendShort = () => {
        var self = this;
        var time = 60;
        self.setState({
            verificationType: true,
        })
        var interval = setInterval(function(){
            time--;
            self.setState({
                verificationAlert: time+' S',
            })
            if(time === -1){
                self.setState({
                    verificationAlert: '发送验证短信',
                    verificationType: false,
                })
                clearInterval(interval);
            }
        },1000)
    }

    nextCurrent = () => {
        var self = this;
        var current = this.state.current;
        self.setState({current: current+1})
    }

    render() {
        const { current, verificationAlert } = this.state;
        return (
            <div>
                <header className="header-container header-background">
                    <div className="header-logo" style={{background: '#fff'}}></div>
                    <Divider type="vertical" style={{height: '20px',margin: '20px'}}/>
                    <span className="header-hint">重置密码</span>
                </header>
                <main className="main-container">
                    <Steps current={current}>
                        {this.state.steps.map(item => <Step key={item.index} title={item.title}/>)}
                    </Steps>
                    <div className="steps-content" style={{marginTop: 120}}>
                        <div style={{display: current == 0 ? 'block' : 'none'}}>
                            <div className="reset-input">
                                账 &nbsp;&nbsp;&nbsp;号：<Input placeholder="账号" style={{width: '86%', height: 40}}/>
                            </div>
                            <div className="reset-input">
                                验证码：<Input placeholder="验证码" style={{width: '62%',height: 40}}/>
                                <Button type="primary" style={{width: '24%',display: 'inline-block',height: 40}} onClick={this.sendShort} disabled={this.state.verificationType}>{verificationAlert}</Button>
                            </div>
                            <Button type="primary" className="main-button" onClick={this.nextCurrent}>确定</Button>
                        </div>
                        <div style={{display: current == 1 ? 'block' : 'none'}}>
                            <div className="reset-input">
                                新 &nbsp;密 &nbsp;码：<Input placeholder="新密码" style={{width: '85%', height: 40}}/>
                            </div>
                            <div className="reset-input">
                                确认密码：<Input placeholder="确认密码" style={{width: '86%', height: 40}}/>
                            </div>
                            <Button type="primary" className="main-button" onClick={this.nextCurrent}>确定</Button>
                        </div>
                        <div style={{display: current == 2 ? 'block' : 'none'}}>
                            <div className="main-hint"><Icon type="check-circle" className="main-check"/>密码修改完成</div>
                            <Button type="primary" className="main-button" onClick={this.nextCurrent}>返回首页</Button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

export default ResetPassword;

