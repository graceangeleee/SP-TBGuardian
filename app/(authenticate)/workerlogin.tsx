import { StyleSheet, TextInput, Button, Pressable, View, Text, Alert, AppState, ActivityIndicator} from 'react-native';
import { useState, useEffect } from 'react';
import Palette from '../../Constants/Palette';
import { router } from 'expo-router';
import { supabase } from '../../supabase';
import * as SecureStore from 'expo-secure-store';


// AppState.addEventListener('change', (state) => {
//     if (state === 'active') {
//       supabase.auth.startAutoRefresh()
//     } else {
//       supabase.auth.stopAutoRefresh()
//     }
// })

  const WorkerLogin = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nameFocus, setNameFocus] = useState(false);
    const [passFocus, setPassFocus] = useState(false);
    const [loading, setLoading] = useState(false);
    


    // useEffect(() => {
    //     const checkLogin = async () => {
    //         try{
    //             const token = await AsyncStorage.getItem("authToken");
    //             if(token){
    //                 router.replace("/(home)")
    //             }
    //         } catch(error){
    //             console.log(error);
    //         }
    //     }
    // }, [])

    async function signInWithEmail() {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: username,
                password: password,
            });
    
            if(data && data.session?.user.id){
                // console.log(data)
                // console.log("Logged in");
                await SecureStore.setItem("id", data.session.user.id)
                router.replace("/(worker)/(tabs)/workerdashboard");
            }else{
                Alert.alert("Please enter correct email and password")
            }
            
        } catch (error) {
            Alert.alert("Please enter correct email and password");
        } finally {
            setLoading(false);
        }
    }
    
    
    return (
      <View style={styles.main}>
        <Text style={styles.welcome}>Welcome back</Text>
        <View style={styles.inputcontainer}>
            <TextInput onFocus={()=> setNameFocus(true)} 
                onBlur={()=> setNameFocus(false)} 
                style={styles.inputfield} 
                placeholder='Username' 
                onChangeText={setUsername}/>
            <TextInput onFocus={() => setPassFocus(true)} 
                onBlur={() => setPassFocus(false)} 
                style={styles.inputfield} 
                textContentType='password'
                placeholder='Password' 
                secureTextEntry={true}
                onChangeText={setPassword}/>
            {loading? (
                <View style={styles.loginbutton}>
                    <ActivityIndicator/>
                </View>
            ): (
                <Pressable onPress={signInWithEmail} style={styles.loginbutton}>
                
                    <Text style={{color: 'white', fontSize: 16, fontFamily: 'Poppins'}}>Login</Text>
                </Pressable>
            )}
           
        </View>
        <View style={styles.footer}></View>
      </View>
    );
  }
  
  export default WorkerLogin;

const styles = StyleSheet.create({
    main:{
        flexDirection: 'column',
        flex: 1
    },
    welcome:{
        fontFamily:'Heading',
        fontSize: 30,
        marginLeft: '7%',
        marginTop: 40
    },
    footer:{
        backgroundColor: '#219EBC',
        height: 70,
        position: 'absolute',
        alignSelf: 'flex-end',
        bottom: 0,
        left:0,
        right:0
    },
    inputfield:{
        fontFamily: 'Poppins',
        color: 'black',
        fontSize: 16,
        borderWidth: 1,
        paddingHorizontal: 25,
        paddingVertical: 15,
        marginHorizontal: 20,
        borderRadius: 60,
        alignContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    focus:{
        borderColor: Palette.focused,
        color: Palette.focused,
    },
    inputcontainer:{
        marginTop: 10
    },
    loginbutton:{
        marginHorizontal: 20,
        backgroundColor: Palette.buttonOrLines,
        borderRadius: 60,
        paddingHorizontal: 25,
        paddingVertical: 15,
        marginTop: 20,
        alignItems: 'center',
        alignContent: 'center'
    }

})
  

// export default function Login () {
//     return (
//         <View>

//         </View>
//     )
// }