import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { styles } from "@/assets/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Image } from "expo-image";

import { COLORS } from "@/constants/colors";
import { handleClerkError } from "@/libs/clear-error-handler";
import { ClerkAPIResponseError } from "@clerk/shared/error";
export default function SignUpScreen() {
   const { isLoaded, signUp, setActive } = useSignUp();
   const router = useRouter();

   const [emailAddress, setEmailAddress] = useState("");
   const [password, setPassword] = useState("");
   const [pendingVerification, setPendingVerification] = useState(false);
   const [error, setError] = useState("");
   const [code, setCode] = useState("");

   // Handle submission of sign-up form
   const onSignUpPress = async () => {
      if (!isLoaded) return;

      if (!emailAddress) {
         setError("Email is required!");
         return;
      } else if (!password) {
         setError("Password is required!");
         return;
      } else {
         setError("");
      }

      // Start sign-up process using email and password provided
      try {
         await signUp.create({
            emailAddress,
            password,
         });

         // Send user an email with verification code
         await signUp.prepareEmailAddressVerification({
            strategy: "email_code",
         });

         // Set 'pendingVerification' to true to display second form
         // and capture OTP code
         setPendingVerification(true);
      } catch (err) {
         // See https://clerk.com/docs/custom-flows/error-handling
         // for more info on error handling
         console.error(JSON.stringify(err, null, 2));
         handleClerkError(
            err as ClerkAPIResponseError,
            setError,
            "Signup failed. Please Try again!"
         );
      }
   };

   // Handle submission of verification form
   const onVerifyPress = async () => {
      if (!isLoaded) return;

      if (!code) {
         setError("Otp code is required!");
         return;
      } else {
         setError("");
      }

      try {
         // Use the code the user provided to attempt verification
         const signUpAttempt = await signUp.attemptEmailAddressVerification({
            code,
         });

         // If verification was completed, set the session to active
         // and redirect the user
         if (signUpAttempt.status === "complete") {
            await setActive({ session: signUpAttempt.createdSessionId });
            router.replace("/");
         } else {
            // If the status is not complete, check why. User may need to
            // complete further steps.
            console.error(JSON.stringify(signUpAttempt, null, 2));
         }
      } catch (err) {
         // See https://clerk.com/docs/custom-flows/error-handling
         // for more info on error handling

         console.error(JSON.stringify(err, null, 2));
         handleClerkError(
            err as ClerkAPIResponseError,
            setError,
            "OTP verification failed. Please Try again!"
         );
      }
   };

   if (pendingVerification) {
      return (
         <View style={styles.verificationContainer}>
            <Text style={styles.verificationTitle}>Verify your email</Text>

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
               style={[styles.verificationInput, error && styles?.errorInput]}
               value={code}
               placeholder="Enter your verification code"
               onChangeText={(code) => setCode(code)}
            />
            <TouchableOpacity style={styles.button} onPress={onVerifyPress}>
               <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
         </View>
      );
   }

   return (
      <KeyboardAwareScrollView
         // style={{
         //    flex: 1,
         //    alignItems: "center",
         //    justifyContent: "center",
         // }}
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
            <Image
               source={require("@/assets/images/revenue-i1.png")}
               style={styles.illustration}
            />
            <Text style={styles.title}>Create Account</Text>
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
               placeholderTextColor={"#9A8478"}
               placeholder="Enter email"
               onChangeText={(email) => setEmailAddress(email)}
            />
            <TextInput
               value={password}
               style={[styles.input, error && styles.errorInput]}
               placeholder="Enter password"
               placeholderTextColor={"#9A8478"}
               secureTextEntry={true}
               onChangeText={(password) => setPassword(password)}
            />
            <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
               <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
            <View style={styles.footerContainer}>
               <Text style={styles.footerText}>Already have an account?</Text>

               <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.linkText}>Sign in</Text>
               </TouchableOpacity>
            </View>
         </View>
      </KeyboardAwareScrollView>
   );
}
