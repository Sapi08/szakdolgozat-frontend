<script lang="ts">
import { useAdminBookingStore } from '@/stores/admin/admin_booking_store'
import type { Booking } from '@/types/booking'

export default {
  name: 'AdminEventBookingComponent',
  data() {
    return {
      bookingStore: useAdminBookingStore(),
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
        const result = await this.bookingStore.confirmBooking(id, true)
        if (result.success) {
          alert('Foglalás elfogadva!')
        } else {
          alert(result.message || 'Hiba történt')
        }
      }
    },
    async handleReject(id: number) {
      if (confirm('Biztosan elutasítod ezt a foglalást?')) {
        const result = await this.bookingStore.confirmBooking(id, false)
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
    formatDate(dateStr: string) {
      return new Date(dateStr).toLocaleDateString('hu-HU')
    },
    getEventTypeLabel(type: string) {
      return this.eventTypeLabels[type] || type
    },
    getStatusText(booking: Booking) {
      if (booking.confirmed) return 'Elfogadva'
      return 'Függőben'
    },
    getStatusClass(booking: Booking) {
      if (booking.confirmed) return 'confirmed'
      return 'pending'
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
                v-if="!booking.confirmed"
                @click.stop="handleConfirm(booking.id)"
                class="btn-accept"
              >
                Elfogad
              </button>
              <button
                v-if="!booking.confirmed"
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
</style>
