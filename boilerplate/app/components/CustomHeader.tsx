import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Icon } from '../components'; // Adjust the import based on your icon component
import { colors } from '../theme';
import { StackActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type CustomHeaderProps = {
  navigation: NativeStackNavigationProp<any, any>; 
  source: string; 
};

//const CustomHeader = ({onDrawerToggle, navigation, source }) => {
const  CustomHeader: React.FC<CustomHeaderProps> = ({navigation, source }) => {
  const sourceDashboard = source === "dashboard";
  return (
    <View style={$header}>
      <TouchableOpacity style={{ flex: 1.5, marginLeft: 20 }} onPress={() => {navigation.dispatch(StackActions.pop(1))}}>
        <Icon icon="nwDark" size={35} />
      </TouchableOpacity>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
        {sourceDashboard ? 
        <>
        <View style={{ flex: 1, marginRight: 15 }}>
          <Text style={{ color: colors.palette.neutral100 }}>6000,00</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: colors.palette.neutral400 }}>Balance</Text>
            <Icon icon={'info'} size={12} color={colors.palette.neutral400} containerStyle={{ marginLeft: 5 }} />
          </View>
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={{ color: colors.palette.neutral100 }}>1</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: colors.palette.neutral400 }}>Total purchases</Text>
            <Icon icon={'info'} size={12} color={colors.palette.neutral400} containerStyle={{ marginLeft: 5 }} />
          </View>
        </View>
        </>
        : null}
      </View>
      <View style={{ flex: 1.5, flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 10 }}>
        <TouchableOpacity onPress={()=>{navigation.navigate("AddProduct")}}>
          <Icon icon="add" size={30} containerStyle={[$circle, { backgroundColor: 'transparent' }]} />
        </TouchableOpacity>
        <View style={$circle}>
          <Text style={$initials}>KB</Text>
        </View>
      </View>
    </View>
  );
};

export default CustomHeader;

const $header: ViewStyle = {
    height:120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'#232324',
    borderBottomWidth: 1,
    borderBottomColor: colors.palette.neutral600,
    paddingTop: 20,
    padding: 10,
};

const $circle: ViewStyle = {
    width: 50,
    height: 50,
    backgroundColor: '#EB514E',
    borderRadius: 30, // Half of width and height
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
};

const $initials: TextStyle = {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
};
