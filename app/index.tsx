import { StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useFonts } from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

export default function App() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        AppName: require('../assets/fonts/Inter-ExtraBold.ttf'), //Inter
        Heading: require('../assets/fonts/OpenSans-ExtraBold.ttf'), //OpenSans Extra Bold
        Subheading: require('../assets/fonts/OpenSans-SemiBold.ttf'), //OpenSans SemiBold
        Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
        ...FontAwesome.font,
      });

    

      useEffect(() => {
        if (error) throw error;
      }, [error]);
    
      useEffect(() => {
        if (loaded) {
          SplashScreen.hideAsync();
        }
      }, [loaded]);
    
      if (!loaded) {
        return null;
      }
    
  return (
    <Redirect href={"/(authenticate)/userchoice"}/>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
