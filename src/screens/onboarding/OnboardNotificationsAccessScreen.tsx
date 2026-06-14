import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "../../navigation/types";
import RoundedButton from "../../components/common/RoundedButton";

export const OnboardNotificationsAccessScreen = ({
  navigation,
}: RootStackScreenProps<"OnboardNotificationsAccess">) => {
  const sendNotification = require("../../../assets/sendNotification.png");

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right", "bottom"]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Image source={sendNotification} />
          <View>
            <RoundedButton
              title="Allow location access"
              variant="primary"
            />

            <RoundedButton
              title="Maybe later"
              variant="secondary"
              onPress={() => {
                navigation.navigate("OnboardNotificationsAccess");
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
  },
  roundedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 16,
    height: 48,
    backgroundColor: "#31973D",
    marginBottom: 12,
  },
  buttonTextWhite: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  buttonTextBlack: {
    color: "#000000",
    fontSize: 14,
  },
});
