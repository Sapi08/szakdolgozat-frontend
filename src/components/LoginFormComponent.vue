<script lang="ts">
import {defineComponent} from "vue";
import {mapStores} from "pinia";
import {useUserStore} from "@/stores/user_store.ts";

export default defineComponent({
  name: "RegistrationFormComponent",
  data() {
    return {
      email: "",
      password: ""
    }
  },
  computed: {
    ...mapStores(useUserStore)
  },
  methods: {
    signIn() {
      if (this.email.length == 0) {
        alert("Üres email!")
      } else if (this.password.length == 0) {
        alert("Üres jelszó!")
      } else {
        this.userStore.signIn(this.email, this.password)
        this.$router.push("/")
      }
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
    <input type="text" placeholder="Enter Email" name="email" id="email" required v-model="email">

    <label for="psw"><b>Jelszó</b></label>
    <input type="password" placeholder="Enter Password" name="psw" id="psw" required v-model="password">

    <p><a href="#">Szabályzat</a></p>

    <button type="submit" class="loginbtn" @click="signIn">Belépés</button>
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
