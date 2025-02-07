import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {Heading, SomeText} from '../component/Text_component';
import {Submit_btn} from '../component/CustomBtn';
import {Custom_input, Password_input} from '../component/Custom_input';
import {useNavigation} from '@react-navigation/native';
import {IconButton} from 'react-native-paper';
import {AppBar} from '../component/AppBar';
import {api_signup} from '../config/Apis';
import {useDispatch, useSelector} from 'react-redux';
import {profile_action} from '../store/slices/auth_slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {validateEmail} from '../utils/validate_email';
import {Loading} from '../component/Loading';
import {USER_UID} from '@env';
import {Radio_btn} from '../component/Radio_btn';

export const SignUp = () => {
  const [data, setData] = useState({});
  const [errorMsg, setErrorMsg] = useState({});
  const [gender, set_gender] = useState('Male');
  const [btn_loading, set_btn_loading] = useState(false);
  const navigation = useNavigation();
  const [loading, set_loading] = useState(false);
  const dispatch = useDispatch();
  const {primary, backgroundColor, color, dark_mode} = useSelector(
    store => store.theme,
  );
  const loadingOffHandle = () =>
    setTimeout(() => {
      set_loading(false);
    }, 1000);

  const inputValue = (text, id) => {
    if (id !== 'full_name') text = text.split(' ').join('');
    setData({...data, [id]: text});
  };
  const submit_handle = async () => {
    try {
      const values = Object.values(data);
      const isEmpty = values.some(
        value => value === '' || value === null || value === undefined,
      );
      if (isEmpty || values.length < 5) {
        setErrorMsg({other: 'Please fill all the fields'});
      } else if (data.password?.length < 8) {
        setErrorMsg({
          password: 'Password too short! Must be 8+ characters.',
        });
      } else if (!validateEmail(data.email)) {
        setErrorMsg({email: 'Please enter a valid email address'});
      } else {
        setErrorMsg('');
        set_btn_loading(true);
        const res = await api_signup({...data, gender});
        set_loading(true);
        // console.log('res', res.data.data);
        await AsyncStorage.setItem(USER_UID, res.data.data._id);
        dispatch(profile_action(res.data.data));
        navigation.navigate('OTPVerification');
        loadingOffHandle();
        set_btn_loading(false);
      }
    } catch (err) {
      set_btn_loading(false);
      console.log(err?.response?.data);
      if (err?.response?.data?.message) {
        const {message, success} = err?.response?.data;
        if (message?.includes('duplicate')) {
          if (message?.includes('username:')) {
            setErrorMsg({username: 'Username already exists!'});
          } else if (message?.includes('email:')) {
            setErrorMsg({email: 'email already exists!'});
          } else if (message?.includes('phone_number:')) {
            setErrorMsg({phone_number: 'Phone Number already exists!'});
          }
        } else {
          setErrorMsg({other: message});
        }
      } else {
        setErrorMsg({other: 'an unknown error occurred'});
      }
    }
  };

  // console.log('data', data)
  const sign_up_with_google = () => {
    console.log('sign_up_with_google');
  };

  const sign_up_with_github = () => {
    console.log('sign_up_with_github');
  };

  const radio_data = [
    {
      text: 'Male',
    },
    {
      text: 'Female',
    },
    {
      text: 'Others',
    },
  ];

  const {
    heading_view,
    scroll_view,
    input_view,
    navigate_view,
    err_msg,
    text_style,
  } = styles;

  return loading ? (
    <Loading />
  ) : (
    <>
      <AppBar
        title={'Sign Up'}
        leftIcon={'chevron-left'}
        leftIconHandle={() => navigation.goBack()}
      />
      <ScrollView style={[scroll_view, {backgroundColor}]}>
        <View style={[heading_view]}>
          <Heading text="Create Account" />

          <SomeText
            myStyle={text_style}
            text="Please Inter your Information and create your acount"
          />
        </View>

        <View style={[input_view]}>
          <View>
            <Custom_input
              placeholder={'Enter Full Name'}
              value={data.full_name}
              error={errorMsg.full_name && true}
              onChangeText={text => inputValue(text, 'full_name')}
            />
            {errorMsg.full_name && (
              <SomeText myStyle={err_msg} text={errorMsg.full_name} />
            )}
          </View>

          <View>
            <Custom_input
              placeholder={'Enter Username'}
              value={data.username}
              error={errorMsg.username && true}
              onChangeText={text => inputValue(text, 'username')}
            />
            {errorMsg.username && (
              <SomeText myStyle={err_msg} text={errorMsg.username} />
            )}
          </View>

          <Radio_btn
            primary={primary}
            color={color}
            radio_data={radio_data}
            value={gender}
            onValueChange={val => set_gender(val)}
          />

          <View>
            <Custom_input
              placeholder={'Enter Phone Number'}
              keyboardType="phone-pad"
              value={data.phone_number}
              error={errorMsg.phone_number && true}
              onChangeText={text => inputValue(text, 'phone_number')}
            />
            {errorMsg.phone_number && (
              <SomeText myStyle={err_msg} text={errorMsg.phone_number} />
            )}
          </View>

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
          text={'Signup with'}
          myStyle={{textAlign: 'center', marginTop: 20}}
        />

        <View style={[navigate_view, {marginBottom: 5}]}>
          <IconButton
            icon="apple"
            iconColor={color}
            size={30}
            onPress={sign_up_with_github}
          />

          <IconButton
            icon="google"
            iconColor={color}
            size={30}
            onPress={sign_up_with_google}
          />
        </View>

        <View style={[navigate_view, {marginBottom: 30}]}>
          <SomeText text={'Have an Acount? '} />
          <SomeText
            myStyle={{color: primary}}
            text={'Sign In'}
            onPress={() => navigation.navigate('LogIn')}
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
    marginVertical: 20,
    gap: 15,
  },
  err_msg: {
    color: 'red',
    textAlign: 'left',
  },
  navigate_view: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_style: {
    fontSize: 15,
    color: '#8D8D8D',
  },
});
