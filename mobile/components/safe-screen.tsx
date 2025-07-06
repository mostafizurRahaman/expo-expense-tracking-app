import { View } from "react-native";
import React, { ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";

const SafeScreen = ({ children }: { children: ReactNode }) => {
   const insets = useSafeAreaInsets();
   return (
      <View
         style={{
            paddingTop: insets?.top,
            paddingBottom: insets?.bottom,
            flex: 1,
            backgroundColor: COLORS.background,
         }}
      >
         {children}
      </View>
   );
};

export default SafeScreen;
