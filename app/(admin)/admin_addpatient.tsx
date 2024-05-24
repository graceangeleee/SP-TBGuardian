
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabase";
import { Text, TextInput, SafeAreaView, Pressable, View, Button, Alert, ScrollView, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from "react-native";
import React from "react";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';import { SelectList } from "react-native-dropdown-select-list";
import Palette from "../../Constants/Palette";
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { userType } from "../../Constants/Types";



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
    const [diseaseClass, setDiseaseClass] = useState("")
    const [regimen, setRegimen] = useState("")
    const [registrationGroup, setRegistrationGroup] = useState("")
    const [dateStarted, setDateStarted] = useState(new Date())
    const [tosubmit, setToSubmit] = useState(0)
    const [workerArray, setWorkerArray] = useState<{ key: string; value: string; }[]>([]);
    const [selectedWorker, setSelectedWorker] = useState("")
    const [workers, setWorkers]= useState<userType[]>([])

    const genderArray = [{key: "Male", value: "Male"}, {key: "Female", value: "Female"}]
    const diseaseClassArray = [{key: "Pulmoanary", value: "Pulmonary"}, {key: "Non-Pulmonary", value: "Non-Pulmonary"}]
    const regimenArray = [{key: "Cat1", value: "Cat1"}, {key: "Cat2", value: "Cat2"}]
    const registrationGroupArray = [{key: "New", value: "New"}, {key: "Relapse", value: "Relapse"}, {key: "TALF", value: "TALF"}, 
        {key: "Treatment After Failure", value: "Treatment After Failure"}, {key: "PTOU", value: "PTOU"}, {key: "Other", value: "Other"}, {key: "Transfer-in", value: "Transfer-in"}]
    let modifiedArray = []

    useEffect(() => {
        getWorkers()
      
    }, [])




    const getWorkers = async()=> {
      
        setLoading(true)
        try{
            const { data, error, status } = await supabase
            .from('users')
            .select()
            .eq("usertype", "Worker")

            if(error && status !== 406){
                throw error;
            }
    
            if(data){

                setWorkers(data);
                modifiedArray = data.map(obj => ({
                    key: `${obj.id}`,
                    value: `${obj.firstname} ${obj.lastname}`
                    }));
                    setWorkerArray(modifiedArray);
                 }
        }catch (error){
            if(error instanceof Error){
                Alert.alert(error.message)
            }
        }finally{
            setLoading(false)
        }
    }

    
    const toggleDatePicker = () => {
        if(showDatePicker){
            setShowDatePicker(false)
        }else{
            setShowDatePicker(true)
        }
    }

    const handleEmailValidation = (email:string)=> {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            setEmail(email);
            setEmailError("");
        }else{
            setEmailError("Please enter a valid email address.")
        }
    }

    const cancelDateTime = () => {
        setShowDatePicker(false)
    }

    const heightValidation = (height:string) => {
   
        if (decimalRegex.test(height) || height === '' || height === '.') {
            setHeight(parseFloat(height));
            setHeightError('');
          } else {
            setHeightError('Please enter a valid decimal number');
          }
    }


    const handleBirthdayChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        console.log(event.type)
        if (event.type === 'set' && selectedDate) {
          setBirthday(selectedDate);
          console.log(birthday)
          toggleDatePicker()
        } else {
          cancelDateTime();
        }
    
        if (Platform.OS === 'ios') {
          toggleDatePicker();
        }
    };

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === 'set' && selectedDate) {
          setDateStarted(selectedDate);
          toggleDatePicker()
        } else {
          cancelDateTime();
        }
    
        if (Platform.OS === 'ios') {
          toggleDatePicker();
        }
    };


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
        setLoading(true)
        if(email && password){
            try{

                const {data, error} = await supabase.auth.signUp({
                
                    email: email, 
                    password: password
                })

                if(error){
                   Alert.alert(error.message)
                }else{
                    if(data.session)setNewId(data.session.user.id)
                    setSignup(false)
                }  

            }catch(error){
                if(error instanceof Error)Alert.alert(error.message)
            }finally{
                setLoading(false)
            }
        }
      }

      const updateUser = async () => {
      
        setLoading(true)
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
                    status: false,
                    usertype: "Patient", 
                    workerid: selectedWorker,
                    total: tosubmit,
                    to_submit: tosubmit,
                    treatment_regimen: regimen,
                    disease_class: diseaseClass,
                    registration_group: registrationGroup,
                    date_started: dateStarted
                },

                )
                .eq("id", newId)

                createSubmissionBins()
                if(error){
                    Alert.alert("Failed to update user details")
                    console.log(error.message)
                }else{
                    Alert.alert("Successfully updated user details")
                }

            }catch(error){
                if(error instanceof Error) Alert.alert(error.message)
            }finally{
                router.replace('/admindashboard')
                setLoading(false)
            }
        }
      }

      const createSubmissionBins = async() => {
        const userid = await SecureStore.getItem("id")
        // Starting date
 

        // Array to hold all insert promises
        const insertPromises = [];

        for (let i = 0; i < tosubmit; i++) {
            // Clone the current date to avoid mutation issues
            const submissionDate = new Date(dateStarted);
            // Create the row to insert
            const row = {
            workerid: userid,
            patientid: newId,
            status: false,
            number: i,
            verified: false,
            missing_reminder: false,
            deadline_reminder: false,
            deadline: submissionDate.toISOString().split('T')[0], // Format the date as YYYY-MM-DD
            // Add other fields here as necessary
            };

            // Push the insert promise to the array
            insertPromises.push(supabase.from('submissions').insert(row));

            // Increment the date by one day
            dateStarted.setDate(dateStarted.getDate() + 1);
        }

        // Execute all insert promises
        try {
            await Promise.all(insertPromises);
            console.log('Inserted 168 rows successfully');
        } catch (error) {
            console.error('Error inserting rows:', error);
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

        const toSubmitValidator = (tosubmit: number) => {
            // Regular expression for Philippine phone numbers
  
            if(tosubmit !== null || tosubmit !== "")
                setToSubmit(tosubmit)
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
                    
                    {!loading ? (
                        <TouchableOpacity style={styles.button} onPress={signUp}>
                        <Text style={styles.buttontext}>Signup</Text>
                        </TouchableOpacity>
              
                    ): (
                        <View style={styles.button}>
                           <ActivityIndicator/>
                        </View>
                    )}
                    
                </View>
            ): (
                <ScrollView>  
                <Text style={styles.label}>Select a worker:</Text>
                {workers !== null && (
                    <SelectList data={workerArray} setSelected={setSelectedWorker} />
                )}        

                <Text style={styles.label}>First Name:</Text>     
                <TextInput 
                style={styles.inputfield}
                placeholder="First Name"
                onChangeText={fnameValidator}
                />
                {fnameError ? <Text style={styles.errorText}>{fnameError}</Text> : null}
               
                <Text style={styles.label}>Last Name:</Text>
                <TextInput 
                style={styles.inputfield}
                placeholder="Last Name"
                onChangeText={lnameValidator}
                />
                {lnameError ? <Text style={styles.errorText}>{lnameError}</Text> : null}

                <Text style={styles.label}>Contact Number:</Text>
                <TextInput 
                style={styles.inputfield}
                placeholder="Contact number"
                onChangeText={numberValidator}
                keyboardType="numeric"
                />
  

                <Text style={styles.label}>Address:</Text>
                <TextInput 
                style={styles.inputfield}
                placeholder="Address"
                onChangeText={addressValidation}
                />
                {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}
               
                <Text style={styles.label}>Weight:</Text>
                <TextInput 
                style={styles.inputfield}
                placeholder="Weight in kg"
                onChangeText={weightValidation}
                keyboardType="numeric"
                />
                {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}
               
                <Text style={styles.label}>Height:</Text>
                <TextInput 
                style={styles.inputfield}
                placeholder="Height in cm"
                onChangeText={heightValidation}
                keyboardType="numeric"
                />

                {heightError ? <Text style={styles.errorText}>{heightError}</Text> : null}
                
                <Text style={styles.label}>Gender:</Text>
                <View style={[styles.inputfield, {alignItems: 'stretch', paddingVertical: 5}]}>
                    <SelectList boxStyles={{borderWidth: 0}} fontFamily="Poppins" data={genderArray} setSelected={setGender} /> 
                </View>
                
                
                {/* {showDatePicker && (
                    <DateTimePicker
                    value={birthday}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={birthdayHandler}
                    />
                )} */}
                <Text style={styles.label}>Disease Classification:</Text>
                <View style={[styles.inputfield, {alignItems: 'stretch', paddingVertical: 5}]}>
                    <SelectList boxStyles={{borderWidth: 0}} fontFamily="Poppins" data={diseaseClassArray} setSelected={setDiseaseClass} /> 
                </View>

                <Text style={styles.label}>Treatment Regimen:</Text>
                <View style={[styles.inputfield, {alignItems: 'stretch', paddingVertical: 5}]}>
                    <SelectList boxStyles={{borderWidth: 0}} fontFamily="Poppins" data={regimenArray} setSelected={setRegimen} /> 
                </View>

                <Text style={styles.label}>Registration Group:</Text>
                <View style={[styles.inputfield, {alignItems: 'stretch', paddingVertical: 5}]}>
                    <SelectList boxStyles={{borderWidth: 0}} fontFamily="Poppins" data={registrationGroupArray} setSelected={setRegistrationGroup} /> 
                </View>

                <Text style={styles.label}>Number of treatment days:</Text>
                <TextInput 
                style={styles.inputfield}
                placeholder="Number of treatment days"
                onChangeText={toSubmitValidator}
                keyboardType="numeric"
                />
   
                <Text style={styles.label}>Birthday:</Text>
                <View style={styles.dateTimeContainer}>
            
                    <Pressable onPress={toggleDatePicker}>
                    <TextInput
                        style={styles.inputfield}
                        value={birthday.toDateString()}
                        placeholder={birthday.toDateString() !== "" ? birthday.toDateString() : "Birthday"}
                        onPress={toggleDatePicker}
                    />
                    </Pressable>
                    {showDatePicker && (
                    <DateTimePicker
                        value={birthday || new Date()}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "calendar"}
                        onChange={handleBirthdayChange}
                    />
                    )}
                    </View>

                <Text style={styles.label}>Date Started:</Text>
                <View style={styles.dateTimeContainer}>
            
                    <Pressable onPress={toggleDatePicker}>
                    <TextInput
                        style={styles.inputfield}
                        value={dateStarted.toDateString()}
                        placeholder={dateStarted.toDateString() !== "" ? dateStarted.toDateString() : "Date Treament Started"}
                        onPress={toggleDatePicker}
                    />
                    </Pressable>
                    {showDatePicker && (
                    <DateTimePicker
                        value={birthday || new Date()}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "calendar"}
                        onChange={handleDateChange}
                    />
                    )}
                    </View>

                {!loading ? (
                    <TouchableOpacity style={styles.button} onPress={updateUser}>
                        <Text style={styles.buttontext}>Update User Details</Text>
                    </TouchableOpacity>
                ): (
                    <View style={styles.button}>
                        <ActivityIndicator/>
                    </View>
                )}
                
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
        marginLeft: 30
    },
    button:{
        backgroundColor: Palette.buttonOrLines,
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 20,
        alignItems: 'center', 
        marginTop: 20
    }, 
    buttontext:{
        fontFamily: 'Poppins',
        fontSize: 16,
        color: 'white'
    },
    dateTimeContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },

})


export default  AddPatient;
