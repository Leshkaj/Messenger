import React, { useState } from 'react';

// Redux
import { connect } from 'react-redux';
import {
  loginReq,
  setAuthError,
  regNewUserReq
} from '../../redux/actions/users-actions';

import {
  getDataFromUserInputs
} from '../../redux/actions/chat-actions';

// Styles
import './dashboardPage.css';

// Component
import AccountFields from './AccountFields';
import AccountPassword from './AccountPassword';
import Confirmation from './Confirmation';
import Success from './Success';
import SurveyFields from './SurveyFields';

// const assign = require('object-assign');

const DashboardPage = (props) => {
  const [isReg, setIsReg] = useState(false);
  const [step, setStep] = useState(1);
  const { regNewUserReq, loginReq, signUpInfo, getDataFromUserInputs } = props;
  const [info, setInfo] = useState({});
  const loginHandler = (event) => {
    event.preventDefault();
    const login = event.target.login.value;
    const password = event.target.password.value;
    loginReq(login, password)
  };
  let fieldValues = {
    name: null,
    email: null,
    password: null,
    conpass: null,
    avatar: null
  };
  const addInputAndNextStep = (state) => {
    getDataFromUserInputs(state);
    nextStep()
  }

  const changeInfo = obj => {
    setInfo((info) => Object.assign(info, obj));
  }
  const nextStep = function () {
    setStep(step + 1)
  };
  const previousStep = function () {
    setStep(step - 1)
  };
  const submitRegistration = function () {
    const { login, name, email, password, avatar } = signUpInfo;
    regNewUserReq(login, name, email, password, avatar)
  };
  const showStep = function () {
    switch (step) {
      case 1:
        return <AccountFields fieldValues={fieldValues}
          nextStep={addInputAndNextStep}
          changeInfo={changeInfo}
          previousStep={previousStep}
          saveValues={getDataFromUserInputs} />
      case 2:
        return <AccountPassword fieldValues={fieldValues}
          nextStep={addInputAndNextStep}
          changeInfo={changeInfo}
          previousStep={previousStep}
          saveValues={getDataFromUserInputs} />
      case 3:
        return <SurveyFields fieldValues={fieldValues}
          nextStep={addInputAndNextStep}
          changeInfo={changeInfo}
          previousStep={previousStep}
          saveValues={getDataFromUserInputs} />
      case 4:
        return <Confirmation fieldValues={info}
          previousStep={previousStep}
          submitRegistration={submitRegistration} />
      case 5:
        return <Success fieldValues={fieldValues} />
      default:
        return
    }
  };
  return (
    <div className="auth-wrap">
      {
        !isReg ?
          <form onSubmit={loginHandler} method="POST" className="form">
            <div className="wrap-input-auth" id="login">
              <input autoComplete='off' name='login' type="search" className="input-auth"
                placeholder='Login' />
            </div>
            <div className="wrap-input-auth" id="password">
              <input autoComplete='off' name='password' type="password" className="input-auth" placeholder='Password' />
            </div>
            <div id='buttons' style={{ gridRowStart: '6' }}>
              <button className='firstButt' type='submit'>Login
                            </button>
              <button className='secondButt' type='submit' onClick={(event) => {
                event.preventDefault();
                setIsReg(true)
              }}>Sign Up
                            </button>
            </div>
          </form>
          :
          <>
            {showStep()}
          </>
      }
    </div>
  );
};
const mapStateToProps = (state) => ({
  signUpInfo: state.userReducer.signUpInfo
})
export default connect(
  mapStateToProps,
  {
    regNewUserReq,
    loginReq,
    setAuthError,
    getDataFromUserInputs
  })(DashboardPage);
