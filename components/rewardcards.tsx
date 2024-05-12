import { View, Text } from "react-native";
import {StyleSheet } from "react-native";
import Palette from "../Constants/Palette";

const RewardCard = () => {
    return(
        <View style={[styles.elevation, styles.card]}>
            <View style={styles.image}></View>
            <View style={styles.textsection}>
                <Text style={styles.textbody}>April 8, 2024</Text>
                <Text style={styles.textheader}>Placholder Reward</Text>
                <Text style={styles.textbody}>Placeholder instruction</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card:{
        margin: 15,
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        backgroundColor: Palette.shadowAccent
    },
    elevation: {
        elevation: 10,
        shadowColor: '#52006A',
    },
    image:{
        height: 100,
        width: 100,
        borderRadius: 10,
        backgroundColor: Palette.buttonOrLines
    },
    textbody:{
        
        fontFamily: 'Poppins',
        fontSize: 16,
        color: 'black'
    },
    textheader:{
        marginTop: -5,
        fontFamily: 'Heading',
        fontSize: 20
    },
    textsection:{
        marginLeft: 5
    }
})

export default RewardCard;