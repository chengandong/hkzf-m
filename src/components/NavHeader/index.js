import React, { Component } from 'react'

// 导入 withRouter 解决 因单独 封装组件 无法使用 路由功能
import { withRouter } from 'react-router-dom'

// 导入 所需的组件
import { NavBar ,Icon } from 'antd-mobile'

// 导入 prop-types 验证传参
import PropTypes from 'prop-types'

class NavHeader extends Component {
  render() {
    return (
      <div>
        <NavBar
          className="navbar"
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            this.props.history.go(-1)
          }}
        >
          {this.props.children}
        </NavBar>
      </div>
    )
  }
}

// 验证传来的参数类型
NavHeader.propTypes = {
  children: PropTypes.string
}

// 设置默认值
NavHeader.defaultProps = {
  children: '城市选择'
}

// withRouter组件 解决 路由功能
export default withRouter(NavHeader)
