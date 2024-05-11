import React from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";


interface ProfileDetailsProps {
    title: string;
    detail: string | number | undefined ;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = (props) => {
    const {title, detail} = props;

    return(
        
        
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            
            <Text style={styles.detail}>{detail}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        alignContent: 'space-between',
        marginLeft: 15,
        marginRight: 15,
        borderTopColor: 'gray',
        borderTopWidth: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: 'transparent'
    },
    title:{
        fontFamily: 'Heading',
        fontSize: 16,
        flex: 1,
        color: 'white'
    },
    detail:{
        fontFamily: 'Poppins',
        fontSize: 16,
        color: '#e5e5e5'
    }
})

export default ProfileDetails;