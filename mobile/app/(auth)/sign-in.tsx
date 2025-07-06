import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "@/assets/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { handleClerkError } from "@/libs/clear-error-handler";
import { ClerkAPIResponseError } from "@clerk/shared/error";

export default function Page() {
   const { signIn, setActive, isLoaded } = useSignIn();
   const router = useRouter();

   const [emailAddress, setEmailAddress] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");

   // Handle the submission of the sign-in form
   const onSignInPress = async () => {
      if (!isLoaded) return;

      // Start the sign-in process using the email and password provided
      try {
         const signInAttempt = await signIn.create({
            identifier: emailAddress,
            password,
         });

         // If sign-in process is complete, set the created session as active
         // and redirect the user
         if (signInAttempt.status === "complete") {
            await setActive({ session: signInAttempt.createdSessionId });
            router.replace("/");
         } else {
            // If the status isn't complete, check why. User might need to
            // complete further steps.
            console.error(JSON.stringify(signInAttempt, null, 2));
         }
      } catch (err) {
         // See https://clerk.com/docs/custom-flows/error-handling
         // for more info on error handling
         console.error(JSON.stringify(err, null, 2));
         handleClerkError(
            err as ClerkAPIResponseError,
            setError,
            "Sign-in  failed!Please try again!"
         );
      }
   };

   return (
      <KeyboardAwareScrollView
         style={{
            flex: 1,
         }}
         contentContainerStyle={{
            flexGrow: 1,
         }}
         enableAutomaticScroll
         enableOnAndroid
      >
         <View style={styles.container}>
            <Text style={styles.title}>Sign in</Text>
            {error && (
               <View style={styles.errorBox}>
                  <Ionicons
                     name="alert-circle"
                     color={COLORS.expense}
                     size={24}
                  />
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity onPress={() => setError("")}>
                     <Ionicons
                        name="close"
                        color={COLORS.textLight}
                        size={20}
                     ></Ionicons>
                  </TouchableOpacity>
               </View>
            )}
            <TextInput
               style={[styles.input, error && styles.errorInput]}
               autoCapitalize="none"
               value={emailAddress}
               placeholder="Enter email"
               placeholderTextColor={"#9A8478"}
               onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            />
            <TextInput
               style={[styles.input, error && styles.errorInput]}
               value={password}
               placeholder="Enter password"
               secureTextEntry={true}
               placeholderTextColor={"#9A8478"}
               onChangeText={(password) => setPassword(password)}
            />
            <TouchableOpacity style={styles.button} onPress={onSignInPress}>
               <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
            <View style={styles.footerContainer}>
               <Text style={styles.footerText}>
                  Don&apos;t have any account?
               </Text>

               <TouchableOpacity onPress={() => router.push("/sign-up")}>
                  <Text style={styles.linkText}>Sign up</Text>
               </TouchableOpacity>
            </View>
         </View>
      </KeyboardAwareScrollView>
   );
}
