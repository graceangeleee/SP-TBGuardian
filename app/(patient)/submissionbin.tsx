import { View, Text, ScrollView } from "react-native";
import { StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useState, useEffect } from "react";
import Palette from "../../Constants/Palette";
import CommentCard from "../../components/comment";
import { FontAwesome6, FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router";

const SubmissionBin = () => {
    const params = useLocalSearchParams();
    const {number, deadline, status} = params;
    const [submissionstatus, setSubmissionStatus] = useState("")
    const description = "Placeholder description"

    useEffect(() => {
        if(status === "false"){
            setSubmissionStatus("Ongoing")
        }else{
            setSubmissionStatus("Done")
        }
    })

    return (
        <ScrollView>
            <Text style={styles.title}>SUBMISSION DETAILS</Text>
            <View style={styles.card}>
                <View style={styles.cardheading}>
                    <Text style={styles.cardtitle}>Submission #{number} </Text>
                    
                </View>
                <Text style={styles.cardtitle}>Status: {submissionstatus}</Text>
                <View style={styles.cardheading}>
                    <Text style={styles.cardsubtitle}>{deadline}</Text>
                    {/* <Text style={styles.cardsubtitle}>{time}</Text> */}
                </View>
                <Text style={styles.description}>{description}</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttontext}>Submit a Video</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.divider}></View>
            <Text style={styles.title}>COMMENTS</Text>
            <CommentCard />
            <CommentCard />
            <CommentCard />
            <View style={styles.input}>
                <FontAwesome6 style={{flex: 1}} name="paperclip" size={24} color="black"/>
                <FontAwesome6 style={[styles.margin, {flex: 1}]} name="image" size={24} color="black" />
                {/* insert maxwidth and maxheight */}
                <TextInput style={[styles.margin, {fontFamily: 'Poppins', flex: 6}]} multiline={true} placeholder="Insert comment here"/>
                <FontAwesome style={{flex: 1}} name="send" size={24} color="black" />
            </View>

        </ScrollView>
    )
    // :
    // (
    //     <ScrollView>
    //         <Text style={styles.title}>SUBMISSION DETAILS</Text>
    //         <View style={styles.card}>
    //             <View style={styles.cardheading}>
    //                 <Text style={styles.cardtitle}>Submission #{number}</Text>
    //                 <Text style={styles.cardtitle}> {status}</Text>
    //             </View>
    //             <View style={styles.cardheading}>
    //                 <Text style={styles.cardsubtitle}>{date}</Text>
    //                 <Text style={styles.cardsubtitle}>{time}</Text>
    //             </View>
    //             <Text style={styles.description}>{description}</Text>
    //             <TouchableOpacity style={styles.button}>
    //                 <Text style={styles.buttontext}>View Video</Text>
    //             </TouchableOpacity>
    //         </View>
    //         <View style={styles.divider}></View>
    //         <Text style={styles.title}>COMMENTS</Text>
    //         <CommentCard />
    //         <CommentCard />
    //         <CommentCard />
    //         <View style={styles.input}>
    //             <FontAwesome6 style={{flex: 1}} name="paperclip" size={24} color="black"/>
    //             <FontAwesome6 style={[styles.margin, {flex: 1}]} name="image" size={24} color="black" />
    //             {/* insert maxwidth and maxheight */}
    //             <TextInput style={[styles.margin, {fontFamily: 'Poppins', flex: 6}]} multiline={true} placeholder="Insert comment here"/>
    //             <FontAwesome style={{flex: 1}} name="send" size={24} color="black" />
    //         </View>

    //     </ScrollView>
    // )

}

const styles = StyleSheet.create({
    title:{
        fontFamily: 'Heading',
        fontSize: 20,
        marginTop: 15,
        marginLeft: 20
    },
    card:{
        backgroundColor: Palette.focused,
        borderRadius: 20,
        padding: 15,
        margin: 15
    },
    cardheading:{
        backgroundColor: 'transparent',
        flexDirection: 'row',
    },
    cardtitle:{
        fontFamily: 'Heading',
        fontSize: 20,
    },
    cardsubtitle:{
        fontFamily: 'Heading',
        fontSize: 16,
    },
    description:{
        marginTop: 15,
        fontFamily: 'Poppins',
        fontSize: 16
    },
    button:{
        marginTop: 15,
        backgroundColor: Palette.shadowAccent,
        padding: 10,
        borderRadius: 60,
        alignContent: 'center',
        alignItems: 'center'
    },
    buttontext:{
        fontFamily: 'Heading',
        fontSize: 20
    },
    input:{
        flexDirection: 'row',
        margin: 15,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center'
    },
    margin:{
        marginLeft: 5
    },
    divider:{
        height: 2,
        backgroundColor: Palette.buttonOrLines,
        marginLeft: 20, 
        marginRight: 20
    }
})

export default SubmissionBin;