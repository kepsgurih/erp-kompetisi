import { refreshToken } from "@/services/auth";
import { RootState } from "@/store";
import { loginSuccess, logout } from "@/store/feature/authSlice";
import { createContext, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";

interface AuthContextType {
  refresh: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const refreshTokenState = useSelector((state: RootState) => state.auth.refreshToken);

  const refresh = async () => {
    if (!refreshTokenState) return;
    try {
      const data = await refreshToken(refreshTokenState);
      dispatch(loginSuccess({ accessToken: data.accessToken, refreshToken: data.refreshToken }));
    } catch {
      dispatch(logout());
    }
  };

  return <AuthContext.Provider value={{ refresh }}>{children}</AuthContext.Provider>;
};
