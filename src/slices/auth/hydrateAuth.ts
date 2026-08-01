import { store } from "../../store";
import { authStorage } from "../../utils/authStorage";
import { setCredentials } from "./authSlice";

export const hydrateAuth = async () => {
  try {
    const stored = await authStorage.get();
    if (!stored || !authStorage.isSessionValid(stored)) return;

    store.dispatch(
      setCredentials({
        user: { id: stored.userId } as any,
        accessToken: stored.accessToken,
        refreshToken: stored.refreshToken,
      }),
    );
  } catch (err) {
    console.log("Auth hydration failed:", err);
  }
};
