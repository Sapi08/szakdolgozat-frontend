<script lang="ts">

import { defineComponent } from 'vue';
import { mapStores } from 'pinia'
import { useUserStore } from '@/stores/user_store.ts'

export default defineComponent({
  name: "ForgetPasswordFormComponent",

  data() {
    return {
      email: "",
      errors: {
        email: ""
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
        email: ""
      }
      this.backendError = ""
      this.successMessage = ""
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

      return isValid
    },
    isValidEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    async sendEmail() {
      if (this.validateForm()) {
        this.backendError = "";
        this.successMessage = "";
        this.loading = true;

        const result = await this.userStore.forgetPassword(this.email);

        this.loading = false;

        if (result.success) {
          this.successMessage = result.message;
          this.email = ""; // Tisztítjuk az email mezőt
        } else {
          this.backendError = result.message;
        }
      }
    },
    goToLogin() {
      this.$router.push("/login");
    },
    goToForgetPassword() {
      this.$router.push("/forget_pass");
    }
  }
})
</script>

<template>
  <div class="container">
    <h1>Új jelszó igénylése</h1>
    <p>Adjon meg egy érvényes e-mail címet.</p>
    <hr>

    <label for="email"><b>E-mail cím</b></label>
    <input type="email" placeholder="Adja meg az email címét" name="email" id="email"
           v-model="email" :class="{ 'error-input': errors.email }" :disabled="loading">
    <span v-if="errors.email" class="error-message">{{ errors.email }}</span>

    <!-- Success message -->
    <div v-if="successMessage" class="success-message">
      <span class="success-icon">✓</span>
      <span class="success-text">{{ successMessage }}</span>
    </div>

    <!-- Backend error message -->
    <div v-if="backendError" class="backend-error">
      <span class="error-icon">⚠️</span>
      <span class="error-text">{{ backendError }}</span>
    </div>

    <div class="d-flex justify-content-between">
      <button class="loginbtn" @click="goToLogin" :disabled="loading">Vissza</button>
      <button type="submit" class="loginbtn" @click="sendEmail" :disabled="loading">
        <span v-if="loading">Küldés...</span>
        <span v-else>Email küldése</span>
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
</style>
