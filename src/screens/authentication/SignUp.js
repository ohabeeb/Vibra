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
  Alert,
} from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {FormInput, TextButton} from '../../components';
import firestore from '@react-native-firebase/firestore';

export default function SignUp({navigation}) {
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [email, setEmial] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [errorMessage, setErrorMesseage] = React.useState('');

  const isSignUpEnabled = () => {
    return (
      confirmPassword !== '' &&
      email !== '' &&
      password !== '' &&
      errorMessage === ''
    );
  };

  const SignUpUser = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        firestore()
          .collection('Users')
          .doc(auth().currentUser.uid)
          .set({
            firstName: '',
            lastName: '',
            email: email,
            createdAt: firestore.Timestamp.fromDate(new Date()),
            profileImage: null,
          });
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

        if (error.code === 'auth/weak-password') {
          Alert.alert(
            'Weak Password',
            ' Password should be at least 6 characters',
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

        <Text style={{fontSize: 16, marginTop: 10}}>Let's sign you up!</Text>
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
        <FormInput
          label={'Confirm Password'}
          placeholder={'confirm password'}
          secureTextEntry={true}
          onChangeText={value => setConfirmPassword(value)}
        />
      </KeyboardAvoidingView>
      <TextButton
        label={'Continue'}
        onPress={() => SignUpUser()}
        disabled={!isSignUpEnabled()}
        containerStyle={{
          backgroundColor: isSignUpEnabled() ? 'maroon' : 'gray',
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          gap: 5,
          justifyContent: 'center',
          marginBottom: 10,
        }}>
        <Text style={{fontSize: 14}}>Not new to Vibra?</Text>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Text style={{color: 'maroon', fontSize: 14}}>Sign In</Text>
        </TouchableWithoutFeedback>
      </View>
      <View>
        <Text style={{fontSize: 12, textAlign: 'justify', lineHeight: 18}}>
          By registering, you confirm that you accept our{' '}
          <TouchableWithoutFeedback>
            <Text style={{color: 'maroon'}}>Terms of Service</Text>
          </TouchableWithoutFeedback>{' '}
          and
          <TouchableWithoutFeedback>
            <Text style={{color: 'maroon'}}> Privacy Policy</Text>
          </TouchableWithoutFeedback>
          .
        </Text>
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
