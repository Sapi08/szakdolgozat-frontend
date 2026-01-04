import {defineStore} from "pinia";
import User from "@/models/user.ts";
import api from "@/config/axios.ts"
import { AxiosError } from "axios";

interface UserWithDetails {
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  birth_date?: string;
  points?: number;
  is_staff?: boolean;
}

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: null as UserWithDetails | null,
      users: [] as User[],
      accessToken: localStorage.getItem("access_token") || null,
      refreshToken: localStorage.getItem("refresh_token") || null
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.accessToken && !!state.user,
    isAdmin: (state) => state.user?.is_staff || false,
  },
  actions: {
    async register(email: string, password: string, firstname: string, lastname: string, phone: string, birthdate: string) {
      try {
        const res = await api.post("/register", { email, password, firstname, lastname, phone, birthdate });
        console.log("Sikeres regisztráció:", res.data);
        return { success: true, message: "Sikeres regisztráció!" };

      } catch (err) {
        console.error("Regisztrációs hiba:", err);

        if (err instanceof AxiosError) {
          if (err.response) {
            const status = err.response.status;

            if (status === 400) {
              // Email már létezik vagy hibás adatok
              return { success: false, message: "Ez az email cím már regisztrálva van!" };
            } else if (status === 422) {
              // Validációs hibák
              return { success: false, message: "Hibás adatok! Kérjük, ellenőrizze a mezőket!" };
            } else {
              return { success: false, message: "Váratlan hiba történt. Kérjük, próbálja újra később!" };
            }
          } else if (err.request) {
            return { success: false, message: "Nem sikerült kapcsolódni a szerverhez!" };
          }
        }

        return { success: false, message: "Váratlan hiba történt!" };
      }
    },

    async signIn(email: string, password: string) {
      try {
        const res = await api.post("/sign_in", { email, password });
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

        return {
          success: true,
          message: "",
          is_staff: this.user?.is_staff ?? false,
        };

      } catch (err) {
        console.error("Bejelentkezés hiba:", err);

        if (err instanceof AxiosError) {
          if (err.response) {
            const status = err.response.status;

            if (status === 401 || status === 400) {
              return { success: false, message: "Hibás email vagy jelszó!" };
            } else {
              return { success: false, message: "Váratlan hiba történt. Kérjük, próbálja újra később!" };
            }
          } else if (err.request) {
            return { success: false, message: "Nem sikerült kapcsolódni a szerverhez!" };
          }
        }

        return { success: false, message: "Váratlan hiba történt!" };
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
        // Az axios interceptor automatikusan kezeli a token refresh-t
        this.userDetail().catch(() => {
          // Ha minden próbálkozás sikertelen (beleértve az automatikus refresh-t is)
          // akkor már az interceptor levágta a felhasználót
          console.log("Nem sikerült betölteni a felhasználói adatokat");
        });
      }
    },

    async forgetPassword(email: string) {
      try {
        const res = await api.post("/forget_password", { email });
        console.log("Jelszóemlékeztető kérés sikeres" + res.data);
        // Biztonsági okokból mindig ugyanazt az üzenetet adjuk vissza
        // Így nem áruljuk el, hogy létezik-e az email cím az adatbázisban
        return {
          success: true,
          message: "Ha ez az email cím regisztrálva van, elküldtünk egy jelszóvisszaállító linket."
        };
      } catch (err) {
        console.error("Jelszóemlékeztető hiba:", err);

        if (err instanceof AxiosError) {
          if (err.response) {
            const status = err.response.status;

            // Rate limiting esetén egyértelmű üzenet
            if (status === 429) {
              return {
                success: false,
                message: "Túl sok próbálkozás! Kérjük, próbálja újra 5 perc múlva."
              };
            } else if (status >= 500) {
              return {
                success: false,
                message: "Szerverhiba történt. Kérjük, próbálja újra később!"
              };
            }

            // Minden más esetben (400, 404, stb.) is ugyanaz az üzenet
            // Biztonsági ok: ne áruljuk el, hogy létezik-e az email
            return {
              success: true,
              message: "Ha ez az email cím regisztrálva van, elküldtünk egy jelszóvisszaállító linket."
            };

          } else if (err.request) {
            return {
              success: false,
              message: "Nem sikerült kapcsolódni a szerverhez!"
            };
          }
        }

        return {
          success: false,
          message: "Váratlan hiba történt!"
        };
      }
    },

    async resetPassword(token: string, password: string) {
      try {
        const res = await api.post("/reset_password", { token, password });
        console.log("Jelszó sikeresen megváltoztatva:", res.data);
        return {
          success: true,
          message: "Jelszó sikeresen megváltoztatva! Átirányítás a bejelentkezési oldalra..."
        };
      } catch (err) {
        console.error("Jelszó visszaállítási hiba:", err);

        if (err instanceof AxiosError) {
          if (err.response) {
            const status = err.response.status;

            if (status === 400) {
              return {
                success: false,
                message: "Érvénytelen vagy lejárt token! Kérjük, kezdje újra a jelszó visszaállítási folyamatot."
              };
            } else if (status === 404) {
              return {
                success: false,
                message: "Érvénytelen link! Kérjük, kérjen új jelszó visszaállító linket."
              };
            } else if (status === 422) {
              return {
                success: false,
                message: "A jelszó túl gyenge! Minimum 6 karakter szükséges."
              };
            } else if (status >= 500) {
              return {
                success: false,
                message: "Szerverhiba történt. Kérjük, próbálja újra később!"
              };
            }

            return {
              success: false,
              message: "Hiba történt a jelszó megváltoztatása során!"
            };

          } else if (err.request) {
            return {
              success: false,
              message: "Nem sikerült kapcsolódni a szerverhez!"
            };
          }
        }
      }
    }
  }
});
