import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Upload, Icon, message, List, Pagination, Input, } from 'antd';
import ServerHost from '../../../../config/server.config';
import styles from './VideoList.less';

const { Dragger } = Upload;
const Search = Input.Search;
const storage = window.localStorage;
const headersType = `${JSON.parse(storage.getItem("msc-token")).token_type} ${JSON.parse(storage.getItem("msc-token")).access_token}`;
const pageSize = 9;
@connect(({ courseInfo, fileUpLoad, loading, }) => ({
  currentCourse: courseInfo.current,
  file: fileUpLoad.data,
  courseTeacherLoading: loading.effects['fileUpLoad/fetchUserList'],
  delete: loading.effects['fileUpLoad/fetchDelete'],
}))

class VideoList extends PureComponent {
  state = {
    pages: 1,
   
  }

  componentDidMount() {
    this.changeSizeData();
  }
  // 分页
  changeSizeData = () => {
    const { dispatch } = this.props;
    const { pages } = this.state;
    dispatch({
      type: 'fileUpLoad/fetchUserList',
      payload: {
        PageNumber: pages,
        PageSize: pageSize,
      },
    });
  }

  changeSize = (pageNumber) => {
    this.setState({
      pages: pageNumber
    }, () => {
      this.changeSizeData();
    })
  }
  // 文件上传
  uploadFile = () => {
    let that = this;
    let obj = {
      name: 'file',
      multiple: true,
      action: `${ServerHost.OnlineEducationServer}/FileUpLoad/FileUploadAsync`,
      headers: { Authorization: headersType },
      onChange(info) {
        if (info.file.response && info.file.response.Success) {
          that.changeSizeData();
          message.success(`${info.file.name} 文件上传成功！`);
        }else if (status === 'error'){
          message.error(`${info.file.name} 文件上传失败！`);
        }
        // const { status } = info.file.status;
        // if (status !== 'uploading') {
        //   console.log(info.file, info.fileList);
        // }
        // if (status === 'done') {
        //   message.success(`${info.file.name} file uploaded successfully.`);
        // } else if (status === 'error') {
        //   message.error(`${info.file.name} file upload failed.`);
        // }
      }
    }
    return obj;
  }
  // 删除视频文件
  deleteData = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fileUpLoad/fetchDelete',
      payload: [item.Id],
      callback: (response) => {
        if (response.Success === true) {
          message.success(`${item.Name} 文件删除成功！`);
        }else{
          message.error(`${item.Name} 文件删除失败！`);
        }
      }
    })
  }


  render() {
    const { file: { Rows, Total }, loading } = this.props;
    const { pages } = this.state;
    return (
      <div className={styles.cardList}>
        <Dragger {...this.uploadFile()}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">单击或拖动文件到此区域上传</p>
          {/* <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p> */}
        </Dragger>
        <div className={styles.Search}>
          <Search
            placeholder="请输入文件名称"
            onSearch={value => console.log(value)}
            style={{ width: "100%" }}
            size="large"
          />
        </div>
        <div style={{ marginTop: 70 }}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={[...Rows]}
            renderItem={item => (
              <List.Item key={item.Id}>
                <div className={styles.videoList}>
                  <img alt="" src={require('./picture/video.jpg')} style={{width:"100%",height:"100%"}}/>
                  <p style={{ float: "left", width: "90%" }}>{item.Name}</p>
                  <div className={styles.videoListdelete}>
                    <p style={{ float: "right", width: "5%" }} onClick={() => this.deleteData(item)}><Icon type="delete" /></p>
                  </div>
                </div>
              </List.Item>
            )
            }
          />
        </div>
        <Pagination showQuickJumper pageSize={pageSize} Current={pages} onChange={this.changeSize} total={Total} style={{ textAlign: 'right' }} />
      </div>
    );
  }
}

export default VideoList;
