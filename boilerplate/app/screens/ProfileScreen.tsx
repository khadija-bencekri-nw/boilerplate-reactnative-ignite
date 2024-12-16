import React, { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextInput, View, ViewStyle, StyleSheet } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { AlertDialog, Button, CheckboxNw, DropDownPickerNw, Icon, Loader, Screen, Text, TextField, TextFieldAccessoryProps } from "app/components"
import { ScrollView } from "react-native-gesture-handler"
import { colors, spacing } from "app/theme"
import Checkbox from "expo-checkbox"
import { useStores } from "app/models"
import { TxKeyPath } from "app/i18n"
import { api } from "app/services/api"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface ProfileScreenProps extends AppStackScreenProps<"Profile"> {}

export const ProfileScreen: FC<ProfileScreenProps> = observer(function ProfileScreen() {
  // Pull in one of our MST stores
  const {
    authenticationStore: { user, logout },
  } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const authPasswordInput = useRef<TextInput>(null)

  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [authPassword, setAuthPassword] = useState("")
  //const [isChecked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false)
  const [userNw, setUserNw] = useState(Object);
  const alertRef = useRef(null)
  const mailNotifRef = useRef(null)
  const approvalNotifRef = useRef(null)


  useEffect(() => {
    setUserNw(user)
    mailNotifRef?.current.set({checked: user.shouldReceiveMailNotifications});
    approvalNotifRef?.current.set({checked: user.shouldReceiveApprovalNotifications});
  }, [])
  
  const updateUser = async () => {
    setLoading(true)
    const response = await api.updateUser(userNw.id, authPassword, mailNotifRef?.current.getChecked(), approvalNotifRef?.current.getChecked());
    if (response.kind == "ok") {
      setLoading(false);
    } else {
      setLoading(false);
      if(response.kind == "forbidden" || response.kind == "unauthorized") {
        const title= "Session expired";
        const message= "Your session has expired. Please log in again.";
        const   redirectLabel= "Login again";
        const   onRedirect= () => logout();
        showDialog(title, message, redirectLabel, onRedirect);
      } else {
        const title= "";
        const message= "Une erreur est survenue, veuillez réessayer";
        const   redirectLabel= "try again";
        const   onRedirect= () => updateUser();
        showDialog(title, message, redirectLabel, onRedirect);
      }
    }
  }

  const showDialog = (title: string, message: string, redirectLabel: string, onRedirect: Function) => {
    alertRef?.current.set({
      title,
      message,
      redirectLabel,
      onRedirect: onRedirect,
    })
    alertRef.current?.show()
  }

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral100}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )
  
  const renderCheckView = (text: TxKeyPath, id: string) => {
    return (
      <View style={{ flexDirection: 'row', marginBottom: 30, justifyContent: 'space-between'}}>
        <View style={{marginHorizontal: 10, justifyContent: 'flex-start',}}>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold', paddingBottom: 5}} tx={text} />
          <Text style={{color: 'grey', fontWeight: '400'}} tx={"profileScreen.notification.actionCheck"} />
        </View>
        <View style={{marginHorizontal: 10, alignContent: 'flex-end',}}>
          <CheckboxNw ref={id==="mail" ? mailNotifRef : approvalNotifRef} />
        </View>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={$root}>
      <View style={{marginVertical: 20}}> 
        <Text style={{color: 'white', fontSize: 22, marginHorizontal: 10, paddingBottom: 15, fontWeight: "900"}} tx={"profileScreen.userInfo.title"} />
        <View style={{backgroundColor: 'grey', height: 1, width:'100%', marginBottom: 30}} />
        <View style={{flexDirection: "row", justifyContent: "space-around"}}>
          <TextField
                value={userNw.email}
                containerStyle={$textField}
                style={{color: 'grey'}}
                labelTx="loginScreen.emailFieldLabel"
                editable={false}
                LabelTextProps={{style: {color: 'grey', paddingTop: 15, marginBottom:0,}}}
                inputWrapperStyle={{borderColor: 'grey'}}
              />
            <TextField
                ref={authPasswordInput}
                value={authPassword}
                onChangeText={setAuthPassword}
                containerStyle={$textField}
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect={false}
                secureTextEntry={isAuthPasswordHidden}
                labelTx="loginScreen.passwordFieldLabel"
                placeholderTx="loginScreen.passwordFieldPlaceholder"
                onSubmitEditing={() => {}}
                LabelTextProps={{style: {color: 'white', paddingTop: 15, marginBottom:0,}}}
                RightAccessory={PasswordRightAccessory}
              />
        </View>
        <DropDownPickerNw 
          data={["developer", "techlead"]} 
          placeholder={"Role"} 
          style={{marginVertical: 35}}
          open={false} 
          setOpen={function (): void { throw new Error("Function not implemented.")} } 
          zIndex={0} 
          zIndexInverse={0} 
        />
      </View>
      <View style={{marginVertical: 20}}> 
      <Text style={{color: 'white', fontSize: 22, marginHorizontal: 10, paddingBottom: 15, fontWeight: "900"}} tx={"profileScreen.notification.title"} />
      <View style={{backgroundColor: 'grey', height: 1, width:'100%', marginBottom: 30}} />
        {renderCheckView("profileScreen.notification.mail", "mail")}
        {renderCheckView("profileScreen.notification.approval", "approval")}
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <Button style={[$button, {backgroundColor: '#232324'}]} textStyle={{color: colors.palette.neutral100}} tx="common.cancel"  onPress={() => {}} />
        <Button style={[$button, {width: 250}]} tx="common.confirm" onPress={updateUser} />
      </View>
      <AlertDialog ref={alertRef} />
      <Loader loading={loading}/>
    </ScrollView>
  )
})

const $root: ViewStyle = {
  flexGrow: 1,
  backgroundColor:'#232324',
  padding: 30,
}
const $textField: ViewStyle = {
  marginHorizontal: 10,
  flex:1,
  borderColor: 'grey',
}

const $button: ViewStyle = {
  marginBottom: spacing.xs,
  width: 120,
  borderRadius: 40,
  marginHorizontal: 20,
  borderWidth:1,
  borderColor: colors.palette.neutral100,
}