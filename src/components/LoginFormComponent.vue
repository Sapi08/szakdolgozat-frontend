<script lang="ts">
import {defineComponent} from "vue";
import {mapStores} from "pinia";
import {useUserStore} from "@/stores/user_store.ts";

export default defineComponent({
  name: "RegistrationFormComponent",
  data() {
    return {
      email: "",
      password: "",
      errors: {
        email: "",
        password: ""
      },
      backendError: ""
    }
  },
  computed: {
    ...mapStores(useUserStore)
  },
  methods: {
    clearErrors() {
      this.errors = {
        email: "",
        password: ""
      }
    },
    validateForm(): boolean {
      this.clearErrors()
      let isValid = true

      if (this.email.length === 0) {
        this.errors.email = "Kérjük, adja meg az email címét!"
        isValid = false
      } else if (!this.isValidEmail(this.email)) {
        this.errors.email = "Kérjük, adjon meg egy érvényes email címet!"
        isValid = false
      }

      if (this.password.length === 0) {
        this.errors.password = "Kérjük, adja meg a jelszavát!"
        isValid = false
      }

      return isValid
    },
    isValidEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    async signIn() {
      if (this.validateForm()) {
        this.backendError = "";

        const result = await this.userStore.signIn(this.email, this.password);

        if (result.success) {
          this.$router.push("/");
        } else {
          this.backendError = result.message;
        }
      }
    },
    goToRegister() {
      this.$router.push("/register");
    }
  }
})
</script>

<template>
  <div class="container">
    <h1>Belépés</h1>
    <p>Kérem töltse ki a mezőket a belépéshez.</p>
    <hr>

    <label for="email"><b>E-mail cím</b></label>
    <input type="email" placeholder="Adja meg az email címét" name="email" id="email"
           v-model="email" :class="{ 'error-input': errors.email }">
    <span v-if="errors.email" class="error-message">{{ errors.email }}</span>

    <label for="psw"><b>Jelszó</b></label>
    <input type="password" placeholder="Adja meg a jelszavát" name="psw" id="psw"
           v-model="password" :class="{ 'error-input': errors.password }">
    <span v-if="errors.password" class="error-message">{{ errors.password }}</span>

    <!-- Backend error message -->
    <div v-if="backendError" class="backend-error">
      <span class="error-icon">⚠️</span>
      <span class="error-text">{{ backendError }}</span>
    </div>

    <p class="register-link">
      Még nincs fiókja? <a @click="goToRegister" class="register-link-btn">Regisztráció</a>
    </p>

    <p><a href="#">Szabályzat</a></p>

    <button type="submit" class="loginbtn" @click="signIn">Belépés</button>
  </div>
</template>

<style scoped>
.container {
  padding-top: 160px;
  background-color: white;
}

input[type=text],
input[type=password],
input[type=email] {
  width: 100%;
  padding: 15px;
  margin: 5px 0 8px 0;
  display: inline-block;
  border: none;
  background: #f1f1f1;
  border-radius: 10px;
}

input[type=text]:focus,
input[type=password]:focus,
input[type=email]:focus {
  background-color: #ddd;
  outline: none;
}

.error-input {
  border: 2px solid #e86a61 !important;
  background-color: #ffe6e4 !important;
}

.error-message {
  display: block;
  color: #e86a61;
  font-size: 14px;
  margin: -5px 0 15px 5px;
  font-weight: 500;
}

.backend-error {
  display: flex;
  align-items: center;
  background-color: #ffe6e4;
  border-left: 4px solid #e86a61;
  padding: 15px;
  margin: 20px 0;
  border-radius: 8px;
  animation: slideIn 0.3s ease-out;
}

.error-icon {
  font-size: 24px;
  margin-right: 12px;
}

.error-text {
  color: #d32f2f;
  font-size: 15px;
  font-weight: 500;
}

.register-link {
  text-align: center;
  margin: 20px 0;
  font-size: 15px;
  color: #666;
}

.register-link-btn {
  color: #e86a61;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.register-link-btn:hover {
  color: #e8786f;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

hr {
  border: 1px solid #f1f1f1;
  margin-bottom: 25px;
}

.loginbtn {
  background-color: #e86a61;
  color: white;
  padding: 16px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 15%;
  opacity: 0.9;
  border-radius: 10px;
}

.loginbtn:hover {
  opacity: 1;
}

a {
  color: dodgerblue;
}
</style>
