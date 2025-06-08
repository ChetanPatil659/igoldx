import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { addAgeApi, addGenderApi, addNameApi } from "@/api/auth";
import { logout, setUser } from "@/store/action";
import { Picker } from "@react-native-picker/picker";

const Tab = createMaterialTopTabNavigator();
const { width } = Dimensions.get("window");

// Profile Screen Component
function ProfileScreen() {
  const { user } = useSelector((state: any) => state?.user);
  const token = useSelector((state: any) => state?.token?.token);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState({ label: "", value: "" });
  const [editedValue, setEditedValue] = useState("");
  const [profileData, setProfileData] = useState({
    Name: "",
    Age: "",
    Gender: "",
    "Saved Address": "",
  });
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Others", value: "others" },
    { label: "Prefer not to say", value: "prefer_not_to_say" },
  ];

  const handleEditProfile = (label: string, value: string) => {
    setSelectedField({ label, value });
    setEditedValue(value);
    setModalVisible(true);
  };

  console.log(isAuthenticated, "isAuthenticated");

  const handleSave = async () => {
    // Here you would typically dispatch an action to update the user profile
    // For now, we'll just close the modal
    setProfileData({ ...profileData, [selectedField.label]: editedValue });

    switch (selectedField.label) {
      case "Name":
        let res = await addNameApi(token, editedValue);
        if (res.success) {
          dispatch(setUser(res?.data));
        }
        break;
      case "Age":
        let resAge = await addAgeApi(token, editedValue);
        if (resAge.success) {
          dispatch(setUser(resAge?.data));
        }
        break;
      case "Gender":
        let resGender = await addGenderApi(token, editedValue);
        if (resGender.success) {
          dispatch(setUser(resGender?.data));
        }
        break;
    }
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.mainContent}>
      {/* Profile Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name.charAt(0)}</Text>
          {/* <TouchableOpacity style={styles.editButton}>
            <MaterialIcons name="edit" size={20} color="white" />
          </TouchableOpacity> */}
        </View>
      </View>

      {/* Profile Information */}
      <View style={styles.profileSection}>
        {renderProfileItem(
          "Name",
          user?.name,
          false,
          () => handleEditProfile("Name", user?.name),
          user?.name == "" ? false : true
        )}
        {renderProfileItem(
          "Phone",
          user?.phone,
          false,
          () => handleEditProfile("Phone", user?.phone),
          true
        )}
        {renderProfileItem(
          "Age",
          user?.age,
          false,
          () => handleEditProfile("Age", user?.age),
          false
        )}
        {renderProfileItem(
          "Gender",
          user?.gender,
          false,
          () => handleEditProfile("Gender", user?.gender),
          false
        )}
        {renderProfileItem(
          "Saved Address",
          user?.address?.length || 0,
          true,
          () => navigation.navigate("SavedAddresses"),
          false
        )}
        {renderProfileItem(
          "KYC Verification",
          !user?.kycVerified ? "Complete now" : "✅ Verified",
          !user?.kycVerified,
          () => {},
          false
        )}
      </View>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {selectedField.label}</Text>
            {selectedField.label === "Gender" ? (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={editedValue}
                  onValueChange={(itemValue: string) =>
                    setEditedValue(itemValue)
                  }
                  style={styles.picker}
                  dropdownIconColor="#6b46c1"
                  mode="dropdown"
                  itemStyle={styles.pickerItem}
                >
                  {genderOptions.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      color="white"
                      style={{ backgroundColor: "#2a2a3c" }}
                    />
                  ))}
                </Picker>
              </View>
            ) : (
              <TextInput
                style={styles.modalInput}
                value={editedValue}
                onChangeText={(text) => setEditedValue(text)}
                placeholder={`Enter ${selectedField.label}`}
                placeholderTextColor="#666"
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// Settings Screen Component
function SettingsScreen() {
  const dispatch = useDispatch();
  return (
    <ScrollView style={styles.mainContent}>
      {/* Payment Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Settings</Text>

        {renderSettingsItem(
          <MaterialIcons
            name="credit-card"
            size={24}
            color="white"
            style={styles.settingsIcon}
          />,
          "Payment Methods",
          null,
          () => {}
        )}

        {renderSettingsItem(
          <MaterialIcons
            name="calendar-today"
            size={24}
            color="white"
            style={styles.settingsIcon}
          />,
          "Daily Savings",
          <View style={styles.activeContainer}>
            <Ionicons name="checkmark-circle" size={16} color="#4cd964" />
            <Text style={styles.activeText}>Active</Text>
          </View>,
          () => {}
        )}

        {renderSettingsItem(
          <FontAwesome5
            name="calendar-alt"
            size={24}
            color="white"
            style={styles.settingsIcon}
          />,
          "Savings Plan",
          <Text style={styles.amountText}>₹10</Text>,
          () => {}
        )}
      </View>

      {/* App Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>

        {renderSettingsItem(
          <MaterialIcons
            name="language"
            size={24}
            color="white"
            style={styles.settingsIcon}
          />,
          "Language",
          null,
          () => {}
        )}
      </View>

      {/* Privacy Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy And Permissions</Text>

        {renderSettingsItem(
          <MaterialIcons
            name="description"
            size={24}
            color="white"
            style={styles.settingsIcon}
          />,
          "Terms and Conditions",
          null,
          () => {}
        )}

        {renderSettingsItem(
          <MaterialIcons
            name="shield"
            size={24}
            color="white"
            style={styles.settingsIcon}
          />,
          "Privacy Policy",
          null,
          () => {}
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        {renderSettingsItem(
          <MaterialIcons
            name="logout"
            size={24}
            color="white"
            style={styles.settingsIcon}
          />,
          "Logout",
          null,
          async () => {
            dispatch(logout());
          }
        )}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// Helper functions
const renderSettingsItem = (
  icon: any,
  title: string,
  rightContent: any,
  onPress: any
) => (
  <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
    <View style={styles.settingsItemLeft}>
      {icon}
      <Text style={styles.settingsItemText}>{title}</Text>
    </View>
    <View style={styles.settingsItemRight}>
      {rightContent}
      <Ionicons name="chevron-forward" size={20} color="#a8a8a8" />
    </View>
  </TouchableOpacity>
);

const renderProfileItem = (
  label: string,
  value: string,
  showChevron = false,
  onPress?: () => void,
  disabled?: boolean
) => (
  <TouchableOpacity
    style={styles.profileItem}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={styles.profileLabel}>{label}</Text>
    <View style={styles.profileValueContainer}>
      <Text style={styles.profileValue}>{value}</Text>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color="#a8a8a8" />
      )}
    </View>
  </TouchableOpacity>
);

// Main Component
export default function Account() {
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1a2e" />

      {/* Header with hamburger menu */}
      {/* <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="white" />
          </TouchableOpacity>
        </View> */}

      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#1e1a2e",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "#a8a8a8",
          tabBarIndicatorStyle: {
            backgroundColor: "#6b46c1",
            height: 3,
          },
          tabBarLabelStyle: {
            fontWeight: "bold",
            fontSize: 16,
          },
          swipeEnabled: true,
          animationEnabled: true,
        }}
      >
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1a2e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#1e1a2e",
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3a3a4c",
    justifyContent: "center",
    alignItems: "center",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#1e1a2e",
  },
  section: {
    paddingVertical: 15,
    borderBottomWidth: 8,
    borderBottomColor: "#171429",
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  settingsItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsIcon: {
    marginRight: 15,
  },
  settingsItemText: {
    color: "white",
    fontSize: 16,
  },
  settingsItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  activeText: {
    color: "#4cd964",
    marginLeft: 5,
  },
  amountText: {
    color: "white",
    fontSize: 16,
    marginRight: 10,
  },
  avatarContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6b46c1",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1e1a2e",
  },
  profileSection: {
    paddingHorizontal: 20,
  },
  profileItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a4c",
  },
  profileLabel: {
    color: "#a8a8a8",
    fontSize: 16,
  },
  profileValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileValue: {
    color: "white",
    fontSize: 16,
    marginRight: 10,
    fontWeight: "600",
    // fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#2a2a3c",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3a3a4c",
  },
  modalTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: "#3a3a4c",
    borderRadius: 10,
    padding: 15,
    width: "100%",
    color: "white",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#6b46c1",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    padding: 15,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#3a3a4c",
  },
  saveButton: {
    backgroundColor: "#6b46c1",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  pickerContainer: {
    backgroundColor: "#3a3a4c",
    borderRadius: 10,
    width: "100%",
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#6b46c1",
  },
  picker: {
    color: "white",
    height: 50,
    backgroundColor: "#3a3a4c",
  },
  pickerItem: {
    fontSize: 16,
    color: "white",
    backgroundColor: "#2a2a3c",
  },
});
