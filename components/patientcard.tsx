import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { userType } from "../Constants/Types";
import Palette from "../Constants/Palette";
import { Link } from "expo-router";

interface PatientCardProps{
    content:userType,
}


const PatientCard: React.FC<PatientCardProps> = ({content}) => {
    return(
        <Link href={{pathname: "/patientprofile", params:{patientid: content.id}}} asChild>
            <TouchableOpacity style={styles.container}>  
                <View>
                    <Text style={styles.name}>{content.firstname} {content.lastname}</Text>
                    <Text style={styles.details}>{content.address}</Text>
                    <Text style={styles.details}>{content.contact_number}   |   {content.email}</Text>
                    <Text style={styles.details}>Remaining Submissions: {content.to_submit}</Text>
                </View>
            </TouchableOpacity>
        </Link>
    )
}

export default PatientCard;

const styles = StyleSheet.create({
    container:{
        borderRadius: 20,
        padding: 20,
        margin: 10,
        marginBottom: 0,
        borderWidth: 1,
        borderColor: Palette.buttonOrLines
    },
    name:{
        fontFamily: 'Heading',
        fontSize: 18
    },
    details:{
        fontFamily: 'Poppins',
        fontSize: 16
    }
})