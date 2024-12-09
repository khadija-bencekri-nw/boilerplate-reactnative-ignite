import React from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { StyleSheet } from 'react-native';
import { Button } from './Button';

type GoogleSignInProps = {
    testID?: string;
    tx: string;
    style?: object;
    preset?: string;
    textStyle?: object;
    onPress?: () => void;
    LeftAccessory?: () => void;
};

const defaultProps: Partial<GoogleSignInProps> = {
    testID: "google-sign-in",
    tx: "loginScreen.google",
    style: {},
    preset: "default",
    textStyle: {},
    onPress: () => console.log("GoogleSignIn button pressed"),
    LeftAccessory: () => null,
};
const GoogleSignIn: React.FC<GoogleSignInProps> = (props) => {
    const {
        testID,
        tx,
        style,
        preset,
        textStyle,
        onPress,
        LeftAccessory,
    } = { ...defaultProps, ...props }; 

    const signIn = async () => {
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            webClientId: '777558541856-ghcru6v9c4gi4mh5i6aj7jlk95vjb9ds.apps.googleusercontent.com',
            //androidClientId: 'AIzaSyB8p6kkHJLZpxcOc6DS7xL8gVK7LISDaM8',
            offlineAccess: true
        });
        try {
                const sth = await GoogleSignin.hasPlayServices();
                console.log('sth ' , sth )
                const userInfo = await GoogleSignin.signIn();
                console.log("userinfo", userInfo)
            } catch (error) {
                console.log("error : ",error)
        }
    };

    // const signIn = async () => {
    //     try {
    //       await GoogleSignin.hasPlayServices();
    //       const response = await GoogleSignin.signIn();
    //       console.log('response', response)
    //       if (isSuccessResponse(response)) {
    //         console.log('response', response)
    //         setState({ userInfo: response.data });
    //       } else {
    //         console.log("sign in canceled by user")
    //         // sign in was cancelled by user
    //       }
    //     } catch (error) {
    //       if (isErrorWithCode(error)) {
    //         switch (error.code) {
    //           case statusCodes.IN_PROGRESS:
    //             console.error("operation (eg. sign in) already in progress")
    //             // operation (eg. sign in) already in progress
    //             break;
    //           case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
    //             console.error("Android only, play services not available or outdated")
    //             // Android only, play services not available or outdated
    //             break;
    //           case statusCodes.SIGN_IN_REQUIRED:
    //             console.warn(" : ", error.code)
    //             break;
    //           default:
    //             console.error("an error has occured", error)
    //           // some other error happened
    //         }
    //       } else {
    //         console.error(error)
    //         // an error that's not related to google sign in occurred
    //       }
    //     }
    // };

    return (
        <Button
              testID={testID}
              tx={tx}
              style={style}
              preset={preset}  
              textStyle={textStyle}
              onPress={() => signIn()}
              LeftAccessory={LeftAccessory}
        />
    )
}
export default GoogleSignIn;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
text: {
        fontWeight: 'bold',
        marginBottom: 20,
        fontSize: 17
    },
googlebtn: {
        width: 192,
        height: 48
    }
})