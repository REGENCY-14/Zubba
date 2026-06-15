import { store } from "../../store";
import { authStorage } from "../../utils/authStorage";
import { setCredentials } from "./authSlice";

export const hydrateAuth = async () => {
  try {
    const stored = await authStorage.get();

    if (!stored) return;

    store.dispatch(
      setCredentials({
        user: stored.user,
        accessToken: stored.accessToken,
        refreshToken: stored.refreshToken,
      })
    );
  } catch (err) {
    console.log("Auth hydration failed:", err);
  }
};