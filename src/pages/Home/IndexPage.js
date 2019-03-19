import React, { Component } from 'react';
import { connect } from 'dva';

import Banner from './Banner'
import InterestCategory from './InterestCategory'

// import styles from './IndexPage.less';


@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class IndexPage extends Component {

  render() {

    return (
      <div>
        <Banner>
        </Banner>
        <InterestCategory>
        </InterestCategory>
      </div>
    );
  }
}

export default IndexPage;
