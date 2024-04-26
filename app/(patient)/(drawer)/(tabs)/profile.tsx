import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { useState } from "react";
import Palette from "../../../../Constants/Palette";
import { Dimensions } from "react-native";
import { Image, StyleSheet } from "react-native";
import ProfileStatus from "../../../../components/profilestatus";
import ProfileDetails from "../../../../components/profiledetails";


const Profile = () => {
    const [usertype, setusertype] = useState("Patient");


    return  usertype==="Patient"? (
               <View style={{flex: 1, backgroundColor: Palette.accent}}>
                    <View style={styles.header}>
                        <Image style={styles.image} source={{uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}}/>
                        <Text style={styles.name}>John Doe</Text>
                        <Text style={styles.number}>+639951923729</Text>
                    </View>
                    <ScrollView style={styles.details}>
                        <View style={styles.statusheader}>
                            <ProfileStatus title="Submitted" detail={10}/>
                            <ProfileStatus title="Pending" detail={50}/>
                            <ProfileStatus title="Missing" detail={0}/>
                        </View>
                        <ProfileDetails title="Program" detail={"Placeholder program"}/>
                        <ProfileDetails title="Assigned DOTS Center" detail={"Placeholder center"}/>
                        <ProfileDetails title="Email" detail={"johndoe@gmail.com"}/>
                        <ProfileDetails title="Age" detail={25}/>
                        <ProfileDetails title="Gender" detail={"Male"}/>
                        <ProfileDetails title="Blood Type" detail={"AB-"}/>
                        <ProfileDetails title="Height" detail={168+" cm"}/>
                        <ProfileDetails title="Weight" detail={50 + " kg"}/>
                        <ProfileDetails title="Date of Birth" detail={"June 19, 1998"}/>
                        <ProfileDetails title="Address" detail={"Placeholder Address"}/>
                        
                    </ScrollView>
               </View>
            ):(
                <View>

                </View>
            )
            
}

const styles = StyleSheet.create({
    image: {
        height: 150,
        width: 150,
        borderRadius: 100,
        alignSelf: 'center'
    },
    header:{
        backgroundColor: 'transparent',
        alignItems: 'center',
        margin: 20
    },
    name: {
        fontFamily: 'Heading',
        fontSize: 25,
        color: 'white',
        marginTop: 10
    },
    number:{
        color: 'white',
        fontFamily: 'Poppins',
        fontSize: 16,
    },
    details:{
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        backgroundColor: Palette.buttonOrLines
    },
    statusheader:{
        flexDirection: 'row',
        margin: 20,
        backgroundColor: 'transparent'
    }
})
export default Profile;