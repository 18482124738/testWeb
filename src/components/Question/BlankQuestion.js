import React, { PureComponent } from 'react';
import { Button, Menu, Select, Icon, Divider, Dropdown, Form, Row, Col, Input, message } from 'antd';
import { connect } from 'dva';


// 课程管理
@connect(({ courseTerm, courseQuestion, loading }) => ({
  currentTerm: courseTerm.current,
  courseQuestion,
  courseQuestionLoading: loading.effects['courseQuestion/fetch'],
}))
@Form.create()
class BlankQuestion extends PureComponent {


  componentDidMount() {

  }



  render() {

    return (
      <div>
        123
      </div>
    );
  }
}

export default BlankQuestion;

