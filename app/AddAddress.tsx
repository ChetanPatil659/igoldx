import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addAddressApi } from '@/api/auth';
import { useSelector } from 'react-redux';

export default function AddAddress() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [address1, setAddress1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const token = useSelector((state: any) => state.token.token);
  console.log(token);
  
  const handleContinue = async () => {
    const res = await addAddressApi(token, city, state, address1, pincode, name, phone);
    if (res.success) {
      navigation.navigate('SavedAddresses');
    }
  }

  return (
    <SafeAreaView edges={["top", 'bottom']} style={styles.container}>
      {/* Header */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Address</Text>
      </View>
      <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter Name"
          placeholderTextColor="#888"
        />
        {/* Phone Number */}
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="+91 9999999999"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
        />
        {/* Pincode */}
        <Text style={styles.label}>Pincode</Text>
        <TextInput
          style={styles.input}
          value={pincode}
          onChangeText={setPincode}
          placeholder="Enter Pincode"
          placeholderTextColor="#888"
          keyboardType="number-pad"
        />
        {/* Street Address 1 */}
        <Text style={styles.label}>Street Address 1</Text>
        <TextInput
          style={styles.input}
          value={address1}
          onChangeText={setAddress1}
          placeholder="Address Line 1"
          placeholderTextColor="#888"
        />
        {/* City */}
        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Enter City"
          placeholderTextColor="#888"
        />
        {/* State */}
        <Text style={styles.label}>State</Text>
        <TextInput
          style={styles.input}
          value={state}
          onChangeText={setState}
          placeholder="Enter State"
          placeholderTextColor="#888"
        />
        <View style={{ height: 40 }} />

        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#26223A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  label: {
    color: '#d1d1d1',
    fontSize: 15,
    marginBottom: 6,
    marginTop: 18,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#211c32',
    borderRadius: 10,
    padding: 16,
    color: 'white',
    fontSize: 16,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: '#3d3456',
  },
  buttonContainer: {
    backgroundColor: 'rgba(38,34,58,0.95)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    ...Platform.select({
      ios: { paddingBottom: 32 },
      android: { paddingBottom: 16 },
    }),
  },
  continueButton: {
    backgroundColor: '#6b46c1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 