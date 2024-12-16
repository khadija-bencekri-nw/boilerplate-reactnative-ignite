import React, {forwardRef} from 'react';
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
    onSignInSuccess: (userInfo: any) => void;
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
const GoogleSignIn= forwardRef<any, GoogleSignInProps>((props, ref) => {
    const {
        testID,
        tx,
        style,
        preset,
        textStyle,
        onPress,
        LeftAccessory,
        onSignInSuccess
    } = { ...defaultProps, ...props }; 

    const signIn = async () => {
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            webClientId: '777558541856-ghcru6v9c4gi4mh5i6aj7jlk95vjb9ds.apps.googleusercontent.com',
            offlineAccess: true
        });
        try {
                await GoogleSignin.hasPlayServices();
                const userInfo = await GoogleSignin.signIn();
                onSignInSuccess(userInfo);
            } catch (error) {
                console.log("error : ",error)
        }
    };

    return (
        <Button
            ref={ref}
            testID={testID}
            tx={tx}
            style={style}
            preset={preset}  
            textStyle={textStyle}
            onPress={() => signIn()}
            LeftAccessory={LeftAccessory}
        />
    )
});

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