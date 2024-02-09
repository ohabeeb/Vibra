/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  ToastAndroid,
} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';

export default function EditProfile({navigation}) {
  const [image, setImage] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [transferred, setTransferred] = React.useState(0);


  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [aboutMe, setaboutMe] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [city, setCity] = React.useState('');
  const [userData, setUserData] = React.useState(null);
  const [refresh, setRefresh] = React.useState(false);

  async function getUser() {
    const currentUser = await firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
  }

  React.useEffect(() => {
    getUser();
  }, [refresh]);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 1200,
      height: 780,
      cropping: true,
    })
      .then(result => {
        const imageUrl = Platform.OS === 'ios' ? result.sourceURL : result.path;
        setImage(imageUrl);
      })
      .catch(e => console.log(e));
  };
  const takePhotoFromGalary = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      cropping: true,
    })
      .then(result => {
        const imageUrl = Platform.OS === 'ios' ? result.sourceURL : result.path;
        setImage(imageUrl);
      })
      .catch(e => console.log(e));
  };

  async function handledPostImage() {
    if (image === null) {
      return null;
    }
    const uploadUrl = image;
    let fileName = uploadUrl.substring(uploadUrl.lastIndexOf('/') + 1);

    // Append Timestamp to File Name - Start
    const extention = fileName.split('.').pop();
    const name = fileName.split('.').slice(0, -1).join('.');
    fileName = name + Date.now() + '.' + extention;
    // Append Timestamp to File Name - End

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${fileName}`);
    const task = storageRef.putFile(uploadUrl);
    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );
      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });
    try {
      await task;
      const url = await storageRef.getDownloadURL();

      setUploading(false);
      // Alert.alert('Status', 'Post uploaded successfully.');
      setImage(null);
      console.log(url);
      return url;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async function updateProfile() {
    const imageUrl = await handledPostImage();
    if (imageUrl === null && userData?.profileImage) {
      imageUrl = userData?.profileImage;
    }
    await firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .update({
        profileImage: imageUrl,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        aboutMe: userData?.aboutMe,
        phone: userData?.phone,
        country: userData?.country,
        city: userData?.city,
      })
      .then(
        ToastAndroid.showWithGravity(
          'YourProfile has been updated successfuly.',
          5000,
          ToastAndroid.TOP,
        ),
      )
      .catch(e => console.log(e));
  }

  function renderHeader() {
    return (
      <View style={{flex: 0.5, marginTop: 20}}>
        <TouchableOpacity
          style={{paddingVertical: 5}}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="west" size={25} color={'maroon'} />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={takePhotoFromCamera}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: 'maroon'
            }}>
            <Image
              source={{uri: userData ? userData?.profileImage : null}}
              style={{width: '100%', height: '100%', borderRadius: 50}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  function renderForm() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={{flexDirection: 'row', gap: 5, marginVertical: 5}}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              borderRadius: 20,
            }}>
            <MaterialIcons name="person" size={25} color={'maroon'} />
          </View>
          <TextInput
            style={{
              flex: 1,
              height: 40,
              borderBottomWidth: 1,
              borderBottomColor: 'lightgray',
            }}
            value={userData ? userData?.firstName : ''}
            placeholder="First name"
            onChangeText={value => setUserData({...userData, firstName: value})}
          />
        </View>
        <View style={{flexDirection: 'row', gap: 5, marginVertical: 5}}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              borderRadius: 20,
            }}>
            <MaterialIcons name="person" size={25} color={'maroon'} />
          </View>
          <TextInput
            style={{
              flex: 1,
              height: 40,
              borderBottomWidth: 1,
              borderBottomColor: 'lightgray',
            }}
            placeholder="Last name"
            value={userData ? userData.lastName : ''}
            onChangeText={value => setUserData({...userData, lastName: value})}
          />
        </View>
        <View style={{flexDirection: 'row', gap: 5, marginVertical: 5}}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              borderRadius: 20,
            }}>
            <MaterialIcons name="phone" size={25} color={'maroon'} />
          </View>
          <TextInput
            style={{
              flex: 1,
              height: 40,
              borderBottomWidth: 1,
              borderBottomColor: 'lightgray',
            }}
            placeholder="Phone"
            value={userData ? userData.phone : ''}
            onChangeText={value => setUserData({...userData, phone: value})}
          />
        </View>
        <View style={{flexDirection: 'row', gap: 5, marginVertical: 5}}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              borderRadius: 20,
            }}>
            <MaterialIcons name="note" size={25} color={'maroon'} />
          </View>
          <TextInput
            style={{
              flex: 1,
              height: 40,
              borderBottomWidth: 1,
              borderBottomColor: 'lightgray',
              minHeight: 100,
              textAlignVertical: 'top',
            }}
            multiline={true}
            maxLength={80}
            placeholder="About Me"
            value={userData ? userData.aboutMe : ''}
            onChangeText={value => setUserData({...userData, aboutMe: value})}
          />
        </View>
        <View style={{flexDirection: 'row', gap: 5, marginVertical: 5}}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              borderRadius: 20,
            }}>
            <MaterialIcons name="map" size={25} color={'maroon'} />
          </View>
          <TextInput
            style={{
              flex: 1,
              height: 40,
              borderBottomWidth: 1,
              borderBottomColor: 'lightgray',
            }}
            placeholder="Country"
            value={userData ? userData.country : ''}
            onChangeText={value => setUserData({...userData, country: value})}
          />
        </View>
        <View style={{flexDirection: 'row', gap: 5, marginVertical: 5}}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              borderRadius: 20,
            }}>
            <MaterialIcons name="location-on" size={25} color={'maroon'} />
          </View>
          <TextInput
            style={{
              flex: 1,
              height: 40,
              borderBottomWidth: 1,
              borderBottomColor: 'lightgray',
            }}
            placeholder="City"
            value={userData ? userData.city : ''}
            onChangeText={value => setUserData({...userData, city: value})}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            updateProfile();
            setRefresh(true);
          }}
          style={{
            backgroundColor: 'maroon',
            alignItems: 'center',
            paddingVertical: 15,
            marginVertical: 20,
          }}>
          <Text style={{fontSize: 16, color: '#FFF'}}>Upload</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
  return (
    <SafeAreaView
      style={{flex: 1, paddingHorizontal: 20, justifyContent: 'center'}}>
      {renderHeader()}
      {renderForm()}
    </SafeAreaView>
  );
}
