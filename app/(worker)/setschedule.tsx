import React, { useState, useEffect } from "react";
import { View, TextInput, Text, StyleSheet, Platform, TouchableOpacity, Pressable } from "react-native";
import { useWorkerData } from "./_layout";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker from "@react-native-community/datetimepicker";
import Palette from "../../Constants/Palette";

const ScheduleSetter: React.FC = () => {
  const { monitoring } = useWorkerData();
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false); // To track whether the date picker is changed
  const [patientArray, setPatientArray] = useState<{ key: string; value: string; }[]>([]);

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const toggleTimePicker = () => {
    setShowTimePicker(!showTimePicker);
  };

  const confirmDateTime = () => {
    toggleDatePicker();
    toggleTimePicker();
    setIsDirty(true); // Indicate that the date picker is changed
  };

  const cancelDateTime = () => {
    setShowDatePicker(false);
    setShowTimePicker(false);
    setIsDirty(false); // Reset the dirty state
  };

  useEffect(() => {
    if (monitoring !== null) {
      const modifiedArray = monitoring.map(obj => ({
        key: `${obj.id}`,
        value: `${obj.firstname} ${obj.lastname}`
      }));
      setPatientArray(modifiedArray);
    } else {
      setPatientArray([]);
    }
  }, [monitoring]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select a patient:</Text>
      {monitoring !== null ? (
        <SelectList data={patientArray} setSelected={setSelectedPatient} />
      ) : (
        <></>
      )}
      <Text style={styles.label}>Notes:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter notes"
        onChangeText={setNotes}
      />
      <View style={styles.dateTimeContainer}>
        <Text style={styles.label}>Select date:</Text>
        <Pressable onPress={toggleDatePicker}>
          <TextInput
            style={styles.input}
            placeholder={date ? date.toDateString() : "Select date"}
            onPress={toggleDatePicker}
          />
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "calendar"}
            onChange={(event: any, selectedDate?: Date) => {
              if (selectedDate) {
                setDate(selectedDate);
                if (Platform.OS === "ios") toggleDatePicker();
              } else {
                cancelDateTime(); // Cancel if date is not selected
              }
            }}
          />
        )}
        <Text style={styles.label}>Select time:</Text>
        <Pressable onPress={toggleTimePicker}>
          <TextInput
            style={styles.input}
            placeholder={time ? time.toTimeString() : "Select time"}
            onPress={toggleTimePicker}
          />
        </Pressable>
        
        {showTimePicker && (
          <DateTimePicker
            value={time || new Date()}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event: any, selectedTime?: Date) => {
              if (selectedTime) {
                setTime(selectedTime);
                if (Platform.OS === "ios") toggleTimePicker();
              } else {
                cancelDateTime(); // Cancel if time is not selected
              }
            }}
          />
        )}
        {showDatePicker && Platform.OS === "ios" && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity onPress={cancelDateTime}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmDateTime}>
              <Text>Select</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <TouchableOpacity>
        <View style={styles.button}>
            <Text style={{fontFamily: 'Poppins', fontSize: 16}}>Set Schedule</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 'auto',
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  dateTimeContainer: {
    marginBottom: 20,
  },
  button:{
    backgroundColor: Palette.background,
    height: 50,
    margin: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',

  }
});

export default ScheduleSetter;
