import React, { Component } from 'react';
import { connect } from 'dva';
import { Carousel, Icon } from 'antd';
import personImg1 from '@/assets/Banner/医教协同.jpg'
import personImg2 from '@/assets/Banner/医疗协作.jpg'
import personImg3 from '@/assets/Banner/医研协进.jpg'
// import personImg3 from '@/assets/2fc47edc5b98d6b6107bcd80e56e8a26.jpg'

import styles from './Banner.less';
import { SSL_OP_TLS_ROLLBACK_BUG } from 'constants';

@connect(({ userInfo }) => ({
  userInfo,
}))
class Banner extends Component {
  constructor(props) {
    super(props);

    this.carouselRef = null;
    this.setCarouselRef = el => {
      this.carouselRef = el;
    };
  }


  Next = () => {
    if (this.carouselRef) this.carouselRef.next();
  }

  Prev = () => {
    if (this.carouselRef) this.carouselRef.prev();
  }

  render() {
    const { userInfo: { currentUser } } = this.props;
    return (
      <section className={styles.BannerBox}>
        {currentUser.Id ? (
          <div className={styles.BannerModal}>
            <img className={styles.BannerModalHeadImg} alt='' src="//thirdqq.qlogo.cn/g?b=sdk&k=dpAOhQr0iaW6PHfbTHouFxg&s=140&t=1513046448" />
            <span className={styles.BannerModalUser_info}>{currentUser.Name}</span>
            <span className={styles.BannerModalUser_logout}>退出</span>
            <div style={{ padding: ' 0 0 9px' }}>
              <div className={styles.BannerModalSchedule}>
                <span className={styles.BannerModalSchedule_Course}>
                  <i>6</i> 门课程
                </span>
              </div>
            </div>
            {/* <div className={styles.BannerModalSchedule_live}>

          </div> */}
            <div className={styles.BannerModalSchedule_Foot}>
              <Icon type="calendar" /> 我的课表
            </div>
          </div>) : ""}

        <div onClick={this.Prev} className={styles.BannerPrev} >
          <Icon style={{ color: 'white' }} type="left" />

        </div>
        <div onClick={this.Next} className={styles.BannerNext} >
          <Icon style={{ color: 'white' }} type="right" />
        </div>

        <Carousel ref={this.setCarouselRef} autoplay effect="fade">
          <div className={`${styles.Banner} ${styles.BannerColor1}`}>
            <img src={personImg1} alt="医教协同" className={styles.BannerImg} />
          </div>
          <div className={`${styles.Banner} ${styles.BannerColor2}`}>
            <img src={personImg2} alt="医疗协作" className={styles.BannerImg} />
          </div>
          <div className={`${styles.Banner} ${styles.BannerColor3}`}>
            <img src={personImg3} alt="医研协进" className={styles.BannerImg} />

          </div>
          {/* <div className={styles.Banner}>
            <img src={personImg3} className={styles.BannerImg3} />

          </div> */}
        </Carousel>,
      </section>
    );
  }
}

export default Banner;
