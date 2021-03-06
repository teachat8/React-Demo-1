import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, Checkbox, Icon } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import styles from './Signin.scss';
import Account from '@/components/Account';
import { signinFunc, error, changeSigninType } from '@/store/admin.reducer';

const { Tab, Username, Password, Pic, Mobile, Msg, Submit } = Account;

@connect(
  ({ admin }) => ({
    currentStatus: admin.status,
    currentSignType: admin.signinType,
    currentError: admin.error
  }),
  { signinFunc, error, changeSigninType }
)
export default class SigninPage extends Component {
  state = {
    type: 'account',
    autoSignin: true
  }

  handleSubmit(err, values) {
    if (!err) {
      const { type, autoSignin } = this.state;
      const info = { ...values, type, autoSignin };
      this.props.changeSigninType(type);
      this.props.signinFunc(info);
    }
  }

  onTabChange(type) {
    this.setState({ type });
  }

  getError(msg) {
    if (msg) {
      this.props.error(msg);
    }
  }

  changeAutoSignin(e) {
    this.setState({
      autoSignin: e.target.checked
    });
  }

  renderMessage(content) {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );
  }

  renderRedirect(status) {
    switch(status) {
      case 'success':
        return <Redirect from="/account/signin" to="/" />;
      case 'audit':
      case 'reject':
        return <Redirect from="/account/signin" to="/account/acc-result" />;
      default:
        return null;
    }
  }

  render() {
    const { currentStatus, currentSignType, currentError } = this.props;
    const { type, autoSignin } = this.state;
    return (
      <div className={styles.main}>
        <Account
          defaultActiveKey={type}
          onTabChange={this.onTabChange.bind(this)}
          onSubmit={this.handleSubmit.bind(this)}
        >
          {
            this.renderRedirect(currentStatus)
          }
          <Tab key="account" tab="账户密码登录">
            {
              currentStatus === 'error' &&
              currentSignType === 'account' &&
              this.renderMessage(currentError)
            }
            <Username name="username" />
            <Password name="password" />
            <Pic name="acc_pic" />
          </Tab>
          <Tab key="mobile" tab="手机号登录">
            {
              currentStatus === 'error' &&
              currentSignType === 'mobile' &&
              this.renderMessage(currentError)
            }
            <Mobile name="mobile" />
            <Pic name="mobile_pic" />
            <Msg type="signin" pic="mobile_pic" getError={this.getError.bind(this)} />
          </Tab>
          <div className={styles.operating}>
            <Checkbox checked={autoSignin} onChange={this.changeAutoSignin.bind(this)}>自动登录</Checkbox>
            <Link style={{ float: 'right' }} to="/account/forget">忘记密码</Link>
          </div>
          <Submit text="登录" />
          <div className={styles.other}>
            其他登录方式
            <Icon className={styles.icon} type="wechat" />
            <Link className={styles.signup} to="/account/signup">申请管理员</Link>
          </div>
        </Account>
      </div>
    );
  }
}