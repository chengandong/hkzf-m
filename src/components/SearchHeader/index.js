import React, { Component } from 'react'

import { Flex } from 'antd-mobile'

// 导入 withRouter 解决 因单独 封装组件 无法使用 路由功能
import { withRouter } from 'react-router-dom'

// 导入 prop-types 验证传参
import PropTypes from 'prop-types'

class SearchHeader extends Component {
  render() {
    return (
        <Flex className='searchBox'>
          <Flex className='searchLeft'>
            <div
              className='location'
              onClick={() => {
                this.props.history.push('/citylist')
              }}
            >
              <span>{this.props.cityName}</span>
              <i className="iconfont icon-arrow" />
            </div>
            <div
              className='searchForm'
            >
              <i className="iconfont icon-seach" />
              <span>请输入小区或地址</span>
            </div>
          </Flex>
          <i
            className="iconfont icon-map"
            onClick={() => {
              this.props.history.push('/map')
            }}
          />
      </Flex>
    )
  }
}

// 验证传来的参数类型
SearchHeader.propTypes = {
  cityName: PropTypes.string
}

// 设置默认值
SearchHeader.defaultProps = {
  cityName: '全国'
}

export default withRouter(SearchHeader)
