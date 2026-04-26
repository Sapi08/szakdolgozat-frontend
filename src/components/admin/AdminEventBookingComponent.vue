<script lang="ts">
import { useAdminBookingStore } from '@/stores/admin/admin_booking_store'
import type { Booking } from '@/types/booking'

export default {
  name: 'AdminEventBookingComponent',
  data() {
    return {
      bookingStore: useAdminBookingStore(),
      selectedBooking: null as Booking | null,
      showModal: false,
      eventTypeLabels: {
        wedding: 'Esküvő',
        birthday_party: 'Születésnapi buli',
        corporate_event: 'Vállalati esemény',
        holiday: 'Ünnepi esemény',
        other: 'Egyéb',
      } as Record<string, string>,
    }
  },
  mounted() {
    this.bookingStore.fetchBookings()
  },
  methods: {
    async handleConfirm(id: number) {
      if (confirm('Biztosan elfogadod ezt a foglalást?')) {
        const result = await this.bookingStore.changeBookingStatus(id, true)
        if (result.success) {
          alert('Foglalás elfogadva!')
        } else {
          alert(result.message || 'Hiba történt')
        }
      }
    },
    async handleReject(id: number) {
      if (confirm('Biztosan elutasítod ezt a foglalást?')) {
        const result = await this.bookingStore.changeBookingStatus(id, false)
        if (result.success) {
          alert('Foglalás elutasítva!')
        } else {
          alert(result.message || 'Hiba történt')
        }
      }
    },
    viewBooking(id: number) {
      this.bookingStore.markAsSeen(id)
    },
    openModal(booking: Booking) {
      this.selectedBooking = booking
      this.showModal = true
      this.viewBooking(booking.id)
    },
    closeModal() {
      this.showModal = false
      this.selectedBooking = null
    },
    formatDate(dateStr: string) {
      return new Date(dateStr).toLocaleDateString('hu-HU')
    },
    getEventTypeLabel(type: string) {
      return this.eventTypeLabels[type] || type
    },
    getStatusText(booking: Booking) {
      if (booking.confirmed === true) return 'Elfogadva'
      if (booking.confirmed === false) return 'Elutasított'
      return 'Függőben'
    },
    getStatusClass(booking: Booking) {
      if (booking.confirmed === true) return 'confirmed'
      if (booking.confirmed === false) return 'rejected'
      return 'pending'
    },
    isPending(booking: Booking) {
      return booking.confirmed === null || booking.confirmed === undefined
    },
  },
}
</script>

<template>
  <div class="booking-management">
    <h2>Rendezvényfoglalások kezelése</h2>

    <div v-if="bookingStore.unseenCount > 0" class="notification">
      {{ bookingStore.unseenCount }} új, meg nem tekintett foglalás
    </div>

    <div v-if="bookingStore.loading" class="loading">Betöltés...</div>
    <div v-else-if="bookingStore.bookings.length === 0" class="empty">Nincsenek foglalások</div>

    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>Név</th>
            <th>Dátum</th>
            <th>Időpont</th>
            <th>Rendezvény típusa</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Létszám</th>
            <th>Megjegyzés</th>
            <th>Státusz</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="booking in bookingStore.bookings"
            :key="booking.id"
            :class="{ unseen: !booking.seen_by_admin }"
            @click="viewBooking(booking.id)"
            @dblclick="openModal(booking)"
          >
            <td>{{ booking.name }}</td>
            <td>{{ formatDate(booking.date) }}</td>
            <td>{{ booking.time }}</td>
            <td>{{ getEventTypeLabel(booking.type_of_event) }}</td>
            <td>{{ booking.email }}</td>
            <td>{{ booking.phone }}</td>
            <td>{{ booking.number_of_people }} fő</td>
            <td class="comment">{{ booking.comment || '-' }}</td>
            <td>
              <span :class="['status-badge', getStatusClass(booking)]">
                {{ getStatusText(booking) }}
              </span>
            </td>
            <td class="actions">
              <button
                v-if="isPending(booking)"
                @click.stop="handleConfirm(booking.id)"
                class="btn-accept"
              >
                Elfogad
              </button>
              <button
                v-if="isPending(booking)"
                @click.stop="handleReject(booking.id)"
                class="btn-reject"
              >
                Elutasít
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal && selectedBooking" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-modal-btn" @click="closeModal">&times;</button>
        <h3>Foglalás részletei</h3>

        <div class="modal-body">
          <p><strong>Név:</strong> {{ selectedBooking.name }}</p>
          <p><strong>Dátum:</strong> {{ formatDate(selectedBooking.date) }}</p>
          <p><strong>Időpont:</strong> {{ selectedBooking.time }}</p>
          <p><strong>Rendezvény típusa:</strong> {{ getEventTypeLabel(selectedBooking.type_of_event) }}</p>
          <p><strong>Email:</strong> {{ selectedBooking.email }}</p>
          <p><strong>Telefon:</strong> {{ selectedBooking.phone }}</p>
          <p><strong>Létszám:</strong> {{ selectedBooking.number_of_people }} fő</p>
          <p><strong>Státusz:</strong>
            <span :class="['status-badge', getStatusClass(selectedBooking)]">
              {{ getStatusText(selectedBooking) }}
            </span>
          </p>
          <div class="modal-comment">
            <strong>Megjegyzés:</strong>
            <p>{{ selectedBooking.comment || 'Nincs megjegyzés' }}</p>
          </div>
        </div>

        <div class="modal-actions" v-if="isPending(selectedBooking)">
          <button @click="handleConfirm(selectedBooking.id); closeModal()" class="btn-accept">Elfogad</button>
          <button @click="handleReject(selectedBooking.id); closeModal()" class="btn-reject">Elutasít</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.booking-management {
  padding: 2rem;
  margin-left: 300px;
}

.notification {
  background-color: #ffc107;
  color: #000;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-weight: bold;
}

.loading,
.empty {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.unseen {
  font-weight: bold;
  background-color: #e3f2fd;
}

.unseen:hover {
  background-color: #bbdefb;
}

tr:hover {
  background-color: #f8f9fa;
  cursor: pointer;
}

.comment {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.confirmed {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.rejected {
  background-color: #f8d7da;
  color: #721c24;
}

.actions {
  white-space: nowrap;
}

.btn-accept,
.btn-reject {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: opacity 0.3s;
}

.btn-accept {
  background-color: #28a745;
  color: white;
  margin-right: 0.5rem;
}

.btn-accept:hover {
  opacity: 0.9;
}

.btn-reject {
  background-color: #dc3545;
  color: white;
}

.btn-reject:hover {
  opacity: 0.9;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.close-modal-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.close-modal-btn:hover {
  color: #000;
}

.modal-body {
  margin-top: 1.5rem;
}

.modal-body p {
  margin-bottom: 0.5rem;
}

.modal-comment {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.modal-comment p {
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.modal-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
