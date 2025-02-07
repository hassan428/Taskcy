import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {Heading, HeadingText, SomeText} from '../component/Text_component';
import {Submit_btn} from '../component/CustomBtn';
import {Custom_input, Password_input} from '../component/Custom_input';
import {useNavigation} from '@react-navigation/native';
// import {
//   getErrorEmailMessage,
//   getErrorPasswordMessage,
// } from '../utils/firebaseErrorMsg';
import {IconButton, TextInput} from 'react-native-paper';
import {AppBar} from '../component/AppBar';
import {api_auth_check, api_login, api_send_otp} from '../config/Apis';
import {validateEmail} from '../utils/validate_email';
import {useDispatch, useSelector} from 'react-redux';
import {
  islogged_action,
  loading_action,
  other_user_profile_action,
  profile_action,
} from '../store/slices/auth_slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TOKEN_NAME} from '@env';
import {Loading} from '../component/Loading';
import {auth_check_team_action} from '../store/slices/team_slice';
import {auth_check_task_action} from '../store/slices/task_slice';

export const LogIn = () => {
  const [data, setData] = useState({});
  const [errorMsg, setErrorMsg] = useState({});
  const [btn_loading, set_btn_loading] = useState(false);
  const [loading, set_loading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {primary, backgroundColor, color, dark_mode} = useSelector(
    store => store.theme,
  );
  const loadingOffHandle = () =>
    setTimeout(() => {
      set_loading(false);
    }, 1000);

  const inputValue = (text, id) => {
    text = text.split(' ').join('');
    setData({...data, [id]: text});
  };

  const submit_handle = async () => {
    try {
      const values = Object.values(data);
      const isEmpty = values.some(
        value => value === '' || value === null || value === undefined,
      );
      if (isEmpty || values.length < 2) {
        setErrorMsg({other: 'Please fill all the fields'});
      } else if (!validateEmail(data.email)) {
        setErrorMsg({email: 'Please enter a valid email address'});
      } else {
        setErrorMsg('');
        set_btn_loading(true);
        const res_login = await api_login(data);
        // console.log('res_login', res_login.data);
        set_loading(true);
        await AsyncStorage.setItem(TOKEN_NAME, res_login.data.token);
        const res = await api_auth_check();
        dispatch(profile_action(res.data.data));
        dispatch(other_user_profile_action(res.data.other_user));
        dispatch(auth_check_team_action(res.data.team));
        dispatch(auth_check_task_action(res.data.task));
        dispatch(islogged_action(true));
        // console.log('res', res.data);
        loadingOffHandle();
        set_loading(false);
      }
    } catch (err) {
      set_loading(false);
      set_btn_loading(false);
      const {message, success} = err?.response?.data;
      if (message?.includes('password')) {
        setErrorMsg({password: message});
      } else {
        setErrorMsg({other: message});
      }
      console.log('err.response', err?.response);
    }
  };

  // console.log('data', data)
  const log_in_with_google = () => {
    console.log('log_in_with_google');
  };

  const log_in_with_github = () => {
    console.log('log_in_with_github');
  };

  const forget_password_handle = async () => {
    if (!validateEmail(data.email)) {
      setErrorMsg({email: 'Please enter a valid email address.'});
    } else {
      setErrorMsg({});
      try {
        set_loading(true);
        const res = await api_send_otp(data);
        navigation.navigate('OTPVerification', data.email);
        loadingOffHandle();
      } catch (err) {
        set_loading(false);
        const {message, success} = err?.response?.data;
        setErrorMsg({other: message});
      }
    }
  };
  // console.log(data);
  const {
    heading_view,
    scroll_view,
    input_view,
    forget_password,
    navigate_view,
    err_msg,
    text_style,
  } = styles;

  return loading ? (
    <Loading />
  ) : (
    <>
      <AppBar
        title={'Sign In'}
        leftIcon={'chevron-left'}
        leftIconHandle={() => navigation.goBack()}
      />
      <ScrollView style={[scroll_view, {backgroundColor}]}>
        <View style={[heading_view]}>
          <Heading text="Welcome Back" />

          <SomeText
            myStyle={text_style}
            text="Please Inter your email address and password for Login"
          />
        </View>

        <View style={[input_view]}>
          <View>
            <Custom_input
              placeholder={'Enter your email'}
              keyboardType="email-address"
              value={data.email}
              error={errorMsg.email && true}
              onChangeText={text => inputValue(text, 'email')}
            />
            {errorMsg.email && (
              <SomeText myStyle={err_msg} text={errorMsg.email} />
            )}
          </View>

          <View>
            <Password_input
              onChangeText={text => inputValue(text, 'password')}
              value={data.password}
              error={errorMsg.password && true}
            />
            {errorMsg.password && (
              <SomeText myStyle={err_msg} text={errorMsg.password} />
            )}

            <SomeText
              onPress={forget_password_handle}
              myStyle={forget_password}
              text={'Forgot Password?'}
            />
          </View>
        </View>

        <SomeText
          myStyle={{...err_msg, textAlign: 'center', marginBottom: 5}}
          text={errorMsg.other}
        />
        <Submit_btn
          loading={btn_loading}
          disabled={btn_loading}
          onPress={submit_handle}
          text={'Sign In'}
        />

        <SomeText
          text={'Signin with'}
          myStyle={{textAlign: 'center', marginVertical: 20}}
        />

        <View style={[navigate_view]}>
          <IconButton
            icon="apple"
            iconColor={color}
            size={30}
            onPress={log_in_with_github}
          />

          <IconButton
            icon="google"
            iconColor={color}
            size={30}
            onPress={log_in_with_google}
          />
        </View>

        <View style={[navigate_view]}>
          <SomeText text={'Not Registrar Yet? '} />
          <SomeText
            myStyle={{color: primary}}
            text={'Sign Up '}
            onPress={() => navigation.navigate('SignUp')}
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scroll_view: {
    flex: 1,
    padding: 20,
  },
  heading_view: {
    gap: 10,
    width: '75%',
  },
  input_view: {
    marginVertical: 25,
    gap: 30,
  },
  err_msg: {
    color: 'red',
    textAlign: 'left',
  },
  forget_password: {
    marginTop: 5,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  navigate_view: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  text_style: {
    fontSize: 15,
    color: '#8D8D8D',
  },
});
