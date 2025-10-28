import {defineStore} from "pinia";
import User from "@/models/user.ts";
import api from "@/config/axios.ts"

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: null as User | null,
      users: [] as User[],
      accessToken: localStorage.getItem("access_token") || null,
      refreshToken: localStorage.getItem("refresh_token") || null
    }
  },
  actions: {
    async register(email: string, password: string, firstname: string, lastname: string, phone: string, birthdate: string) {
      const res = await api.post("/register", {email, password, firstname, lastname, phone, birthdate});
      console.log("Sikeres regisztráció:", res.data);
    },

    async signIn(email: string, password: string) {
      try {
        const res = await api.post("/sign_in", {email, password});
        console.log(res)

        this.accessToken = res.data.access;
        this.refreshToken = res.data.refresh;

        localStorage.setItem("access_token", this.accessToken!);
        localStorage.setItem("refresh_token", this.refreshToken!);
        if (this.accessToken) {
          api.defaults.headers.common["Authorization"] = `Bearer ${this.accessToken}`;
        }

        console.log(this.accessToken);
        await this.userDetail();

      } catch (err) {
        console.error("Bejelentkezés hiba:", err);
        alert("Hibás email vagy jelszó.");
      }
    },
    async userDetail() {
      try {
        const res = await api.get("/user_details");
        this.user = res.data;
      } catch (err) {
        console.error("Profil lekérés hiba:", err);
        this.user = null;
      }
    },

    async loadUsers() {
      const res = await api.get("/users/");
      this.users = res.data as User[];
      return res.data;
    },

    async refreshTokenIfNeeded() {
      try {
        const res = await api.post("token/refresh/", {
          refresh: this.refreshToken
        });

        this.accessToken = res.data.access;
        localStorage.setItem("access_token", this.accessToken!);
        api.defaults.headers.common["Authorization"] = `Bearer ${this.accessToken}`;
      } catch (err) {
        console.error("Token frissítés sikertelen:", err);
        this.logout();
      }
    },
    logout() {
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      delete api.defaults.headers.common["Authorization"];
    },
    initAuth() {
      if (this.accessToken) {
        // Ha már van tokenünk localStorage-ból
        api.defaults.headers.common["Authorization"] = `Bearer ${this.accessToken}`;

        // Megpróbáljuk betölteni a felhasználó adatait
        this.userDetail().catch(async () => {
          // Ha hibás vagy lejárt az access token, próbáljuk frissíteni
          if (this.refreshToken) {
            await this.refreshTokenIfNeeded();
            await this.userDetail().catch(() => {
              // Ha ez sem sikerül, kijelentkeztetjük a felhasználót
              this.logout();
            });
          } else {
            this.logout();
          }
        });
      }
    }

  }
})
