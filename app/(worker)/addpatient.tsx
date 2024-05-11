
import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { Text, TextInput, SafeAreaView, Button, Alert, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";



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
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [heightError, setHeightError] = useState("");
    const [weightError, setWeightError] = useState("");
    const decimalRegex = /^[0-9]*\.?[0-9]*$/;
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

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

      const birthdayHandler = (event: any, selectedDate? : Date) => {
        const currentDate = selectedDate || birthday;
        setShowDatePicker(false);
        setBirthday(currentDate);
      }

    
    return(
        <SafeAreaView>
            <ScrollView>
                <TextInput 
                style={styles.inputfield}
                placeholder="Email"
                onChangeText={handleEmailValidation}
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                <TextInput 
                style={styles.inputfield}
                placeholder="Password"
                onChangeText={passwordValidation}
                />
                <TextInput 
                style={styles.inputfield}
                placeholder="First Name"
                onChangeText={setFirstname}
                />
                <TextInput 
                style={styles.inputfield}
                placeholder="Last Name"
                onChangeText={setLastname}
                />
                <TextInput 
                style={styles.inputfield}
                placeholder="Address"
                onChangeText={setAddress}
                />
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
                {/* <Picker
                    selectedValue={gender}
                    style={{ height: 50, width: 200 }}
                    onValueChange={(itemValue:string, itemIndex) => setGender(itemValue)}
                >
                    <Picker.Item label="Male" value="Male"/>
                    <Picker.Item label="Female" value="Female"/>
                </Picker> */}
                <Button title="Show Date Picker" onPress={() => setShowDatePicker(true)} />
                {showDatePicker && (
                    <DateTimePicker
                    value={birthday}
                    mode="date"
                    display="default"
                    onChange={birthdayHandler}
                    />
                )}
                <Button title="Submit"/>
            </ScrollView>
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
