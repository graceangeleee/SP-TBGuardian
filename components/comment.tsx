import { View, Text, Alert, TouchableOpacity, Modal, TextInput } from "react-native";
import { StyleSheet } from "react-native";
import Palette from "../Constants/Palette";
import { supabase } from "../supabase";
import { useEffect, useState } from "react";
import { FontAwesome } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

interface Comments{
    created_at: Date,
    id: string,
    content: string,
    userid: string,
    submissionid: string
}

interface CommentCardProps{
    comment: Comments;
    deleteFunction: (id: string) => void;
    editFunction: (id:string, edited: string) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({comment, deleteFunction, editFunction}) => {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [loading, setLoading] = useState(true);
    const [userid, setUserId] = useState("");
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [editedComment, setEditedComment] = useState("")
    useEffect(()=>  {
        retrieveUserdData()
    })

    const toggleEditModal = () => {
        setEditModalVisible(!editModalVisible);
    }

    const toggleDeleteModal = () => {
        setDeleteModalVisible(!deleteModalVisible);
    }


    async function retrieveUserdData(){
        try{
            const user_id = await SecureStore.getItemAsync("id");
            if(user_id!==null) setUserId(user_id)
            
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
                    {comment.userid === userid ? (
                        <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={toggleEditModal}>
                            <FontAwesome name="edit" size={24} color="black" style={{marginRight: 5}}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleDeleteModal}>
                            <FontAwesome name="trash" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    ): (
                        <></>
                    )}
                    
                </View>
            </View>
            
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleEditModal}
      >
        <View  style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalContentContainer}>
                <Text style={styles.modalTitle}>Edit Comment</Text>
                <View style={styles.input}>
                    <TextInput
                    value={editedComment}
                    onChangeText={setEditedComment}
                    placeholder={comment.content}
                    style={{fontFamily: 'Poppins', color: 'black'}}
                    multiline={true}
                    />
                </View>
            </View>
            
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={() => {
                    editFunction(comment.id, editedComment);
                    setEditModalVisible(!editModalVisible)
                }}>
                <Text>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={toggleEditModal}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleDeleteModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalContentContainer}>
                <Text style={styles.modalTitle}>Are you sure you want to delete this comment?</Text>
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={()=> deleteFunction(comment.id)}>
                <Text>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={toggleDeleteModal}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background to overlay the entire screen
      },
      modalView: {
        width: '80%', // Set your desired width
        height: '20%', // Set your desired height
        backgroundColor: Palette.lightGray,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalButtonContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'space-around',
      },
      modalButton:{
        flex: 1,
        alignItems: 'center',
        backgroundColor: Palette.accent,
        margin: 10,
        padding: 10,
        borderRadius: 10
      },
      modalTitle: {
        fontFamily: 'Heading',
        fontSize: 16
      },
      modalContentContainer:{
        flex: 3
      },
      input:{
        backgroundColor: 'white',
        margin: 15,
        padding: 15,
        borderRadius: 20,
      }
})

export default CommentCard;