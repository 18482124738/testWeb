import React, { PureComponent } from 'react';
import { Button, Input, Form, Row, Col, Upload, Icon, List } from 'antd';
import { connect } from 'dva';
// import StandardTable from '@/components/StandardTable';
// import router from 'umi/router';
import teachStyles from '../TeachLayout.less';
import Styles from './CourseManagement.less';
import router from 'umi/router';


// const { TabPane } = Tabs;
const { Search } = Input;
const FormItem = Form.Item;

// 课程管理
@connect(({ courseQuestion, loading }) => ({
  courseQuestion,
  loading: loading.models.courseInfo,
}))
@Form.create()
class ExerciseManagement extends PureComponent {
  state = {
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseQuestion/fetch',
    });
  }

  beforeUpload = (file, index) => {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('Type', index + 1);
    const { dispatch } = this.props;
    //   const p = new Promise(function (resolved){
    //   //在这里进行处理。也许可以使用ajax
    //   setTimeout(function () {
    //     var result = 10 * 5;
    //     if (result === 50) {
    //       resolve(50);
    //     } else {
    //       reject(new Error('Bad Math'));
    //     }
    //   }, 1000);
    // });
    // p.then(function(result) {
    //   console.log('Resolve with a values of %d', result);
    // });
    dispatch({
      type: 'courseQuestion/upload',
      payload: formData
      })
  }

  listItemClick=(index)=>{
    router.push({
      pathname: "/user/management/teacher/index/CourseQusetionList",
      query: {
      index,
      },
      });
  }

  render() {
    const {
      courseQuestion: { data },
    } = this.props;
    console.log(data.Rows.length)
    const data1 = [{
      text: "选择题",
      num: data.Rows.filter((item) => item.Type === 1).length
    },
    {
      text: "多选题",
      num: data.Rows.filter((item) => item.Type === 2).length
    },
    {
      text: "判断题",
      num: data.Rows.filter((item) => item.Type === 3).length
    },
    {
      text: "简答题",
      num: data.Rows.filter((item) => item.Type === 4).length
    },
    {
      text: "填空题",
      num: data.Rows.filter((item) => item.Type === 5).length
    }
    ];
    const listItem = (item, index) =>
      (
        <List.Item>
          <div style={{ width: "100%" }}>
            <div style={{ width: "40%", display: "inline-block" }}>
              {item.text}
            </div>
            <div style={{ width: "20%", display: "inline-block" }}>
              总数：{item.num}
            </div>
            <div style={{ width: "40%", textAlign: "right", display: "inline-block" }}>
              <Upload className="main-button" beforeUpload={(file) => this.beforeUpload(file, index)} showUploadList={false}>
                <Button type="primary">
                  <Icon type="upload" />导入习题
                </Button>
              </Upload>
              <Button type="primary" style={{marginLeft:15}} onClick={()=>{this.listItemClick(index+1)}}>
               详情
              </Button>
            </div>
          </div>
        </List.Item>
      )
    return (
      <div className={teachStyles.rightModule}>
        <div style={{ position: 'relative' }}>
          <h2>习题管理</h2>
        </div><hr />
        <List
          size="large"
          bordered
          dataSource={data1}
          renderItem={listItem}
        />
      </div>
    );
  }
}

export default ExerciseManagement;

