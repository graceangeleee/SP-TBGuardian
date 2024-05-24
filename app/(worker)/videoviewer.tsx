import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Alert} from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { supabase } from '../../supabase';
import { useLocalSearchParams, router } from 'expo-router';
import Palette from '../../Constants/Palette';
import { useWorkerData } from './_layout';


// interface VideoPlayerProps {
//   videoId: string;
// }

const VideoPlayer: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading]  = useState<boolean>(true);
  const params = useLocalSearchParams();
  const {videoId, submissionid, patientid} = params;

  useEffect(() => {
    async function fetchVideoUrl() {
      try {
        setLoading(true);
        if(typeof(videoId) === "string"){
        const { data, error } = await supabase.storage
          .from('videos')
          .createSignedUrl(videoId, 60 * 60); // Replace 'videos' with your Supabase storage bucket name
        
          if (error) {
          throw error;
        }
        setVideoUrl(data?.signedUrl || null);
      }
      } catch (error) {
        if(error instanceof Error)console.error('Error fetching video URL:', error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVideoUrl();
  }, [videoId]);

  const verifySubmission = async () => {
    try{
      const {error} = await supabase
      .from('submissions')
      .update({verified: "TRUE"})
      .eq("id", submissionid)

      if(error) {
        console.log("Failed to update the submission bin")
      }else{
        const {data, error, status} = await supabase
        .from('users')
        .select('to_submit')
        .eq('id', patientid)
        .single()

        if(data){
          const nextValue = data.to_submit-1
          const {error} = await supabase
          .from('users')
          .update({to_submit: nextValue})
          .eq('id', patientid)

          if(error){
            if(error instanceof Error)console.log(error.message)
          }else{

            Alert.alert("Successfully verified submission")

          }
        }
      }

      router.navigate("/workerdashboard")
      router.push("/dailysubmissions")
      
    }catch(error){
      if(error instanceof Error) console.log(error.message)
    }
  }


//   async function getVerified(){
//     setLoading(true)
//     const date = new Date().toISOString();

//     try{
//         const { data, error, status } = await supabase
//         .from('submissions')
//         .select()
//         .eq("status", "TRUE")
//         .eq("verified", "TRUE")

//         if(error && status !== 406){
//             throw error;
//         }

//         if(data){
//             setVerified(data) 
//         }
//     }catch (error){
//         if(error instanceof Error){
//             Alert.alert(error.message)
//         }
//     }finally{
//         setLoading(false)
//     }
// }

// async function getUnverified(){
//     setLoading(true)
//     const date = new Date().toISOString();

//     try{
//         const { data, error, status } = await supabase
//         .from('submissions')
//         .select()
//         .eq("status", "TRUE")
//         .eq("verified", "FALSE")

//         if(error && status !== 406){
//             throw error;
//         }

//         if(data){
//             setUnverified(data) 
//         }
//     }catch (error){
//         if(error instanceof Error){
//             Alert.alert(error.message)
//         }
//     }finally{
//         setLoading(false)
//     }
// }
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!videoUrl) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading video</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Video
        source={{ uri: videoUrl }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        useNativeControls
        isLooping
        style={{ width: '100%', height: '90%' }}
      />
      <TouchableOpacity onPress={verifySubmission} style={{backgroundColor: Palette.buttonOrLines,margin: 10, width: '90%', borderRadius: 20, height: '10%', alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontFamily: 'Poppins', color: 'white', fontSize: 16}}>Verify Submission</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VideoPlayer;
