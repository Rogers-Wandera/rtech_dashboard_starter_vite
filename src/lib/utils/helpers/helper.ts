import { TypeToken } from "@/types/app/auth/auth.types";
import { jwtDecode } from "jwt-decode";
import Crypto from "crypto-js";

export class HelperClass {
  checkEnviroment() {
    const isDevelopment = import.meta.env.MODE === "development";
    const isProduction = import.meta.env.MODE === "production";
    return { isDevelopment, isProduction };
  }
  isTokenToExpire(token: string | null, threshhold = 20) {
    if (token === null) {
      return true;
    }
    if (token.length <= 0) {
      return true;
    }
    try {
      const decodedToken = jwtDecode<TypeToken>(token);
      const currentTime = Date.now() / 1000;
      const timeLeft = decodedToken.exp - currentTime;
      return timeLeft < threshhold * 60;
    } catch (error) {
      return true;
    }
  }

  isTokenExpired(token: string | null) {
    try {
      if (!token) {
        return true;
      }
      const decodedToken = jwtDecode<TypeToken>(token);
      const expired = decodedToken?.exp * 1000 < Date.now();
      return expired;
    } catch (error) {
      return true;
    }
  }
  encrypt = (input: string) => {
    const secretKey = import.meta.env.VITE_ENCRYPTION_KEY;
    const cipherInput = Crypto.AES.encrypt(input, secretKey).toString();
    return cipherInput;
  };

  decrypt = (encrypted: string) => {
    const secretKey = import.meta.env.VITE_ENCRYPTION_KEY;
    const bytes = Crypto.AES.decrypt(encrypted, secretKey);
    const ciphedInput = bytes.toString(Crypto.enc.Utf8);
    return ciphedInput;
  };

  encryptUrl = (input: string) => {
    const encrypted = this.encrypt(input);
    return encodeURIComponent(encrypted);
  };

  decryptUrl = (input: string) => {
    const secretKey = import.meta.env.VITE_ENCRYPTION_KEY;
    const bytes = Crypto.AES.decrypt(decodeURIComponent(input), secretKey);
    const ciphedInput = bytes.toString(Crypto.enc.Utf8);
    return ciphedInput;
  };
}
