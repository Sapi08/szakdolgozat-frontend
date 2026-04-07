<script lang="ts">
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { useBookingStore } from '@/stores/booking_store'

export default {
  name: 'EventBookingComponent',
  components: {
    VueCal,
  },
  data() {
    return {
      bookingStore: useBookingStore(),
      selectedDate: null as Date | null,
      booking: {
        name: '',
        email: '',
        phone: '',
        time: '18:00',
        number_of_people: 1,
        type_of_event: 'wedding',
        comment: '',
      },
      eventTypes: [
        { value: 'wedding', label: 'Esküvő' },
        { value: 'birthday_party', label: 'Születésnapi buli' },
        { value: 'corporate_event', label: 'Vállalati esemény' },
        { value: 'holiday', label: 'Ünnepi esemény' },
        { value: 'other', label: 'Egyéb' },
      ],
    }
  },
  computed: {
    formattedDate() {
      return this.selectedDate ? new Date(this.selectedDate).toLocaleDateString('hu-HU') : ''
    },
  },
  methods: {
    selectDate(date: Date) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (date >= today) {
        this.selectedDate = date
      }
    },
    async submitBooking() {
      if (!this.selectedDate) {
        alert('Kérlek válassz dátumot!')
        return
      }

      const result = await this.bookingStore.createBooking({
        ...this.booking,
        date: this.selectedDate.toISOString().split('T')[0],
      })

      if (result.success) {
        alert('Foglalás sikeresen elküldve! Hamarosan felvesszük Önnel a kapcsolatot.')
        this.booking = {
          name: '',
          email: '',
          phone: '',
          time: '18:00',
          number_of_people: 1,
          type_of_event: 'wedding',
          comment: '',
        }
        this.selectedDate = null
      } else {
        const errorMsg = result.details
          ? `${result.message}\n${JSON.stringify(result.details)}`
          : result.message
        alert(errorMsg || 'Hiba történt a foglalás során.')
      }
    },
  },
}
</script>

<template>
  <div class="container">
    <div class="calendar">
      <vue-cal
        locale="hu"
        :disable-views="['years', 'year', 'week', 'day']"
        :selected-date="selectedDate"
        @cell-click="selectDate"
      />
    </div>
    <div class="form">
      <h2>Rendezvényfoglalás</h2>
      <form @submit.prevent="submitBooking">
        <label>
          Dátum:
          <input type="text" :value="formattedDate" readonly required />
        </label>

        <label>
          Név:
          <input type="text" v-model="booking.name" required />
        </label>

        <label>
          Email:
          <input type="email" v-model="booking.email" required />
        </label>

        <label>
          Telefonszám:
          <input type="tel" v-model="booking.phone" required />
        </label>

        <label>
          Időpont:
          <input type="time" v-model="booking.time" required />
        </label>

        <label>
          Rendezvény típusa:
          <select v-model="booking.type_of_event" required>
            <option v-for="type in eventTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </label>

        <label>
          Létszám (fő):
          <input type="number" v-model.number="booking.number_of_people" min="1" required />
        </label>

        <label>
          Megjegyzés:
          <textarea v-model="booking.comment" rows="4"></textarea>
        </label>

        <button type="submit" :disabled="bookingStore.loading">
          {{ bookingStore.loading ? 'Küldés...' : 'Foglalás küldése' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.calendar {
  flex: 1;
  min-width: 400px;
}

.form {
  flex: 1;
  max-width: 500px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 500;
}

input,
select,
textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  resize: vertical;
}

button {
  padding: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
</style>
