import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, Alert, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { ResizeMode, Video } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { CameraType } from 'expo-camera/build/legacy/Camera.types';
import { supabase } from '../../supabase';
import { useLocalSearchParams } from "expo-router";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { router } from 'expo-router';
import { useUserData } from './_layout';
import Palette from '../../Constants/Palette';

interface VideoAsset {
  uri: string;
  type: string;
  assetId: string; // Change to non-nullable string
}

export default function RecordVideo() {
  let cameraRef = useRef<CameraView>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState<boolean | undefined>();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | undefined>();
  const [uploading, setUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState<string | undefined>();
  const [facing, setFacing] = useState<CameraType>(CameraType.back);
  const params = useLocalSearchParams();
  const {submissionid} = params;
  const {user} = useUserData()


  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted.</Text>;
  }

  let recordVideo = async() => {
    setIsRecording(true)
    if(cameraRef.current){
        try{
            const data = await cameraRef.current.recordAsync();
            
            setVideo(data?.uri)
        } catch(e){
            console.error(e);
        }
    }

  };

  let stopRecording = async() => {
    await cameraRef.current?.stopRecording();
      setIsRecording(false);
  };

  if (video) {

  //   async function getPendingDetails() {
    
  //     const date = new Date().toISOString();
  //     try {
  //         if (user?.id === null || user?.id === "") {
  //             throw new Error('No user logged in');
  //         } else {
  //             const { data, error, status } = await supabase
  //                 .from('submissions')
  //                 .select()
  //                 .eq("patientid", user?.id) 
  //                 .gte("deadline", date)


  //             if (error && status !== 406) {
  //                 throw error;
  //             }

  //             if (data) {
  //                 data.sort((a, b) => a.number - b.number)
  //             }
  //         }
  //     } catch (error) {
  //         if (error instanceof Error) {
  //             Alert.alert(error.message)
  //         }
  //     }  
  // }

    //function that will update the submission with the id of the video submitted
    const updateSubmission = async (videopath: string, creationDate: Date) => {
      const date = new Date().toISOString();
      try{
          const {error} = await supabase
          .from('submissions')
          .update({videopath: videopath, status: "TRUE", date_submitted: date, video_taken: creationDate})
          .eq("id", submissionid)

          if(error){
            
            console.log("Failed to update the submission bin")
        
          } else{
            // getPendingDetails()
            router.navigate('patientdashboard')
           
          }
          
          
      }catch(error){
        if(error instanceof Error) console.log(error.message)
      }

    }


    const submitVideo = async() => {
      saveVideo()
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
      };

      const result = await ImagePicker.launchImageLibraryAsync(options);

      if(!result.canceled){
        const img = result.assets[0] as VideoAsset;
        const base64 = await FileSystem.readAsStringAsync(img.uri, {encoding: 'base64'});
        const filePath = `${submissionid}.${img.type === 'image' ? 'png' : 'mp4'}`;
        const contentType = img.type === 'image' ? 'image/png' : 'video/mp4'

  

        setUploading(true)
        try{
          const assetInfo = await MediaLibrary.getAssetInfoAsync(img.assetId);
        
          const creationDate = new Date(assetInfo.creationTime)
          const {data, error} = await supabase.storage
          .from("videos")
          .upload(filePath, decode(base64), { contentType});
          // await loadImages()
          if(error) console.log(error)
          

          if(data) updateSubmission(data?.path, creationDate)
          setUploading(false)
          Alert.alert("Successfully submitted video")
          router.replace('/patientdashboard')
          router.push('/submissionbin')
        }catch(error){
          if(error instanceof Error)console.log(error.message)
        }
      }
    }

    const saveVideo = () => {
      MediaLibrary.saveToLibraryAsync(video).then(() => {
        setVideo(undefined);
      });
    };


    if(uploading){
      return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }

    return (
      
      <SafeAreaView style={styles.container}>
        {uploading && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Uploading Video</Text>
          </View>
        )}
        <Video
          style={styles.video}
          source={{ uri: video }}
          resizeMode={ResizeMode.COVER}
          isLooping
          
        />
        <View style={{flexDirection: 'row', alignItems: 'center', height: '10%', justifyContent: 'center', alignContent: 'center'}}>
          <TouchableOpacity onPress={submitVideo} style={{backgroundColor: Palette.accent, alignItems: 'center', flex: 1, borderRadius: 20, height: '95%', justifyContent: 'center', marginHorizontal: 5}}>
              <Text style={{fontFamily: 'Poppins', fontSize: 16, color: 'white'}}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> setVideo(undefined)} style={{backgroundColor: Palette.buttonOrLines, alignItems: 'center', flex: 1, borderRadius: 20, height: '95%', justifyContent: 'center', marginHorizontal: 5}}>
            <Text style={{fontFamily: 'Poppins', fontSize: 16, color: 'white'}}>Discard</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={styles.container}>
       {uploading && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Uploading Video</Text>
          </View>
      )}
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} mode='video'>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          {!isRecording? (
            <TouchableOpacity style={styles.button} onPress={recordVideo}>
            <Text style={styles.text}>Record Video</Text>
          </TouchableOpacity>
          ):(
            <TouchableOpacity style={styles.button} onPress={stopRecording}>
            <Text style={styles.text}>Stop Recording</Text>
          </TouchableOpacity>
          )}
          
          
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  video: {
    height: '90%',
    alignSelf: "stretch"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
