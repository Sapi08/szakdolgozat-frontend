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
      calendarSelectedDate: new Date(),
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
    reservedEvents() {
      // Hátteret és stílust adunk neki "events" használatával, ez stabilabban formázza a naptárt
      return this.bookingStore.reservedDates
        .map((d: string) => {
          const dateStr = d.split('T')[0]
          if (!dateStr) return null
          return {
            start: `${dateStr} 00:00`,
            end: `${dateStr} 23:59`,
            title: 'Foglalt',
            class: 'reserved-bg-event',
            background: true,
          }
        })
        .filter(Boolean)
    },
    disabledDates() {
      // Dátum lista visszaállítása a disable-days funkció számára napi blokkoláshoz (plusz css)
      return this.bookingStore.reservedDates.map((d: string) => d.split('T')[0])
    },
  },
  async mounted() {
    await this.bookingStore.fetchReservedDates()
  },
  methods: {
    normalizeCellDate(payload: unknown): Date | null {
      // vue-cal can emit either a Date or a payload object with date/start.
      if (payload instanceof Date) return payload

      if (typeof payload === 'object' && payload !== null) {
        const maybeDate = payload as { date?: string | Date; start?: string | Date }
        if (maybeDate.date) return new Date(maybeDate.date)
        if (maybeDate.start) return new Date(maybeDate.start)
      }

      return null
    },
    toLocalDateString(date: Date): string {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    selectDate(payload: unknown) {
      const pickedDate = this.normalizeCellDate(payload)
      if (!pickedDate) return

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const pickedDay = new Date(pickedDate)
      pickedDay.setHours(0, 0, 0, 0)
      const dateString = this.toLocalDateString(pickedDay)

      const isReserved = this.bookingStore.reservedDates.some((d: string) =>
        d.split('T')[0] === dateString,
      )

      if (isReserved || pickedDay < today) return

      this.selectedDate = pickedDay
      this.calendarSelectedDate = pickedDay
    },
    async submitBooking() {
      if (!this.selectedDate) {
        alert('Kérlek válassz dátumot!')
        return
      }

      const result = await this.bookingStore.createBooking({
        ...this.booking,
        date: this.toLocalDateString(this.selectedDate),
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
        this.calendarSelectedDate = new Date()
        await this.bookingStore.fetchReservedDates()
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
        :selected-date="calendarSelectedDate"
        :disable-days="disabledDates"
        :events="reservedEvents"
        :min-date="new Date()"
        @cell-click="selectDate"
        @cell-dblclick="selectDate"
        class="vuecal--rounded-theme vuecal--green-theme"
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
  background-color: #e8786f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #dd574e;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* VueCal Custom Styles for Reserved Dates (as Background Events) */
:deep(.vuecal__cell--disabled) {
  cursor: not-allowed !important;
}

/* Reserved day small count badge (the red circle with "1") */
:deep(.vuecal--green-theme .vuecal__cell--disabled.vuecal__cell--has-events .vuecal__cell-events-count) {
  background-color: #dc3545 !important;
  color: transparent !important;
  border: 1px solid #dc3545 !important;

  width: 40px;
  height: 24px;
  margin-top: 14px;
  padding-top: 5px;
}

/* Felkiáltójel */
:deep(.vuecal--green-theme .vuecal__cell--disabled.vuecal__cell--has-events .vuecal__cell-events-count::after) {
  content: "Foglalt";
  color: #fff;
  font-size: 10px;
  font-weight: bold;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

:deep(.vuecal__event.reserved-bg-event) {
  background-color: #ffebee !important;
  color: #c62828 !important;
  cursor: not-allowed !important;
  display: flex !important;
  align-items: flex-end !important;
  justify-content: center !important;
  font-weight: bold !important;
  font-size: 13px !important;
  padding-bottom: 5px !important;
  border-radius: 4px;
}

:deep(.vuecal__cell--selected) {
  background-color: #e8786f !important;
  color: white !important;
  border-radius: 40px;
}

:deep(.vuecal--green-theme .vuecal__menu, .vuecal--green-theme .vuecal__cell-events-count) {
  background-color: #e86a61 !important;
  color: #fff;
}

:deep(.vuecal--green-theme .vuecal__title-bar) {
  background-color: #ffd783;
}

:deep(.vuecal--rounded-theme.vuecal--green-theme:not(.vuecal--day-view) .vuecal__cell-content) {
  background-color: #ffd783;
  border: none;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
</style>
