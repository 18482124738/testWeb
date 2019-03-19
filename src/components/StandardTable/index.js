import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      pagination: {},
      needTotalList,
    };
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    // const pager = this.state.pagination ;
    this.setState({ pagination });
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  // onRowClick = (record) => {
  //   return {
  //     onClick: () => { console.log(record) },       // 点击行
  //     onDoubleClick: () => { console.log(record) },
  //   };
  // }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    const { selectedRowKeys, pagination } = this.state;
    const { data = {}, rowKey, ...rest } = this.props;
    const { Rows = [], Total = 0 } = data;
    pagination.total = Total;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };


    return (
      <div className={styles.standardTable}>
        <Table
          // onRow={this.onRowClick}
          rowKey={rowKey || 'Id'}
          rowSelection={rowSelection}
          dataSource={Rows}
          size='small'
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
