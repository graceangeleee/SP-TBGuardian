import React from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";

interface ProfileStatusProps {
    title: string;
    detail: number;
}

const ProfileStatus: React.FC<ProfileStatusProps> = (props) => {
    const {title, detail} = props;

    return(
        <View style={styles.container}>
            <Text style={styles.detail}>{detail}</Text>
            <Text style={styles.title}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title:{
        fontFamily: 'Poppins',
        fontSize: 12,
        color: '#e5e5e5'
    },
    detail:{
        fontFamily: 'Heading',
        fontSize: 40,
        color: 'white'
    },
    container:{
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'transparent'
    }
})

export default ProfileStatus;