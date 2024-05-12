
import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { Text, TextInput, SafeAreaView, View, Button, Alert, ScrollView, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from "react-native";
import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SelectList } from "react-native-dropdown-select-list";
import Palette from "../../Constants/Palette";



const AddPatient = () => {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [gender, setGender] = useState("");
    const [birthday, setBirthday] = useState(new Date());
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cnumber, setCnumber] = useState("")
    const [numberError, setNumberError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [addressError, setAddressError] = useState("");
    const [heightError, setHeightError] = useState("");
    const [weightError, setWeightError] = useState("");
    const [fnameError, setFnameError] = useState("");
    const [lnameError, setLnameError] = useState("")
    const decimalRegex = /^[0-9]*\.?[0-9]*$/;
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [signup, setSignup] = useState(true);
    const [newId, setNewId] = useState("")
    
    const genderArray = [{key: "Male", value: "Male"}, {key: "Female", value: "Female"}]

    const handleEmailValidation = (email:string)=> {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            setEmail(email);
            setEmailError("");
        }else{
            setEmailError("Please enter a valid email address.")
        }
    }

    const heightValidation = (height:string) => {
   
        if (decimalRegex.test(height) || height === '' || height === '.') {
            setHeight(parseFloat(height));
            setHeightError('');
          } else {
            setHeightError('Please enter a valid decimal number');
          }
    }

    const weightValidation = (weight:string) => {
        if (decimalRegex.test(weight) || weight === '' || weight === '.') {
            setWeight(parseFloat(weight));
            setWeightError('');
          } else {
            setWeightError('Please enter a valid decimal number');
          }
    }

    const addressValidation = (address: string) => {
        if(address === "" || address === null){
            setAddressError("Please enter an address")
        }else{
            setAddress(address)
            setAddressError("")
        }
    }

    const passwordValidation = (password: string) => {
        // Regular expressions to match a small letter, a capital letter, and a special character
        const smallRegex = /[a-z]/;
        const capitalRegex = /[A-Z]/;
        const specialCharRegex = /[^A-Za-z0-9]/;
    
        // Check if the password meets the criteria
        const hasSmallLetter = smallRegex.test(password);
        const hasCapitalLetter = capitalRegex.test(password);
        const hasSpecialChar = specialCharRegex.test(password);
    
        // Update the state only if the password meets the criteria
        if (hasSmallLetter && hasCapitalLetter && hasSpecialChar) {
          setPassword(password);
          setPasswordError("")
        } else {
         setPasswordError("Password should have at least a-z, A-Z, special characters")
        }
      };

      const birthdayHandler = (event: any, selectedDate?: Date) => {
        if (selectedDate !== undefined) {
            setBirthday(selectedDate);
            setShowDatePicker(false); // Assuming you have setShowDatePicker defined elsewhere
        }
    };

      const fnameValidator = (fname:string) => {
        if(fname === "" || fname === null){
            setFnameError("This field cannot be empty")
        }else{
            setFirstname(fname)
            setFnameError("")
        }
      }

      const lnameValidator = (lname:string) => {
        if(lname === "" || lname === null){
            setLnameError("This field cannot be empty")
        }else{
            setLastname(lname)
            setLnameError("")
        }
      }

      const signUp = async() => {

        if(email && password){
            try{

                const {data, error} = await supabase.auth.signUp({
                
                    email: email, 
                    password: password
                })

                if(error){
                    console.log(error)
                }else{
                    if(data.session)setNewId(data.session.user.id)
                    setSignup(false)
                }  

            }catch(error){
                if(error instanceof Error)console.log(error.message)
            }
        }
      }

      const updateUser = async () => {
        if(firstname && lastname && gender && address && birthday && height && weight && cnumber ){
            try{
                const {error} = await supabase
                .from('users')
                .update(
                    {firstname: firstname, 
                    lastname: lastname, 
                    gender: gender, 
                    birthday: birthday, 
                    height: height, 
                    weight: weight, 
                    address: address, 
                    contact_number:cnumber,
                    status: "FALSE"
                },

                )
                .eq("id", newId)

                if(error){
                    Alert.alert("Failed to update user details")
                }else{
                    Alert.alert("Successfully updated user details")
                }

            }catch(error){
                if(error instanceof Error) Alert.alert(error.message)
            }
        }
      }

      const numberValidator = (phoneNumber: string) => {
        // Regular expression for Philippine phone numbers
        const phoneNumberRegex = /^(09|\+639)\d{9}$/;
    
        if(phoneNumberRegex.test(phoneNumber)){
            setCnumber(phoneNumber)
            setNumberError("")
        }else{
            setNumberError("Enter a valid phone nubmer")
        }
    };

    
    return(
        <SafeAreaView>
            {signup? (
                <View>
                <TextInput 
                    style={styles.inputfield}
                    placeholder="Email"
                    onChangeText={handleEmailValidation}
                    />
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                    
                    <TextInput 
                    style={styles.inputfield}
                    placeholder="Password"
                    textContentType='password'
                    secureTextEntry={true}
                    onChangeText={passwordValidation}
                    />
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                    <Button title="Signup" onPress={signUp}/>
                </View>
            ): (
                <ScrollView>               
                <TextInput 
                style={styles.inputfield}
                placeholder="First Name"
                onChangeText={fnameValidator}
                />
                {fnameError ? <Text style={styles.errorText}>{fnameError}</Text> : null}
               
                
                <TextInput 
                style={styles.inputfield}
                placeholder="Last Name"
                onChangeText={lnameValidator}
                />
                {lnameError ? <Text style={styles.errorText}>{lnameError}</Text> : null}

                <TextInput 
                style={styles.inputfield}
                placeholder="Contact number"
                onChangeText={numberValidator}
                keyboardType="numeric"
                />
                {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}
               

                <TextInput 
                style={styles.inputfield}
                placeholder="Address"
                onChangeText={addressValidation}
                />
                {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}
               
                <TextInput 
                style={styles.inputfield}
                placeholder="Weight in kg"
                onChangeText={weightValidation}
                keyboardType="numeric"
                />
                {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}
               
                <TextInput 
                style={styles.inputfield}
                placeholder="Height in cm"
                onChangeText={heightValidation}
                keyboardType="numeric"
                />

                {heightError ? <Text style={styles.errorText}>{heightError}</Text> : null}
                
                <View style={[styles.inputfield, {alignItems: 'stretch'}]}>
                    <SelectList boxStyles={{borderWidth: 0}} fontFamily="Poppins" data={genderArray} setSelected={setGender} /> 
                </View>
                <Button title="Show Date Picker" onPress={() => setShowDatePicker(true)} />
               
                {showDatePicker && (
                    <DateTimePicker
                    value={birthday}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={birthdayHandler}
                    />
                )}

                <Button title="Submit" onPress={updateUser}/>
            </ScrollView>
            )}
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    inputfield:{
        fontFamily: 'Poppins',
        color: 'black',
        fontSize: 16,
        borderWidth: 1,
        paddingHorizontal: 25,
        paddingVertical: 15,
        marginHorizontal: 20,
        borderRadius: 60,
        alignContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
      },
})


export default  AddPatient;
