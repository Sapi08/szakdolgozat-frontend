<script lang="ts">

import { defineComponent } from 'vue';
import { mapStores } from 'pinia'
import { useUserStore } from '@/stores/user_store.ts'

export default defineComponent({
  name: "CreateNewPasswordComponent",

  data() {
    return {
      password: "",
      passwordAgain: "",
      errors: {
        password: "",
        passwordAgain: ""
      },
      backendError: "",
      successMessage: "",
      loading: false
    }
  },
  computed: {
    ...mapStores(useUserStore)
  },
  methods: {
    clearErrors() {
      this.errors = {
        password: "",
        passwordAgain: ""
      }
      this.backendError = ""
      this.successMessage = ""
    },
    validateForm(): boolean {
      this.clearErrors()
      let isValid = true

      if (this.password.length === 0) {
        this.errors.password = "Kérjük, adja meg a jelszavát!"
        isValid = false
      } else if (this.password.length < 6) {
        this.errors.password = "A jelszónak legalább 6 karakter hosszúnak kell lennie!"
        isValid = false
      }

      if (this.passwordAgain.length === 0) {
        this.errors.passwordAgain = "Kérjük, ismételje meg a jelszót!"
        isValid = false
      } else if (this.password !== this.passwordAgain) {
        this.errors.passwordAgain = "A két jelszó nem egyezik meg!"
        isValid = false
      }

      return isValid
    },
    async createNewPassword() {
      if (this.validateForm()) {
        this.backendError = "";
        this.successMessage = "";
        this.loading = true;

        // Szerezd meg a tokent az URL-ből
        const token = this.$route.params.token || this.$route.query.token;

        const result = await this.userStore.resetPassword(token as string, this.password);

        this.loading = false;

        if (result.success) {
          this.successMessage = result.message;
          this.password = "";
          this.passwordAgain = "";
          // 2 másodperc után átirányítás a login oldalra
          setTimeout(() => {
            this.$router.push("/login");
          }, 2000);
        } else {
          this.backendError = result.message;
        }
      }
    },
    goToLogin() {
      this.$router.push("/login");
    }
  }
})
</script>

<template>
  <div class="container">
    <h1>Új jelszó létrehozása</h1>
    <p>Hozza létre új jelszavát!</p>
    <hr>

    <label for="psw"><b>Jelszó</b></label>
    <input type="password" placeholder="Adjon meg egy új jelszót" name="psw" id="psw"
           v-model="password" :class="{ 'error-input': errors.password }">
    <span v-if="errors.password" class="error-message">{{ errors.password }}</span>

    <label for="psw-repeat"><b>Jelszó ismét</b></label>
    <input type="password" placeholder="Ismételje meg az új jelszót" name="psw-repeat" id="psw-repeat"
           v-model="passwordAgain" :class="{ 'error-input': errors.passwordAgain }">
    <span v-if="errors.passwordAgain" class="error-message">{{ errors.passwordAgain }}</span>

    <div v-if="successMessage" class="success-message">
      <span class="success-icon">✓</span>
      <span class="success-text">{{ successMessage }}</span>
    </div>

    <div v-if="backendError" class="error-message" style="margin: 15px 0; padding: 12px; background-color: #ffe6e4; border-left: 4px solid #e86a61; border-radius: 8px;">
      {{ backendError }}
    </div>

    <div class="d-flex justify-content-between">
      <button class="loginbtn" @click="goToLogin" :disabled="loading">Vissza</button>
      <button type="submit" class="loginbtn" @click="createNewPassword" :disabled="loading">
        <span v-if="loading">Mentés...</span>
        <span v-else>Jelszó mentése</span>
      </button>
    </div>

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

input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.success-message {
  display: flex;
  align-items: center;
  background-color: #e8f5e9;
  border-left: 4px solid #4caf50;
  padding: 15px;
  margin: 20px 0;
  border-radius: 8px;
  animation: slideIn 0.3s ease-out;
}

.success-icon {
  font-size: 24px;
  margin-right: 12px;
  color: #4caf50;
  font-weight: bold;
}

.success-text {
  color: #2e7d32;
  font-size: 15px;
  font-weight: 500;
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
</style>
