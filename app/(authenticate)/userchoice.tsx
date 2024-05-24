import { StyleSheet, StyleProp, TouchableOpacity, ViewStyle, GestureResponderEvent, Image, View, Text, SafeAreaView} from 'react-native';
import { Dimensions } from 'react-native';
import { useState } from 'react';
import { useNavigation, Link, router, Redirect } from 'expo-router';



export default function Landing() {
    const [height, setScreenHeight] = useState(Dimensions.get('window').height);
    const [width, setScreenWidth] = useState(Dimensions.get('window').width);
    const navigation = useNavigation();
    

    const handleButtonPress = (login_type:string) => {
      navigation.navigate(login_type as never)
    }

    return(

    
    <SafeAreaView style={styles.main}>
         <View style={[styles.card, {flex: 3.5}]}>
         {/* <Image source={require('C:\Users\grace\Desktop\TBGuardian\TBGuardian\assets\images\placeholder_icon.png.png')} /> */}
            <Text style={[styles.appname, {paddingTop: height*0.4}]}>TBGuardian</Text>
        </View>
        <Text style={styles.chooseText}>Choose account type</Text>
        <View style={styles.buttonContainer}>

        {/* <Link href="/workerlogin" asChild> */}
    
        <TouchableOpacity onPress={() => router.push("/patientlogin")} style={styles.patientbutton}>
        {/* <TouchableOpacity style={[styles.button, {backgroundColor: '#023047'}]}> */}
            <Text style={styles.buttonText}>Login as Patient</Text>
        </TouchableOpacity>
        {/* </Link> */}


        <TouchableOpacity onPress={() => router.push("/workerlogin")} style={styles.workerbutton}>
            <Text style={styles.buttonText}>Login as Healthcare Worker / Admin</Text>
        </TouchableOpacity>

   
  
        </View>
        <View style={styles.footer}></View>
      </SafeAreaView>
      )
}

const styles = StyleSheet.create({
    main:{
      flexDirection: 'column',
      flex: 1
    },
    appname:{
        fontSize: 48,
        fontFamily: 'AppName',
        color: 'white',
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center'
    },
    card:{
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
        backgroundColor: '#219EBC'
    },
    patientbutton:{
      borderRadius: 60,
      padding: 25,
      alignContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginHorizontal: 20,
      backgroundColor: "#023047"
  
    },
    workerbutton:{
        borderRadius: 60,
        padding: 25,
        alignContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 20,
        backgroundColor: "#FB8500"
    },
    buttonText: {
      fontFamily: "Poppins",
      fontSize: 14,
      color: 'white'
    },
    buttonContainer:{
      marginTop: 30,
      flex: 2.5
    },
    chooseText:{
      fontSize: 30,
      fontFamily: 'Heading',
      alignSelf: 'center',
      marginTop: 30,
      flex: 0.5
    },
    footer:{
      backgroundColor: '#219EBC',
      height: 70,
      position: 'absolute',
      alignSelf: 'flex-end',
      bottom: 0,
      left:0,
      right:0
    }
  })