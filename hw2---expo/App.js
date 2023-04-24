import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FaceDetector from 'expo-face-detector';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const [camera, setCamera] = useState({
    hasCameraPermission: null,
    type: Camera.Constants.Type.front,
  });
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [faces, setFaces] = useState([]);
  const cameraRef = useRef(null);



  useEffect(() => {
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      setCamera((prevState) => ({
        ...prevState,
        hasCameraPermission: status === 'granted',
      }));
    })();
}, []);

async function takePicture() {
  if (cameraRef.current) {
    const options = { quality: 0.85, base64: true };
    const data = await cameraRef.current.takePictureAsync(options);
    if (photo == null) {
    setPhoto(data.uri);
    setIsCameraVisible(true);
  } else {
    setPhoto2(data.uri);
    setIsCameraVisible(true);
  }
}
}

if (camera.hasCameraPermission === null) {
  return <View />;
} else if (camera.hasCameraPermission === false) {
  return <Text>No access to camera</Text>;
} else {
  return (
<View style={styles.container}>
  {isCameraVisible ? (
    <View style={{ position: "relative", flex: 1 }}>
      <Camera
        style={styles.camera}
        type={camera.type}
        ref={cameraRef}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
          minDetectionInterval: 1,
          tracking: false
        }}
        onFacesDetected={({ faces }) => {
          setFaces(faces);
        }}
      >
      <View style={styles.view}>
        <TouchableOpacity
        style={styles.touchableOpacity}
        onPress={() => {
          setCamera({
            ...camera,
            type:
              camera.type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back,
          });
        }}>
        <Text style={styles.text}>Flip Camera</Text>
       </TouchableOpacity>
       <TouchableOpacity
        style={styles.touchableOpacity}
        onPress={takePicture}>
        <Text style={styles.text}>Take two  pictures</Text>
       </TouchableOpacity>
       <TouchableOpacity
        style={styles.touchableOpacity}
        onPress={() => {setPhoto(null), setPhoto2(null)}}>
        <Text style={styles.text}>Clean  all</Text>
       </TouchableOpacity>
      </View>
    </Camera>
  {faces.map(({ bounds }, i) => {
    return (
      <View
        key={i}
        style={[
          styles.faceBox,
          {
            width: bounds.size.width,
            height: bounds.size.height,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]}
      />
    );
  })}
  </View>
) : (
  <View style={styles.view}>
    <TouchableOpacity
      style={styles.homeButton}
      onPress={() => setIsCameraVisible(true)}>
      <Text style={styles.homeButtonText}> Tap to start </Text>
    </TouchableOpacity>
  </View>
)}
{photo && (
  <View style={styles.view}>
    <Image source={{ uri: photo }} style={styles.image} />
    <Image source={{ uri: photo2 }} style={styles.image} />
    <Text style={styles.text2}>Click the image to save</Text>
    {faces.map(({ bounds }, i) => {
  })}

</View>
)}
</View>

);

  }
}


const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#fff',
},
  camera: {
    flex: 1,
},
view: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
},
touchableOpacity: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'column',
    paddingLeft: 10,
    paddingBottom: 10,
},
text: {
    fontSize: 10,
    marginBottom: 20,
    padding: 20,
    color: 'white',
},
text2: {
    flex:1,
    fontSize: 15,
    marginBottom: 20,
    padding: 20,
    color: 'black',    
},
image: {
    display: 'center',
    flexDirection: 'center',
    flexWrap: 'nowrap',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    marginTop: 10,
    marginBottom: 10,
},
homeButton: {
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 50,
},
homeButtonText: {
    borderRadius: 50,
    padding: 10,
    color: 'white',
    fontSize: 18,
},
faceBox: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "#89ff00",
    borderStyle: "solid",
    zIndex: 9,
  },
});