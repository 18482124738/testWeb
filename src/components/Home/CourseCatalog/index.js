import React, { PureComponent } from 'react';
import { List, Icon } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { get } from 'https';

@connect(({ courseCatalog, loading }) => ({
  courseCatalog,
  courseCatalogLoading: loading.effects['CourseCatalog/fetch'],
}))
class CourseCatalog extends PureComponent {


  render() {
    const { courseCatalog: { data } } = this.props
    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );
    return (
      <div>
        {
          data.Rows.map((track) => (
            <div>
              <p key={track.Id} className={styles.summarize_firtitle}>{track.Name}</p>
              <List
                size="large"
                className={styles.articleList}
                rowKey="id"
                itemLayout="vertical"
                dataSource={track.CourseTasks}
                renderItem={item => (
                  <List.Item
                    key={item.Id}
                    style={{ marginLeft: 20 }}
                    actions={[
                      <IconText type="star-o" text={item.star} />,
                      <IconText type="like-o" text={item.like} />,
                      <IconText type="message" text={item.message} />,
                    ]}
                  >
                    <List.Item.Meta
                      style={{ marginBottom: 0 }}
                      title={
                        <a className={styles.listItemMetaTitle}>
                          {item.Name}（{item.time}分钟）
                        </a>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          ))
        }
      </div>
    );
  }
}

export default CourseCatalog;
