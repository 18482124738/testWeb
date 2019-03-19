
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Breadcrumb, Input, List, Card, Upload, Button, Icon, Select, message, Modal
} from 'antd';
import ServerHost from '../../../../config/server.config';
import { getToken } from '@/utils/token';
import styles from './index.less';
import courseFile from '@/assets/courseFile.png';
import courseFolder from '@/assets/courseFolder.png';

const { Option } = Select;

let clickCount = 0; // 点击计数

@connect(({ courseInfo, resourceFile, resourceFolder, loading }) => ({
  courseInfo: courseInfo.data,
  CourseFile: resourceFile.data,
  CourseFolder: resourceFolder.data,
  courseTeacherLoading: loading.effects['resourceFolder/fetch'],
}))
class RecourcePanel extends PureComponent {
  state = {
    selectItem: {},
    pId: [0], // 父节点id
    courseInfoId: '', // 课程id
    isChangeName: false, // 重命名
    isNew: false,
    pathArray: [], // 面包屑
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceFolder/fetch',
      payload: {
        ParentId: 0,
      },
    });
    dispatch({
      type: 'resourceFile/fetch',
      payload: {
        ResourceFolderId: 0,
      },
    });
    dispatch({
      type: 'courseInfo/fetchUserList',
    });
  }

  /* 返回上一级 */
  BackUp = () => {
    const { dispatch } = this.props;
    const { pId, courseInfoId, pathArray } = this.state;
    pId.pop();
    pathArray.pop();
    this.setState({
      pId,
      pathArray,
    });
    dispatch({
      type: 'resourceFolder/fetch',
      payload: {
        ParentId: pId[pId.length - 1],
        CourseInfoId: courseInfoId,
      },
    });
    dispatch({
      type: 'resourceFile/fetch',
      payload: {
        ResourceFolderId: pId[pId.length - 1],
        CourseInfoId: courseInfoId,
      },
    });
  };

  /* 路径选择 */
  handlePathClick = index => {
    const { courseInfoId, pId, pathArray } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceFolder/fetch',
      payload: {
        ParentId: index === -1 ? 0 : pId[index + 1],
        CourseInfoId: courseInfoId,
      },
    });
    dispatch({
      type: 'resourceFile/fetch',
      payload: {
        ResourceFolderId: index === -1 ? 0 : pId[index + 1],
        CourseInfoId: courseInfoId,
      },
    });
    pathArray.splice(index + 1);
    pId.splice(index + 2);
    this.setState({
      pId,
      pathArray,
    });
  };

  /* 文件夹的双击 */
  openFolder = (folder) => {
    if (folder === undefined) return;
    const { dispatch } = this.props;
    const { pId, pathArray, courseInfoId } = this.state;
    clickCount += 1;
    this.pitchCard(folder);
    setTimeout(() => {
      if (clickCount >= 2) {
        pId.push(folder.Id);
        pathArray.push(folder.Name);
        this.setState({
          pId,
          pathArray,
        });
        dispatch({
          type: 'resourceFolder/fetch',
          payload: {
            ParentId: folder.Id,
            CourseInfoId: courseInfoId,
          },
        });
        dispatch({
          type: 'resourceFile/fetch',
          payload: {
            ResourceFolderId: folder.Id,
            CourseInfoId: courseInfoId,
          },
        });
      }
      clickCount = 0;
    }, 300);
  };

  addFolder = flag => {
    this.setState({
      isNew: !flag,
      folderNames: '',
    });
  };

  floderKeyDown = e => {
    if (e.keyCode === 13) {
      this.saveFloder();
    }
  };

  /* 新建文件夹 */
  saveFloder = () => {
    const { dispatch } = this.props;
    const { folderNames, pId, courseInfoId } = this.state;
    dispatch({
      type: 'resourceFolder/add',
      payload: {
        Name: folderNames,
        ParentId: pId[pId.length - 1],
        CourseInfoId: courseInfoId || 1,
      },
      callback: res => {
        if (res.Success) {
          this.addFolder(true);
        }
      },
    });
  };

  folderName = e => {
    this.setState({
      folderNames: e.target.value,
    });
  };

  /* 删除文件夹 */
  deletedFloder = () => {
    const { dispatch } = this.props;
    const { isChoose, folderId, courseInfoId, pId, isFolder } = this.state;
    if (!isChoose) {
      message.warning('请选择文件（夹）。');
      return;
    }
    Modal.confirm({
      title: '删除提示',
      content: `您确定要删除吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: isFolder ? 'resourceFolder/remove' : 'resourceFile/remove',
          payload: {
            ids: [folderId],
            folderquery: {
              ParentId: pId[pId.length - 1],
              CourseInfoId: courseInfoId,
            },
            filequery: {
              ResourceFolderId: pId[pId.length - 1],
              CourseInfoId: courseInfoId,
            },
          },
        });
      },
      onCancel() { },
    });
  };

  /* 文件（夹）的单击 */
  pitchCard = (folder) => {
    const { onFileSelected } = this.props;
    if (folder.Type === "File") {
      if (onFileSelected) {
        onFileSelected.call(this, folder);
      } else {
        onFileSelected.call(this, null);
      }
    }
    this.setState({
      selectItem: folder,
    });
  };

  /* 课程选择 */
  handleCourseChange = value => {
    const { pId } = this.state;
    const { dispatch } = this.props;
    value = value === 'all' ? '' : value;
    this.setState({
      courseInfoId: value,
    });
    dispatch({
      type: 'resourceFolder/fetch',
      payload: {
        ParentId: pId[pId.length - 1],
        CourseInfoId: value,
      },
    });
    dispatch({
      type: 'resourceFile/fetch',
      payload: {
        ResourceFolderId: pId[pId.length - 1],
        CourseInfoId: value,
      },
    });
  };

  /* 触发重命名 */
  updateFloderName = (isChangeName) => {
    const { selectItem } = this.state;
    if (!selectItem.Id) {
      message.warning('请选择文件（夹）。');
      return;
    }
    this.setState({
      isChangeName: !isChangeName,
    });
  };

  /* 改变文件（夹）名 */
  changeFloder = item => {
    const { dispatch } = this.props;
    const { folderNames } = this.state;
    item.Name = folderNames;
    item.ResourceFile = null;
    if (item.Extension) {
      dispatch({
        type: 'resourceFile/update',
        payload: item
      });
    } else {
      item.Enable = true;
      dispatch({
        type: 'resourceFolder/update',
        payload: item,
      });
    }
  };

  floderChangeName = (e, item) => {
    const { folderNames } = this.state;
    if (e.keyCode === 13 && folderNames) {
      this.changeFloder(item);
    }
  };

  render() {
    const { dispatch, CourseFile, CourseFolder, loading, courseInfo: { Rows } } = this.props;
    if (CourseFile.list) {
      CourseFile.Rows = [];
    }
    const { selectItem, isChangeName, pathArray, pId, courseInfoId, isNew } = this.state;
    const uploadOptions = {
      name: 'file',
      action: `${
        ServerHost.OnlineEducationServer
        }/FileUpLoad/FileUploadAsync?courseInfoId=${courseInfoId}&resourceFolderId=${
        pId[pId.length - 1]
        }`,
      headers: { Authorization: getToken() },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 文件上传成功。`);
          dispatch({
            type: 'resourceFile/fetch',
            payload: {
              ResourceFolderId: pId[pId.length - 1],
              CourseInfoId: courseInfoId,
            },
          });
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 文件上传失败。`);
        }
      },
    };
    return (
      <div className={styles.recourcePanel}>
        <div className={styles.operationButton}>
          <Upload {...uploadOptions}>
            <Button style={{ border: 'none' }}>
              <Icon type="upload" /> 上传
            </Button>
          </Upload>
          <Button style={{ border: 'none' }} onClick={this.deletedFloder}>
            <Icon type="delete" /> 删除
          </Button>
          <Button style={{ border: 'none' }} onClick={() => this.addFolder(isNew)}>
            <Icon type="folder-add" /> {isNew ? '取消新建' : '新建文件夹'}
          </Button>
          <Button
            style={{ border: 'none' }}
            onClick={() => this.updateFloderName(isChangeName)}
          >
            <Icon type="edit" /> {!isChangeName ? '重命名' : '取消重命名'}
          </Button>
          <Select defaultValue="all" style={{ width: 150 }} onChange={this.handleCourseChange}>
            <Option value="all">全部课程</Option>
            {Rows.length > 0
              ? Rows.map((item) => (
                <Option value={item.Id}>{item.Name}</Option>
              ))
              : ''}
          </Select>
          <Button
            style={{ border: 'none', display: pId.length === 1 ? 'none' : '' }}
            onClick={() => this.BackUp()}
          >
            <Icon type="arrow-up" /> 返回上一级
          </Button>
        </div>
        <div className={styles.breadcrumb}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item style={{ cursor: 'pointer' }} onClick={() => this.handlePathClick(-1)}>
              资料管理
            </Breadcrumb.Item>
            {pathArray
              ? pathArray.map((item, k) => (
                <Breadcrumb.Item
                  style={{ cursor: 'pointer' }}
                  key={item}
                  onClick={() => this.handlePathClick(k)}
                >
                  {item}
                </Breadcrumb.Item>
              ))
              : ''}
          </Breadcrumb>
        </div>
        <List
          rowKey="id"
          loading={loading}
          grid={{ gutter: 24, lg: 5, md: 2, sm: 1, xs: 1 }}
          dataSource={[...CourseFolder.Rows, ...CourseFile.Rows]}
          renderItem={item =>
            item.Type === "Folder" ? (
              <List.Item key={item.Id}>
                <div
                  className={styles.card}
                  onClick={() => this.openFolder(item)}
                  style={item.Id === selectItem.Id && selectItem.Type === "Folder" ?
                    {
                      backgroundColor: '#f0f0f0', outline: '1px solid #d8d8d8',
                    }
                    :
                    {
                      backgroundColor: 'transparent', outline: 'none',
                    }}
                >
                  <img alt="" className={styles.cardAvatar} src={courseFolder} />
                  {item.Id === selectItem.Id && selectItem.Type === "Folder" && isChangeName ? (
                    <Input
                      defaultValue={item.Name}
                      onChange={this.folderName}
                      onBlur={() => this.changeFloder(item)}
                      onKeyDown={e => this.floderChangeName(e, item)}
                    />
                  ) : (<div>{item.Name}</div>)}
                </div>
              </List.Item>
            ) :
              (
                <List.Item key={`${item.Id * -1}`}>
                  <div
                    className={styles.card}
                    onClick={() => this.pitchCard(item)}
                    style={item.Id === selectItem.Id && selectItem.Type === "File" ?
                      {
                        backgroundColor: '#f0f0f0', outline: '1px solid #d8d8d8',
                      }
                      :
                      {
                        backgroundColor: 'transparent', outline: 'none',
                      }}
                  >
                    <img alt="" className={styles.cardAvatar} src={courseFile} />
                    {item.Id === selectItem.Id && selectItem.Type === "Folder" && isChangeName ? (
                      <Input
                        defaultValue={item.Name}
                        onChange={this.folderName}
                        onBlur={() => this.changeFloder(item)}
                        onKeyDown={e => this.floderChangeName(e, item)}
                      />
                    ) : (<div>{item.Name}</div>)}
                  </div>
                </List.Item>
              )
          }
        />
      </div>
    );
  }
}

export default RecourcePanel;

