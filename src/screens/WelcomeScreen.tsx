import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthScreenNavigationType } from "@/navigations/types";
import SafeAreaWrapper from "@/components/shared/SafeAreaWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import ButtonComp from "@/components/shared/ButtonComp";

export default function WelcomeScreen() {
  const navigation = useNavigation<AuthScreenNavigationType<"Welcome">>();
  const navigateToSignInScreen = () => {
    navigation.navigate("SignIn");
  };

  const [fontsLoaded, fontError] = useFonts({
    'ProtestRevolution-Regular': require('../../assets/fonts/ProtestRevolution-Regular.ttf'),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaWrapper>
      <LinearGradient
        colors={[
          "#ffffff",
          "#FFF78A",
          "#FDE767",
          "#FFD23F",
          "#FFF78A",
          "#ffffff",
        ]}
        style={{ flex: 1 }}
      >
        <View style={styles.toCenter}>
          <Image source={require("assets/DT.png")} style={styles.logo} />
          <Text style={styles.title}>DO THIS</Text>
          <ButtonComp styl={styles.button} label="Go To Home" onPress={navigateToSignInScreen} />
        </View>
      </LinearGradient>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  toCenter: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 40,
    fontFamily: "ProtestRevolution-Regular"
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderColor: '#282936',
    borderWidth: 2,
    marginTop: 20,
    borderRadius: 50
  }
});
