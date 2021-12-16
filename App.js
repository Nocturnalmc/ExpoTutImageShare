import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View }
from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';

//please remove this splash screen later
//import * as SplashScreen from 'expo-splash-screen';
//SplashScreen.preventAutoHideAsync();
//setTimeout(SplashScreen.hideAsync, 5000);
//please remove this splash screen later

export default function App() {
  let [selectedImage, setSelectedImage] = React.useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    if (Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri)
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    } else {
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
    }
  }

  let openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert("The image is available for sharing at : ${selectedImage.remoteUri}");
      return ;
    }

    await Sharing.shareAsync(selectedImage.localUri);
  }
  if (selectedImage !== null) {
    return ( // second page
      <View style={styles.container}>
      	<StatusBar style='auto' />
        <Image source={{ uri: selectedImage.localUri }} style={styles.thumbnail} />
        <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>
          <Text style={styles.buttonText}>Share this photo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
  	      <Text style={styles.buttonText}>Re-select photo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {setSelectedImage(selectedImage=null)}} style={styles.button} >
          <Text style={styles.buttonText}>Return to main page</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return ( // first page
    <View style={styles.container}>
	    <StatusBar style='auto' />
      <Image source={{uri: "https://i.imgur.com/TkIrScD.png"}} style={styles.logo} />
      <Text style={styles.instruction}>
        To share a photo from your phone with a friend, just press the button below !
      </Text>
      <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
        <Text style={styles.buttonText}>Pick a photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 10,
  },
  instruction: {
    color: '#888',
    fontSize: 18,
    marginHorizontal: 15,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 20,
		marginBottom: 10,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  }
});
