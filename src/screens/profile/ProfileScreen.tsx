import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import type { RootStackScreenProps } from "../../navigation/types";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { TextAvatar } from "../../components/onboarding/TextAvatar";
import CustomAppBar from "../../components/common/CustomAppBar";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "../../hooks/toast";
import { scale, verticalScale, moderateScale } from "../../utils/scale";
import { userService } from "../../api/userService";
import { updateUser } from "../../slices/auth/authSlice";
import { updateProfilePicture } from "../../slices/customer/customerSlice";
import {
  deleteUploadedAvatar,
  uploadAvatar,
} from "../../services/profileImageService";

function InfoCard({
  label,
  value,
  onPress,
  children,
}: {
  label: string;
  value: string;
  onPress?: () => void;
  children?: React.ReactNode;
}) {
  const { colors } = useTheme()

  return (
    <Pressable
      onPress={onPress}
      style={{
        width: "100%",
        backgroundColor: colors.bg,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: moderateScale(24),
        padding: moderateScale(16),
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: moderateScale(16),
      }}
    >
      <View style={{ flex: 1, gap: moderateScale(4) }}>
        <Text
          style={{
            fontSize: moderateScale(14),
            fontWeight: "600",
            color: colors.text,
            lineHeight: moderateScale(20),
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontSize: moderateScale(12),
            fontWeight: "400",
            color: colors.textMuted,
            lineHeight: moderateScale(16),
          }}
        >
          {value}
        </Text>
        {children}
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={moderateScale(16)}
        color={colors.textMuted}
        style={{ marginTop: verticalScale(2) }}
      />
    </Pressable>
  );
}

export function ProfileScreen({
  navigation,
  route,
}: RootStackScreenProps<"Profile">) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const customer = useAppSelector((state) => state.customer);
  const { colors } = useTheme();

  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const fullName =
    route.params?.newFullName ??
    (user ? `${user.firstname} ${user.lastname}` : "");
  const phone = route.params?.newPhone ?? user?.phone ?? "";
  const email = route.params?.newEmail ?? user?.email ?? "";
  const isVerified = user?.verified ?? true;

  const profilePicture =
    localPreview ??
    customer.profile_picture ??
    user?.profile_picture ??
    null;

  useEffect(() => {
    if (route.params?.updatedAt) {
      toast.success("Details updated successfully");
    }
  }, [route.params?.updatedAt]);

  const handlePickAvatar = async () => {
    if (!user?.id || uploading) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      toast.error("Photo library permission is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]?.uri) return;

    const uri = result.assets[0].uri;
    setLocalPreview(uri);
    setUploading(true);

    let uploadedUrl: string | null = null;
    try {
      const previousUrl = customer.profile_picture ?? user?.profile_picture ?? null;
      uploadedUrl = await uploadAvatar(user.id, uri, previousUrl);

      const response = await userService.updateUser(user.id, {
        profile_picture: uploadedUrl,
      });

      if (response.success) {
        dispatch(updateUser({ profile_picture: uploadedUrl }));
        dispatch(updateProfilePicture(uploadedUrl));
        toast.success("Profile photo updated");
      } else {
        throw new Error("Failed to save profile photo");
      }
    } catch (err) {
      setLocalPreview(null);
      if (uploadedUrl) {
        await deleteUploadedAvatar(uploadedUrl).catch(() => {});
      }
      toast.error(
        err instanceof Error ? err.message : "Could not update profile photo",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.surface }}
      edges={["top", "left", "right", "bottom"]}
    >
      <CustomAppBar title="Profile" navigation={navigation}/>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          padding: moderateScale(16),
          gap: moderateScale(16),
          alignItems: "center",
        }}
      >
        {/* Avatar section */}
        <View style={{ alignItems: "center", gap: moderateScale(16) }}>
          {/* Avatar with verified badge */}
          <Pressable
            onPress={handlePickAvatar}
            disabled={uploading}
            style={{ alignItems: "center" }}
          >
            <View
              style={{
                width: moderateScale(64),
                height: moderateScale(64),
                backgroundColor: colors.card,
                borderRadius: moderateScale(12),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View style={{ width: moderateScale(54), height: moderateScale(54) }}>
                {profilePicture ? (
                  <Image
                    source={{ uri: profilePicture }}
                    style={{
                      width: moderateScale(54),
                      height: moderateScale(54),
                      borderRadius: 999,
                      borderWidth: 2,
                      borderColor: colors.border,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <TextAvatar
                    size={moderateScale(48)}
                    bgColor={colors.textSub}
                    name={`${user?.firstname} ${user?.lastname}`}
                  />
                )}
                {customer.is_premium && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: verticalScale(-2),
                      right: scale(-2),
                      width: moderateScale(18),
                      height: moderateScale(18),
                      borderRadius: moderateScale(9),
                      backgroundColor: "#006B23",
                      borderWidth: 2,
                      borderColor: "#FFFFFF",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    className="flex items-center justify-center"
                  >
                    <View>
                      <MaterialCommunityIcons
                        name="check-decagram"
                        size={moderateScale(11)}
                        color="#FFFFFF"
                      />
                    </View>
                  </View>
                )}
                <View
                  style={{
                    position: "absolute",
                    bottom: -2,
                    left: -2,
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {uploading ? (
                    <ActivityIndicator size="small" color="#006B23" />
                  ) : (
                    <MaterialCommunityIcons
                      name="camera"
                      size={12}
                      color="#006B23"
                    />
                  )}
                </View>
              </View>
            </View>
          </Pressable>

          <Text
            style={{
              fontSize: moderateScale(14),
              fontWeight: "400",
              color: colors.textSub,
              lineHeight: moderateScale(20),
              textAlign: "center",
            }}
          >
            Tap to choose a photo for easy identification
          </Text>
        </View>

        {/* Name card */}
        <InfoCard
          label="Name"
          value={fullName}
          onPress={() => navigation.navigate("UpdateName")}
        />

        {/* Phone number card */}
        <InfoCard
          label="Phone number"
          value={phone}
          onPress={() =>
            navigation.navigate("UpdateDetails", { kind: "phone" })
          }
        >
          {isVerified && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "flex-start",
                backgroundColor: "rgba(0, 107, 35, 0.1)",
                borderRadius: moderateScale(11),
                paddingRight: scale(8),
                marginTop: verticalScale(4),
              }}
            >
              <View style={{ padding: moderateScale(4) }}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={moderateScale(14)}
                  color="#31973D"
                />
              </View>
              <Text
                style={{
                  fontSize: moderateScale(10),
                  fontWeight: "400",
                  color: "#31973D",
                  letterSpacing: 0.48,
                  lineHeight: moderateScale(14),
                }}
              >
                Verified
              </Text>
            </View>
          )}
        </InfoCard>

        {/* Email address card */}
        <InfoCard
          label="Email Address"
          value={email}
          onPress={() =>
            navigation.navigate("UpdateDetails", { kind: "email" })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default ProfileScreen;
