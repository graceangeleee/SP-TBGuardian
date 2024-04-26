import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import Palette from "@/constants/Palette";

const CommentCard = () => {
    return(
        <View style={styles.main}>
            <View style={styles.icon}></View>
            <View style={styles.content}>
                <Text style={styles.name}>
                    Placholder Name
                </Text>
                <View style={styles.commentbody}>
                    <Text style={styles.commenttext}>Placholder Comment</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main:{
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20
    },
    icon: {
        flex: 1,
        height: 50,
        width: 50,
        borderRadius: 90,
        backgroundColor: Palette.buttonOrLines
    },
    name:{
        fontFamily: 'Heading',
        fontSize: 16
    },
    commenttext:{
        fontFamily: 'Poppins',
        fontSize: 16
    },
    commentbody:{
        borderRadius: 20,
        backgroundColor: 'white',
        padding: 10
    },
    content:{
        flex: 6,
        marginLeft: 15
    }
})

export default CommentCard;