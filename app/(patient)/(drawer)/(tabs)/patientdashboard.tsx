import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import { Redirect } from 'expo-router';
import { useState } from "react";
import Palette from '../../../../Constants/Palette';
import { FontAwesome } from '@expo/vector-icons';
// import { TouchableOpacity } from "react-native-gesture-handler";
import { Link } from "expo-router";


export default function PatientDashboard() {
const [percentage, setPercentage] = useState(50)
const [usertype, setUserType]= useState("Patient")
const [rewards, setRewards] = useState(23);
const [monitoring, setMonitoring] = useState(20);
const [done, setDone] = useState(15);
const [missing, setMissing] = useState(8);
  return (
    <ScrollView>
                {/* <View style={{position: 'absolute', height: 200, width: 100, backgroundColor: Palette.background, borderBottomLeftRadius: 90}}>

                </View> */}
                <View style={styles.statuscontainer}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={[styles.statustext, {flex: 2.5}]}>Status </Text>
                        <View style={{flex: 1}}>
                            <View style={[styles.percentage, styles.elevation]}>
                                <Text style={styles.status}>{percentage}%</Text> 
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.horizontalcontainer}>
                    <View style={[styles.colcontainer, {backgroundColor: Palette.shadowAccent}, styles.shadowprop, styles.elevation]}>
                        <View style={{ backgroundColor: Palette.shadowAccent, flex: 2}}>
                            <View style={{flexDirection: 'row', backgroundColor: Palette.shadowAccent, alignItems: 'center'}}>
                                <FontAwesome style={{marginRight: 10}} name="tasks" size={24} color={'white'} />
                                <Text style={styles.detailheader}>Next</Text>
                            </View>
                            <Text style={styles.detailheader}>submission</Text>
                            <Text style={styles.details}>Placeholder Date</Text>
                        </View>
                        <Link href="/submissionbin" asChild style={styles.button}>
                            <TouchableOpacity >
                                <Text style={styles.buttontext}>Submit</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                    <View style={[styles.colcontainer, {backgroundColor: Palette.buttonOrLines}, styles.shadowprop, styles.elevation]}>
                        <View style={{flexDirection: 'row', backgroundColor: Palette.buttonOrLines, alignItems: 'center'}}>
                            <FontAwesome style={{marginRight: 10}} name="exclamation-triangle" size={24} color={'white'} />
                            <Text style={styles.detailheader}>Reminders</Text>
                        </View>
                        
                        <Text style={styles.details}>Placeholder Date</Text>
                    </View>
                    
                </View> 
                <View style={[styles.rewardscontainer, styles.elevation]}>
                    <View style={{flexDirection: "row", alignItems: 'center'}}>
                        <View style={{flex: 1,flexDirection: 'row', alignItems: 'center'}}>
                            <FontAwesome name="star" size={30} color={Palette.accent} />
                            <Text style={styles.rewardsearned}>{rewards}/100</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.reward}>{100-rewards}</Text>
                            <FontAwesome style={{marginLeft: 5, marginRight: 5}} name="star" size={20} color={Palette.accent} />
                            <Text style={styles.reward}>to a reward</Text>
                        </View>
                    </View>
   
                        {/* <View style={{height: 8, alignContent: 'center', backgroundColor: Palette.buttonOrLines, marginTop: 20, marginBottom: 10, borderRadius: 90, overflow:'visible'}}>
                            <View style={{height:20, width: 20, backgroundColor: Palette.accent, borderRadius: 90, flex: 1, position: 'absolute'}}></View>
                            <View style={{height:20, width: 20, backgroundColor: Palette.accent, borderRadius: 90, flex: 1, position: 'absolute'}}></View>

                        </View>
  */}
                    <Text style={[styles.rewardins, {alignSelf: 'center'}]}>Earn reward points by complying to your medication and submitting videos on time</Text>
                    <Link href='/(drawer)/(tabs)/rewards' asChild style={[styles.button, {marginTop: 10,}]}>
                        <TouchableOpacity >
                            <Text style={styles.buttontext}>Show rewards</Text>
                        </TouchableOpacity>
                    </Link>
                </View>     
            </ScrollView>
  )
}

const styles = StyleSheet.create({
    horizontalcontainer:{
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'rgba(52, 52, 52, alpha)'
    },
    colcontainer:{
        flex: 1,
        margin: 5,
        padding: 15,
        height: 250,
        borderRadius: 15,
    },
    rowcontainer:{
        height: 150,
        alignContent: 'center',
        alignItems: 'center',
        margin: 10,
        padding: 10,
        borderRadius: 15
    },
    rewardscontainer:{
        borderColor: Palette.buttonOrLines,
        borderWidth: 2,
        margin: 10,
        padding: 20,
        borderRadius: 15
    },
    percentage:{
        borderRadius: 90,
        height: 100,
        width: 100,
        backgroundColor: Palette.shadowAccent,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Palette.buttonOrLines,
        borderWidth: 4,
    },
    status:{
        // fontFamily: 'Heading',
        fontSize: 25,
        color: 'white'

    },
    statustext:{
        // fontFamily: 'Heading',
        fontSize: 20,
        alignSelf: 'center',
        marginLeft: 20,
        color: Palette.buttonOrLines
    },
    statuscontainer:{
        margin: 15,
        // borderColor: Palette.buttonOrLines,
        // borderWidth: 2,
        alignContent: 'center',
        borderRadius: 15,
    },
    details:{
        // fontFamily: 'Poppins',
        fontSize: 16,
        marginTop: 10,
        color: 'white'
    },
    rewardins:{
        // fontFamily: 'Poppins',
        fontSize: 16,
        marginTop: 10,
        color: Palette.buttonOrLines
    },
    shadowprop: {
        shadowColor: 'black',
        shadowOffset: {width: -2, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    elevation: {
        elevation: 10,
        shadowColor: '#52006A',
    },
    rewardsearned:{
        // fontFamily: 'Heading',
        fontSize: 20,
        marginLeft: 15
    },
    reward:{
        // fontFamily: 'Subheading',
        fontSize: 20,
    },
    detailheader:{
        // fontFamily: 'Heading',
        fontSize: 20,
        color: 'white'
    },
    button:{
        padding: 10,
        borderRadius: 60,
        backgroundColor: Palette.buttonOrLines,
        borderColor: 'white',
        borderWidth: 1
    },
    buttontext:{
        // fontFamily: 'Poppins',
        fontSize: 16,
        alignSelf: 'center',
        color: 'white'
    },
    workerdashboard:{
        // fontFamily: 'Heading',
        fontSize: 30,
        color: 'white'
    },
    count:{
        // fontFamily: 'Poppins',
        fontSize: 30,
        color: 'white'
    },
    addpatient:{
        alignSelf: 'flex-end',
        position: 'absolute',
        height: 80,
        width: 80,
        backgroundColor: Palette.buttonOrLines,
        borderRadius: 90,
        alignItems: 'center',
        alignContent: 'center'
    }
});
