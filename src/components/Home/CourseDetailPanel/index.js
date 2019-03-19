import React, { PureComponent } from 'react';
// import { List, Icon } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import showPersonImg from '@/assets/person.png'

@connect(({ courseTeacher, courseDetail, loading }) => ({
  courseTeacher: courseTeacher.data,
  courseTeacherLoading: loading.effects['courseTeacher/fetch'],
}))
class CourseDetailPanel extends PureComponent {
  componentDidMount() {
    
  }

  render() {
    const { currentCourse: { Introduction }, courseDetail: { Content } } = this.props;
    return (
      <div>
        <p className={styles.introduce_title}>老师介绍</p>
        <div className={styles.introduce_module}>
          <p className={styles.introduce_img}>
            <img alt="example" src={showPersonImg} className={styles.headerImg} />
          </p>
          <div className={styles.introduce_teacheSynopsis}>
            <a>超哥</a>
            <p>自幼学习C#</p>
          </div>
        </div>
        <p className={styles.introduce_synopsis}><span>简 &nbsp;&nbsp;&nbsp;&nbsp; 介</span><span>{Introduction}</span></p>
        <div className={styles.title}>
          {Content}
        </div>
      </div>
    );
  }
}

export default CourseDetailPanel;
