import React, { PureComponent } from 'react';
import { Collapse, Icon } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import CatalogForm from './CatalogForm';
import TaskForm from './TaskForm';

const { Panel } = Collapse;

const taskTypeName = ['', '', '录播', '资料', '习题']
@connect(({ courseTask, courseCatalog, loading }) => ({
  courseTask,
  courseCatalog,
  loading: loading.models.courseInfo,
}))
class CatalogList extends PureComponent {
  state = {
    taskFormVisible: false,
    taskFormValues: {},
    catalogFormVisible: false,
    catalogFormValues: {},
    catalogId: ''
  }

  componentDidMount() {
    // const { dispatch, courseTerm } = this.props;
    // dispatch({
    //   type: 'courseTerm/saveCurrent',
    //   payload: courseTerm,
    // });
    this.loadCatalogList();
  }

  loadCatalogList = () => {
    const { dispatch, courseTerm } = this.props;
    dispatch({
      type: 'courseCatalog/fetch',
      payload: {
        courseTermId: courseTerm.Id
      }
    });
  }

  handleAddTaskVisible = (flag, record) => {
    this.setState({
      taskFormVisible: !!flag,
      taskFormValues: record || {},
      catalogId: record.CourseCatalogId || ''
    });
  };

  handleAddTaskOk = fields => {
    const { dispatch } = this.props;
    const { catalogId } = this.state;
    let typeStr = 'courseTask/update';
    if (fields.id === 0) {
      typeStr = 'courseTask/add';
    }
    dispatch({
      type: typeStr,
      payload: {
        ...fields,
      },
      callback: () => {
        this.loadCatalogList();
        this.handleAddTaskVisible(true, { id: 0, CourseCatalogId: catalogId, TaskType: "2" });
      },
    });
  }

  handleAddCatalogVisible = (flag, record) => {
    this.setState({
      catalogFormVisible: !!flag,
      catalogFormValues: record || {},
    });
  };

  handleAddCatalogOk = fields => {
    const { dispatch, courseTerm } = this.props;
    let typeStr = 'courseCatalog/update';
    if (fields.id === 0) {
      typeStr = 'courseCatalog/add';
    }
    dispatch({
      type: typeStr,
      payload: {
        courseTermId: courseTerm.Id,
        ...fields,
      },
      callback: () => {
        // this.loadCatalogList();
        this.handleAddCatalogVisible(true);
      },
    });
  }

  handleDeleteCatalogData = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseCatalog/remove',
      payload: [fields],
      callback: (response) => {
        if (response) {
          this.loadCatalogList();
        }
      }
    });

  }

  handleDeleteTaskData = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseTask/remove',
      payload: [fields],
      callback: (response) => {
        if (response) {
          this.loadCatalogList();
        }
      }
    });
  }

  render() {
    const {
      courseCatalog: { data: CatalogData }
    } = this.props;
    const { catalogFormValues, catalogFormVisible, taskFormVisible, taskFormValues, catalogId } = this.state;

    const taskFormMethods = {
      handleVisible: this.handleAddTaskVisible,
      handleOk: this.handleAddTaskOk,
    };

    const catalogFormMethods = {
      handleVisible: this.handleAddCatalogVisible,
      handleOk: this.handleAddCatalogOk,
    };
    return (
      <div>
        <Collapse bordered={false}>
          {
            CatalogData.Rows.map((catalog) => (
              <Panel header={catalog.Name} key={`cp_${catalog.Id}`} className={styles.customPanelStyle}>
                {
                  catalog.CourseTasks.map((task) => (
                    <div key={`tk_${catalog.Id}_${task.Id}`} className={styles.courseList}>
                      <span>【{taskTypeName[task.TaskType]}】</span>
                      <span>{task.Name}</span>
                      <a style={{ float: 'right' }} onClick={() => { this.handleDeleteTaskData(task.Id) }}><Icon type="delete" /></a>
                      <a style={{ float: 'right', marginRight: '25px' }} onClick={() => { this.handleAddTaskVisible(true, task) }}><Icon type="edit" /></a>
                    </div>
                  ))

                }
                {
                  (taskFormVisible && catalogId === catalog.Id) ?
                    <div className={styles.newPanel}>
                      <TaskForm
                        {...taskFormMethods}
                        values={taskFormValues}
                      />
                    </div>
                    :
                    <div>
                      <a onClick={() => { this.handleAddTaskVisible(true, { id: 0, CourseCatalogId: catalog.Id, TaskType: "2" }) }}>+ 添加学习任务</a>
                      <a style={{ marginLeft: '25px' }} onClick={() => { this.handleAddCatalogVisible(true, { Id: catalog.Id, userId: catalog.UserId }) }}><Icon type="edit" />编辑章节</a>
                      <a style={{ marginLeft: '25px' }} onClick={() => { this.handleDeleteCatalogData(catalog.Id) }}><Icon type="delete" />删除章节</a>
                    </div>
                }
              </Panel>
            ))
          }

        </Collapse>
        {
          catalogFormVisible ?
            <div className={styles.newPanel}>
              <CatalogForm
                {...catalogFormMethods}
                values={catalogFormValues}
              />
            </div> : <div><a onClick={() => { this.handleAddCatalogVisible(true, { id: 0 }) }}>+ 新增一节</a></div>
        }
      </div>
    );
  }
}

export default CatalogList;
