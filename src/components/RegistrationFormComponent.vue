<script lang="ts">
import {defineComponent} from 'vue'
import {mapStores} from "pinia";
import {useUserStore} from "@/stores/user_store.ts";

export default defineComponent({
  name: "RegistrationFormComponent",
  data(){
    return {
      firstName: "",
      lastName: "",
      phone: "",
      birthDate: "",
      email: "",
      password: "",
      passwordAgain: "",
      errors: {
        firstName: "",
        lastName: "",
        phone: "",
        birthDate: "",
        email: "",
        password: "",
        passwordAgain: ""
      },
      backendError: "",
      successMessage: ""
    }
  },
  computed:{
    ...mapStores(useUserStore)
  },
  methods:{
    clearErrors(){
      this.errors = {
        firstName: "",
        lastName: "",
        phone: "",
        birthDate: "",
        email: "",
        password: "",
        passwordAgain: ""
      }
    },
    validateForm(): boolean {
      this.clearErrors()
      let isValid = true

      if (this.firstName.length === 0){
        this.errors.firstName = "Kérjük, adja meg a keresztnevét!"
        isValid = false
      }

      if (this.lastName.length === 0){
        this.errors.lastName = "Kérjük, adja meg a vezetéknevét!"
        isValid = false
      }

      if (this.phone.length === 0){
        this.errors.phone = "Kérjük, adja meg a telefonszámát!"
        isValid = false
      } else {
        if (!this.isValidPhone(this.phone)){
          this.errors.phone = "Kérjük, adjon meg egy érvényes telefonszámot!"
          isValid = false
        }
      }

      if (this.birthDate.length === 0){
        this.errors.birthDate = "Kérjük, adja meg a születési dátumát!"
        isValid = false
      } else {
        const today = new Date()
        const birthDateObj = new Date(this.birthDate)
        if (birthDateObj >= today){
          this.errors.birthDate = "Kérjük, adjon meg egy érvényes születési dátumot!"
          isValid = false
        }
      }

      if (this.email.length === 0){
        this.errors.email = "Kérjük, adja meg az email címét!"
        isValid = false
      } else if (!this.isValidEmail(this.email)){
        this.errors.email = "Kérjük, adjon meg egy érvényes email címet!"
        isValid = false
      }

      if (this.password.length === 0){
        this.errors.password = "Kérjük, adjon meg egy jelszót!"
        isValid = false
      } else if (this.password.length < 6){
        this.errors.password = "A jelszónak legalább 6 karakter hosszúnak kell lennie!"
        isValid = false
      }

      if (this.passwordAgain.length === 0){
        this.errors.passwordAgain = "Kérjük, ismételje meg a jelszót!"
        isValid = false
      } else if (this.password !== this.passwordAgain){
        this.errors.passwordAgain = "A két jelszó nem egyezik!"
        isValid = false
      }

      return isValid
    },
    isValidEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    isValidPhone(phone: string): boolean {
      const phoneRegex = /^\+?[0-9]{7,15}$/
      return phoneRegex.test(phone)
    },
    async register(){
      if (this.validateForm()) {
        // Clear previous messages
        this.backendError = ""
        this.successMessage = ""

        const result = await this.userStore.register(
          this.email,
          this.password,
          this.firstName,
          this.lastName,
          this.phone,
          this.birthDate
        )

        if (result.success) {
          // Show success message
          this.successMessage = result.message

          // Wait 2 seconds then navigate to login
          setTimeout(() => {
            this.$router.push('/login')
          }, 2000)
        } else {
          // Show backend error
          this.backendError = result.message
        }
      }
    }
  }
})
</script>

<template>
  <div class="container">
    <h1>Regisztráció</h1>
    <p>Kérem töltse ki a mezőket a regisztrációhoz.</p>
    <hr>

    <label for="first_name"><b>Keresztnév</b></label>
    <input type="text" placeholder="Adja meg a keresztnevét" name="first_name" id="first_name"
           v-model="firstName" :class="{ 'error-input': errors.firstName }">
    <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>

    <label for="last_name"><b>Vezetéknév</b></label>
    <input type="text" placeholder="Adja meg a vezetéknevét" name="last_name" id="last_name"
           v-model="lastName" :class="{ 'error-input': errors.lastName }">
    <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>

    <label for="birth_date"><b>Születési dátum</b></label>
    <input type="date" name="birth_date" id="birth_date"
           v-model="birthDate" :class="{ 'error-input': errors.birthDate }">
    <span v-if="errors.birthDate" class="error-message">{{ errors.birthDate }}</span>

    <label for="phone"><b>Telefonszám</b></label>
    <input type="tel" placeholder="Adja meg a telefonszámát" name="phone" id="phone"
           v-model="phone" :class="{ 'error-input': errors.phone }">
    <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>

    <label for="email"><b>E-mail cím</b></label>
    <input type="email" placeholder="Adja meg az email címét" name="email" id="email"
           v-model="email" :class="{ 'error-input': errors.email }">
    <span v-if="errors.email" class="error-message">{{ errors.email }}</span>

    <label for="psw"><b>Jelszó</b></label>
    <input type="password" placeholder="Adjon meg egy jelszót" name="psw" id="psw"
           v-model="password" :class="{ 'error-input': errors.password }">
    <span v-if="errors.password" class="error-message">{{ errors.password }}</span>

    <label for="psw-repeat"><b>Jelszó ismét</b></label>
    <input type="password" placeholder="Ismételje meg a jelszót" name="psw-repeat" id="psw-repeat"
           v-model="passwordAgain" :class="{ 'error-input': errors.passwordAgain }">
    <span v-if="errors.passwordAgain" class="error-message">{{ errors.passwordAgain }}</span>

    <hr>

    <!-- Backend error message -->
    <div v-if="backendError" class="backend-error">
      <span class="error-icon">⚠️</span>
      <span class="error-text">{{ backendError }}</span>
    </div>

    <!-- Success message -->
    <div v-if="successMessage" class="success-message">
      <span class="success-icon">✓</span>
      <span class="success-text">{{ successMessage }}</span>
      <p class="redirect-info">Átirányítás a bejelentkezéshez...</p>
    </div>

    <p>A regisztrációval ön hozzájárul <a href="#">Szabályzatainkhoz</a>.</p>

    <button type="submit" class="registerbtn" @click="register">Regisztráció</button>
  </div>

</template>

<style scoped>

.container {
  padding-top: 160px;
  background-color: white;
}

input[type=text],
input[type=password],
input[type=email],
input[type=tel],
input[type=date] {
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
input[type=email]:focus,
input[type=tel]:focus,
input[type=date]:focus {
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

.success-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #e8f5e9;
  border-left: 4px solid #4caf50;
  padding: 20px;
  margin: 20px 0;
  border-radius: 8px;
  animation: slideIn 0.3s ease-out;
}

.success-icon {
  font-size: 48px;
  color: #4caf50;
  margin-bottom: 10px;
}

.success-text {
  color: #2e7d32;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.redirect-info {
  color: #66bb6a;
  font-size: 14px;
  margin: 5px 0 0 0;
  font-style: italic;
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

.registerbtn {
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

.registerbtn:hover {
  opacity: 1;
}

a {
  color: dodgerblue;
}
</style>
