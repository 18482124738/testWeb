import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import styles from './index.less';

const { Group, Search } = Input
const { Option } = Select;
const InputGroup = Input.Group;

export default class HeaderSearch extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    placeholder: PropTypes.string,
    onSearch: PropTypes.func,
    onPressEnter: PropTypes.func,
    defaultActiveFirstOption: PropTypes.bool,
    dataSource: PropTypes.array,
    defaultOpen: PropTypes.bool,
    onVisibleChange: PropTypes.func,
  };

  static defaultProps = {
    defaultActiveFirstOption: false,
    onPressEnter: () => { },
    onSearch: () => { },
    className: '',
    placeholder: '',
    dataSource: [],
    defaultOpen: false,
    onVisibleChange: () => { },
  };

  static getDerivedStateFromProps(props) {
    if ('open' in props) {
      return {
        searchMode: props.open,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      searchMode: props.defaultOpen,
      value: '',
    };
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onKeyDown = e => {
    if (e.key === 'Enter') {
      const { onPressEnter } = this.props;
      const { value } = this.state;
      this.timeout = setTimeout(() => {
        onPressEnter(value); // Fix duplicate onPressEnter
      }, 0);
    }
  };

  onChange = value => {
    const { onChange } = this.props;
    this.setState({ value });
    if (onChange) {
      onChange(value);
    }
  };

  enterSearchMode = () => {
    const { onVisibleChange } = this.props;
    onVisibleChange(true);
    this.setState({ searchMode: true }, () => {
      const { searchMode } = this.state;
      if (searchMode) {
        this.input.focus();
      }
    });
  };

  leaveSearchMode = () => {
    this.setState({
      searchMode: false,
      value: '',
    });
  };

  // NOTE: 不能小于500，如果长按某键，第一次触发auto repeat的间隔是500ms，小于500会导致触发2次
  @Bind()
  @Debounce(500, {
    leading: true,
    trailing: false,
  })
  debouncePressEnter() {
    const { onPressEnter } = this.props;
    const { value } = this.state;
    onPressEnter(value);
  }

  render() {
    const { className, placeholder, open, ...restProps } = this.props;
    delete restProps.defaultOpen; // for rc-select not affected

    return (

      <div className={styles.headerSearch}>
        <InputGroup compact>
          <Select defaultValue="机构">
            <Option value="机构">机构</Option>
            <Option value="老师">老师</Option>
          </Select>
          <Search
            placeholder="请搜索"
            onSearch={value => console.log(value)}
            // enterButton
            style={{ width: 200 }}
          />

        </InputGroup>
      </div>

    );
  }
}
