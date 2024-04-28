import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import { Redirect } from 'expo-router';
import { useState } from "react";
import Palette from '../../../../Constants/Palette';
import { FontAwesome } from '@expo/vector-icons';
// import { TouchableOpacity } from "react-native-gesture-handler";
import { Link } from "expo-router";


export default function WorkerDashboard() {

const [monitoring, setMonitoring] = useState(20);
const [done, setDone] = useState(15);
const [missing, setMissing] = useState(8);

  return (
    <ScrollView>
        <TouchableOpacity style={[styles.horizontalcontainer,{backgroundColor: Palette.focused, alignItems: 'center',  margin: 10, borderRadius: 15}]}>
            {/* <View style={[styles.horizontalcontainer, {backgroundColor: Palette.focused, alignItems: 'center'}]}> */}
                <View style={{backgroundColor: Palette.focused, flex: 1, alignItems: 'center'}}>
                    <View style={{backgroundColor: Palette.focused, borderColor: 'white', borderRadius: 90, borderWidth: 5, width: 90, height: 90, alignItems: 'center'}}>
                        <Text style={styles.count}>{monitoring}</Text>
                    </View>
                </View>
                <Text style={[{flex: 2}, styles.workerdashboard]}>MONITORING</Text>
            {/* </View> */}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.horizontalcontainer,{backgroundColor: Palette.shadowAccent, alignItems: 'center',  margin: 10, borderRadius: 15}]}>
            {/* <View style={[styles.horizontalcontainer, {backgroundColor: Palette.focused, alignItems: 'center'}]}> */}
                <View style={{backgroundColor: Palette.shadowAccent, flex: 1, alignItems: 'center'}}>
                    <View style={{backgroundColor: Palette.shadowAccent, borderColor: 'white', borderRadius: 90, borderWidth: 5, width: 90, height: 90, alignItems: 'center'}}>
                        <Text style={styles.count}>{missing}</Text>
                    </View>
                </View>
                <Text style={[{flex: 2}, styles.workerdashboard]}>MISSING</Text>
            {/* </View> */}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.horizontalcontainer,{backgroundColor: Palette.background, alignItems: 'center',  margin: 10, borderRadius: 15}]}>
            {/* <View style={[styles.horizontalcontainer, {backgroundColor: Palette.focused, alignItems: 'center'}]}> */}
                <View style={{backgroundColor: Palette.background, flex: 1, alignItems: 'center'}}>
                    <View style={{backgroundColor: Palette.background, borderColor: 'white', borderRadius: 90, borderWidth: 5, width: 90, height: 90, alignItems: 'center'}}>
                        <Text style={styles.count}>{done}</Text>
                    </View>
                </View>
                <Text style={[{flex: 2}, styles.workerdashboard]}>DONE</Text>
            {/* </View> */}
        </TouchableOpacity>
        <Link href="/addpatient" asChild>
            <TouchableOpacity>
                <View style={styles.addpatient}>
                    <Text style={{textAlign: 'center', fontFamily: 'Poppins', alignSelf: 'center', fontSize: 16}}>Add Patient</Text>
                </View>
            </TouchableOpacity>
        </Link>
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
