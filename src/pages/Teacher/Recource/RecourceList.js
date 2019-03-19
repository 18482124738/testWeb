import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  message,
  Modal,
} from 'antd';
import ServerHost from '../../../../config/server.config';
import styles from './RecourceList.less';
import RecourcePanel from '@/components/Teacher/RecourcePanel';

@connect(({ courseInfo, resourceFile, resourceFolder, loading }) => ({
  courseInfo: courseInfo.data,
  CourseFile: resourceFile.data,
  CourseFolder: resourceFolder.data,
  courseTeacherLoading: loading.effects['resourceFolder/fetch'],
}))
class RecourceList extends PureComponent {
  state = {
  
  };

 
  render() {
   
    return (
      <div className={styles.cardList}>       
        <RecourcePanel />
      </div>
    );
  }
}

export default RecourceList;
