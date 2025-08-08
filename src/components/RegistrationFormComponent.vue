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
      passwordAgain: ""
    }
  },
  computed:{
    ...mapStores(useUserStore)
  },
  methods:{
    register(){
      if (this.email.length == 0){
        alert("Üres email!")
      }
      else if (this.password.length == 0){
        alert("Üres jelszó!")
      }
      else if (this.password != this.passwordAgain){
        alert("Különböző jelszavak!")
      }
      else if (this.firstName.length == 0){
        alert("Add meg a neved!")
      }
      else if (this.lastName.length == 0){
        alert("Add meg a neved!")
      }
      else if (this.phone.length == 0){
        alert("Add meg a telefon számot!")
      }
      else if (this.birthDate.length == 0){
        alert("Add meg a születési dátumod!")
      }
      else {
        this.userStore.register(this.email, this.password, this.firstName, this.lastName, this.phone, this.birthDate)
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
    <input type="text" placeholder="Add meg a keresztneved" name="first_name" id="first_name" required v-model="firstName">

    <label for="last_name"><b>Vezetéknév</b></label>
    <input type="text" placeholder="Add meg a vezetékneved" name="last_name" id="last_name" required v-model="lastName">

    <label for="birth_date"><b>Születési dátum</b></label><br>
    <input type="date" name="birth_date" id="birth_date" required v-model="birthDate">
    <br>
    <label for="phone"><b>Telefonszám</b></label>
    <input type="text" placeholder="Add meg a telefonszámod" name="phone" id="phone" required v-model="phone">

    <label for="email"><b>E-mail cím</b></label>
    <input type="text" placeholder="Add meg az email címed" name="email" id="email" required v-model="email">

    <label for="psw"><b>Jelszó</b></label>
    <input type="password" placeholder="Adj meg egy jelszót" name="psw" id="psw" required v-model="password">

    <label for="psw-repeat"><b>Jelszó ismét</b></label>
    <input type="password" placeholder="Ismételd meg a jelszót" name="psw-repeat" id="psw-repeat" required v-model="passwordAgain">

    <hr>
    <p>A regisztrációval ön hozzájárul <a href="#">Szabályzatainkhoz</a>.</p>

    <button type="submit" class="registerbtn" @click="register">Regisztráció</button>
  </div>

</template>

<style scoped>

.container {
  padding-top: 160px;
  background-color: white;
}

input[type=text], input[type=password] {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  display: inline-block;
  border: none;
  background: #f1f1f1;
  border-radius: 10px;
}

input[type=text]:focus, input[type=password]:focus {
  background-color: #ddd;
  outline: none;
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
