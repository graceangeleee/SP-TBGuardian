import { View, Text } from "react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Palette from "../Constants/Palette";

interface ScheduleCardProps {
    date: string;
    details: string;
    status: boolean;
}

const ScheduleCard: React.FC<ScheduleCardProps> = (props) => {
    const {date, details, status} = props;

    return(
        <View style={styles.container}>
            <Text style={styles.detail}>{date}</Text>
            <Text style={styles.title}>You have a face-to-face appointment</Text>
            <Text style={styles.detail}>{details}</Text>
            {status ? (
                <TouchableOpacity disabled style={[styles.button, {backgroundColor:Palette.darkGray}]}>
                    <Text style={[styles.detail, {color: 'white'}]}>Confirmed</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={[styles.button, {backgroundColor: Palette.accent}]}>
                    <Text style={[styles.detail, {color: 'white'}]}>Confirm</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    detail:{
        fontFamily: 'Poppins',
        fontSize: 16,
        color: 'black'
    },
    container:{
        padding: 20,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: Palette.lightGray,
        borderColor: Palette.buttonOrLines,
        borderWidth: 1
    },
    title:{
        fontFamily: 'Heading',
        fontSize: 20,
        color: 'black'
    },
    button:{
        width: '100%',
        alignItems: 'center',
        padding: 10,
        alignSelf: 'center',
        margin: 10,
        marginTop: 15,
        borderRadius: 20,
    }
})

export default ScheduleCard;