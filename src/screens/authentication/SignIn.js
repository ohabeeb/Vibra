/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ToastAndroid,
} from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {FormInput, TextButton} from '../../components';

export default function SignIn({navigation}) {
  const [email, setEmial] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMesseage] = React.useState('');
  const [toggleRememberMe, setToggleRememberMe] = React.useState(false);

  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '9263623689-1sopi3ft2ujal8028ne4cbp3qd992rua.apps.googleusercontent.com',
    });
  }, []);

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();
    navigation.replace('Tabs');

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  const isSignInEnabled = () => {
    return email !== '' && password !== '' && errorMessage === '';
  };

  const SignInUser = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        navigation.replace('Tabs');
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          ToastAndroid.showWithGravity(
            'The email address is badly formatted.',
            5000,
            ToastAndroid.TOP,
          );
        }

        if (error.code === 'auth/invalid-credential') {
          ToastAndroid.showWithGravity(
            'The supplied credential is incorrect.',
            5000,
            ToastAndroid.TOP,
          );
        }

        // console.error(error);
      });
  };
  return (
    <View style={styles.container}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 40, fontWeight: 'bold', color: 'maroon'}}>
          Vibra
        </Text>
        <Text style={{fontSize: 16, marginTop: 10}}>Let's sign you in!</Text>
      </View>
      <KeyboardAvoidingView behavior="padding">
        <FormInput
          label={'Email Address'}
          keyboardType={'email-address'}
          placeholder={'example@email.com'}
          onChangeText={value => setEmial(value)}
        />
        <FormInput
          label={'Password'}
          placeholder={'password'}
          secureTextEntry={true}
          onChangeText={value => setPassword(value)}
        />
      </KeyboardAvoidingView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setToggleRememberMe(!toggleRememberMe)}
          style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
          {toggleRememberMe ? (
            <View
              style={{
                width: 12,
                height: 12,
                borderWidth: 1,
                borderColor: 'maroon',
                backgroundColor: 'maroon',
              }}
            />
          ) : (
            <View
              style={{
                width: 12,
                height: 12,
                borderWidth: 1,
                borderColor: 'maroon',
              }}
            />
          )}
          <Text>Remember Me</Text>
        </TouchableOpacity>
        <Text>Forgot Password?</Text>
      </View>
      <TextButton
        label={'Continue'}
        onPress={() => SignInUser()}
        disabled={!isSignInEnabled()}
        containerStyle={{
          backgroundColor: isSignInEnabled() ? 'maroon' : 'gray',
        }}
      />

      <View style={{flexDirection: 'row', gap: 5, justifyContent: 'center'}}>
        <Text style={{fontSize: 14}}>New to Vibra?</Text>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('SignUp')}>
          <Text style={{color: 'maroon', fontSize: 14}}>Sign Up</Text>
        </TouchableWithoutFeedback>
      </View>
      <View
        style={{
          marginVertical: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{flex: 1, backgroundColor: 'maroon', height: 2}} />
          <Text>Or</Text>
          <View style={{flex: 1, backgroundColor: 'maroon', height: 2}} />
        </View>
        <Text>Continue with</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {/* Facebook  */}
        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: 'maroon',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../../assets/icons/facebook.png')}
            resizeMode="contain"
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
        {/* Google  */}
        <TouchableOpacity
          onPress={() => onGoogleButtonPress()}
          style={{
            height: 40,
            width: 40,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: 'maroon',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../../assets/icons/google.png')}
            resizeMode="contain"
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
        {/* Twitter  */}
        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: 'maroon',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../../assets/icons/twitter.png')}
            resizeMode="contain"
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
});
