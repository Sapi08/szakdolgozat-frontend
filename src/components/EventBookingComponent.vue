<template>
  <div class="container">
    <div class="calendar">
      <vue-cal
        locale="hu"
        :disable-views="['years', 'year', 'week', 'day']"
        :selected-date.sync="selectedDate"
        @click-date="selectDate"
      />
    </div>
    <div class="form">
      <h2>Rendezvényfoglalás</h2>
      <form @submit.prevent="submitBooking">
        <label>Dátum: <input type="text" v-model="formattedDate" readonly /></label>

        <label>Név: <input type="text" v-model="booking.name" required /></label>

        <label>Rendezvény jellege:
          <select v-model="booking.type" required>
            <option value="Esküvő">Esküvő</option>
            <option value="Születésnap">Születésnap</option>
            <option value="Egyéb">Egyéb</option>
          </select>
        </label>

        <label>Megjegyzés: <textarea v-model="booking.note"></textarea></label>

        <label>Email: <input type="email" v-model="booking.email" required /></label>

        <label>Telefonszám: <input type="tel" v-model="booking.phone" required /></label>

        <label>Hány főre: <input type="number" v-model="booking.guests" min="1" required /></label>

        <button type="submit">Foglalás</button>
      </form>
    </div>
  </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

export default {
  components: { VueCal },
  data() {
    return {
      selectedDate: null,
      booking: {
        name: '',
        type: '',
        note: '',
        email: '',
        phone: '',
        guests: 1,
      },
    };
  },
  computed: {
    formattedDate() {
      return this.selectedDate ? new Date(this.selectedDate).toLocaleDateString('hu-HU') : '';
    },
  },
  methods: {
    selectDate(date) {
      this.selectedDate = date;
    },
    submitBooking() {
      console.log("Foglalási adatok:", this.booking);
      alert("Foglalás sikeresen elküldve!");
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  gap: 20px;
}
.calendar {
  width: 50%;
}
.form {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
form {
  display: flex;
  flex-direction: column;
}
label {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}
button {
  margin-top: 10px;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
