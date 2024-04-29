import { View, Text, Alert, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import Palette from "../Constants/Palette";
import { supabase } from "../supabase";
import { useEffect, useState } from "react";
import { FontAwesome } from '@expo/vector-icons';

interface Comments{
    created_at: Date,
    id: string,
    content: string,
    userid: string,
    submissionid: string
}

interface CommentCardProps{
    comment: Comments;
    deleteComment: (id: string) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({comment, deleteComment}) => {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(()=>  {
        retrieveUserdData()
    })


    async function retrieveUserdData(){
        try{
            const {data, error, status} = await supabase
            .from('users')
            .select()
            .eq("id", comment.userid)
            .single()

            if(error && status!==406){
                throw error;
            }

            if(data){
                setFirstname(data.firstname)
                setLastname(data.lastname)
                setLoading(false)
            }
        }catch(error){
            if(error instanceof Error){
                Alert.alert("There is no user found for this comment")
            }
        }finally{
            return
        }
    }

    return(
        <View style={styles.main}>
            <View style={styles.icon}></View>
            <View style={styles.content}>
                
                {loading? (<></>):
                (
                <Text style={styles.name}>
                    {firstname} {lastname}
                </Text>
                
                )}
                <View style={{flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
                    <View style={styles.commentbody}>
                        <Text style={styles.commenttext}>{comment.content}</Text>
                        
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity >
                            <FontAwesome name="edit" size={24} color="black" style={{marginRight: 5}}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>deleteComment(comment.id)}>
                            <FontAwesome name="trash" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
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
        flex: 4,
        borderRadius: 20,
        backgroundColor: 'white',
        padding: 10,
        marginRight: 5
    },
    content:{
        flex: 5,
        marginLeft: 15
    }
})

export default CommentCard;