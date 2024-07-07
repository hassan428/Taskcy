import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {HeadingText, SomeText} from './Text_component';
import {primary} from '../config/App_navigation/themeConfig';
import {Avatar, ProgressBar} from 'react-native-paper';

export const TaskCard = props => {
  const {heading, text, progress_str, progress_num, isThemeChange} = props;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: isThemeChange ? primary : 'white',
      gap: 15,
      padding: 30,
      borderRadius: 25,
      marginRight: 20,
      maxWidth: '90%',
      borderWidth: 2,
      borderColor: isThemeChange ? 'white' : primary,
    },
    avatar_view: {
      flexDirection: 'row',
    },
    second_container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    fontColor: {
      color: isThemeChange ? 'white' : primary,
    },
  });
  const {container, avatar_view, second_container, fontColor} = styles;
  return (
    <View style={[container]}>
      <View>
        <HeadingText text={heading} myStyle={{...fontColor}} />
        <SomeText text={text} myStyle={{...fontColor}} />
      </View>

      <View style={[second_container]}>
        <View style={[avatar_view]}>
          <Avatar.Image
            size={35}
            source={{
              uri: 'https://static.vecteezy.com/system/resources/thumbnails/011/675/374/small_2x/man-avatar-image-for-profile-png.png',
            }}
          />
          <Avatar.Image
            size={35}
            style={{right: 10}}
            source={{
              uri: 'https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg?size=338&ext=jpg&ga=GA1.1.2113030492.1720224000&semt=ais_user',
            }}
          />
          <Avatar.Image
            size={35}
            style={{right: 20}}
            source={{
              uri: 'https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg',
            }}
          />
        </View>

        <View style={{width: '50%', gap: 5}}>
          <SomeText
            text={progress_str}
            myStyle={{...fontColor, textAlign: 'right'}}
          />
          <ProgressBar
            progress={progress_num}
            color={isThemeChange ? 'white' : primary}
          />
        </View>
      </View>
    </View>
  );
};
