import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from 'react';

import Card from '../UI/Card/Card';
import Input from './../UI/Input/Input';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';

const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@') };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') };
  }
  return { value: '', isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === 'INPUT_PASS') {
    return { password: action.val, valid: action.val.trim().length > 6 };
  }
  if (action.type === 'VALID_PASS') {
    return {
      password: state.password,
      valid: state.password.trim().length > 6,
    };
  }
  return { password: '', valid: false };
};

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);

  const [passState, dispatchPass] = useReducer(passwordReducer, {
    password: '',
    valid: null,
  });

  const [emailState, dispatchState] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  });

  const authCtx = useContext(AuthContext);

  //Object destructring
  const { isValid: emailValid } = emailState;
  const { valid: passwordValid } = passState;

  useEffect(() => {
    console.log('EFFECT RUNNING');
    const identifier = setTimeout(() => {
      console.log('Checking for validity');
      setFormIsValid(emailValid && passwordValid);
    }, 500);

    return () => {
      console.log('EFFECT CLEANUP');
      clearTimeout(identifier);
    };
  }, [emailValid, passwordValid]);

  const emailChangeHandler = (event) => {
    dispatchState({ type: 'USER_INPUT', val: event.target.value });

    // setFormIsValid(
    //   event.target.value.includes("@") && passState.password.trim().length > 6
    // );
  };

  const passwordChangeHandler = (event) => {
    //setEnteredPassword(event.target.value);
    dispatchPass({ type: 'INPUT_PASS', val: event.target.value });
    //setFormIsValid(emailState.isValid && passState.valid);
  };

  const validateEmailHandler = () => {
    dispatchState({ type: 'INPUT_BLUR' });
  };

  const validatePasswordHandler = () => {
    //setPasswordIsValid(enteredPassword.trim().length > 6);
    dispatchPass({ type: 'VALID_PASS' });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if (formIsValid) {
      authCtx.onLogin(emailState.value, passState.password);
    } else if (!emailValid) {
      emailInputRef.current.focusfun(); //here we call the focusfun function from the input.js
    } else {
      passwordInputRef.current.focusfun();
    }
  };

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          id={'email'}
          label={'E-mail'}
          type={'email'}
          value={emailState.value}
          isValid={emailValid}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={passwordInputRef}
          id={'password'}
          label={'Password'}
          type={'password'}
          value={passState.value}
          isValid={passState.valid}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />

        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
