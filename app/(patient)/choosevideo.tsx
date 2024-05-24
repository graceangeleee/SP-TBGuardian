import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { CameraType } from 'expo-camera/build/legacy/Camera.types';
import { supabase } from '../../supabase';
import { useLocalSearchParams } from "expo-router";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { router } from 'expo-router';
import Palette from '../../Constants/Palette';
import * as MediaLibrary from 'expo-media-library';

interface LocalSearchParams {
  submissionid: string;
}

interface VideoAsset {
  uri: string;
  type: string;
  assetId: string;
}

export default function ChooseVideo() {
  const [uploading, setUploading] = useState(false);
  const params = useLocalSearchParams()
  const { submissionid } = params;

  const submitVideo = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      const img = result.assets[0] as VideoAsset;

      if (!img.assetId) {
        console.log("Asset ID is undefined");
        return;
      }

      const base64 = await FileSystem.readAsStringAsync(img.uri, { encoding: 'base64' });
      const filePath = `${submissionid}.${img.type === 'image' ? 'png' : 'mp4'}`;
      const contentType = img.type === 'image' ? 'image/png' : 'video/mp4';

      try {
        const assetInfo = await MediaLibrary.getAssetInfoAsync(img.assetId);
        
        const creationDate = new Date(assetInfo.creationTime)
  
        

        setUploading(true);
        const { data, error } = await supabase.storage
          .from("videos")
          .upload(filePath, decode(base64), { contentType });

        if (error) {
          console.log(error);
          return;
        }

        if (data) {
          await updateSubmission(data.path, creationDate);
        }

        setUploading(false);
        Alert.alert("Successfully submitted video");
        router.replace('/patientdashboard')
        router.push('missingsubmissions')
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
        setUploading(false);
      }
    }
  };

  // Function to update the submission with the video path and date
  const updateSubmission = async (videopath: string, creationDate: Date) => {
    const dateString = new Date().toISOString();
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ videopath, status: "TRUE", date_submitted: dateString, video_taken: creationDate })
        .eq("id", submissionid);

      if (error) {
        console.log("Failed to update the submission bin");
      } else {
        router.navigate('/patientdashboard');

      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {uploading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Uploading Video</Text>
        </View>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', height: '10%', justifyContent: 'center', alignContent: 'center' }}>
        <TouchableOpacity onPress={submitVideo} style={{ backgroundColor: Palette.accent, alignItems: 'center', flex: 1, borderRadius: 20, height: '95%', justifyContent: 'center', marginHorizontal: 5 }}>
          <Text style={{ fontFamily: 'Poppins', fontSize: 16, color: 'white' }}>Choose Video To Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
