<script lang="ts">
import { defineComponent, onMounted, computed, ref } from 'vue'
import { useUserStore } from '@/stores/user_store.ts'

interface UserDetails {
  email: string
  name: string
  first_name?: string
  last_name?: string
  phone?: string
  birth_date?: string
  points?: number
}

export default defineComponent({
  name: 'ProfileComponent',
  setup() {
    const userStore = useUserStore()

    const user = computed(() => userStore.user as UserDetails | null)

    const showModal = ref(false)
    const activeTab = ref('profile')

    const editProfileForm = ref({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      birth_date: ''
    })

    const passwordForm = ref({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const openEditModal = () => {
      if (user.value) {
        editProfileForm.value = {
          first_name: user.value.first_name || '',
          last_name: user.value.last_name || '',
          email: user.value.email || '',
          phone: user.value.phone || '',
          birth_date: user.value.birth_date || ''
        }
      }
      activeTab.value = 'profile'
      passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
      showModal.value = true
    }

    const closeEditModal = () => {
      showModal.value = false
    }

    const validatePhone = (phone: string) => {
      if (!phone) return true // Optional
      const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
      return phoneRegex.test(phone)
    }

    const saveProfile = async () => {
      if (!editProfileForm.value.email.includes('@')) {
        alert('Helytelen email formátum!')
        return
      }
      if (editProfileForm.value.phone && !validatePhone(editProfileForm.value.phone)) {
        alert('Helytelen telefonszám formátum!')
        return
      }

      const res = await userStore.updateProfile(editProfileForm.value)
      if (res?.success) {
        alert(res.message)
        closeEditModal()
      } else if (res) {
        alert(res.message)
      }
    }

    const savePassword = async () => {
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        alert('Új jelszavak nem egyeznek!')
        return
      }
      if (passwordForm.value.newPassword.length < 6) {
        alert('Az új jelszónak legalább 6 karakter hosszúnak kell lennie!')
        return
      }
      const res = await userStore.changePassword(
        passwordForm.value.oldPassword,
        passwordForm.value.newPassword
      )
      if (res?.success) {
        alert(res.message)
        closeEditModal()
      } else if (res) {
        alert(res.message)
      }
    }

    onMounted(async () => {
      await userStore.userDetail()
    })

    return {
      user,
      showModal,
      activeTab,
      editProfileForm,
      passwordForm,
      openEditModal,
      closeEditModal,
      saveProfile,
      savePassword
    }
  },
})
</script>

<template>
  <div class="profile-wrapper">
    <div class="profile-container" v-if="user">
      <div class="profile-header">
        <div class="profile-avatar">
          <span class="avatar-text"
            >{{ user.first_name?.charAt(0) }}{{ user.last_name?.charAt(0) }}</span
          >
        </div>
        <h2 class="profile-title">Profil adatok</h2>
        <button class="edit-btn" @click="openEditModal">✍️ Adatok szerkesztése</button>
      </div>

      <div class="profile-content">
        <div class="profile-section">
          <h3 class="section-title">Személyes adatok</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-icon">👤</span>
              <div class="info-details">
                <span class="info-label">Vezetéknév</span>
                <span class="info-value">{{ user.last_name }}</span>
              </div>
            </div>

            <div class="info-item">
              <span class="info-icon">👤</span>
              <div class="info-details">
                <span class="info-label">Keresztnév</span>
                <span class="info-value">{{ user.first_name }}</span>
              </div>
            </div>

            <div class="info-item">
              <span class="info-icon">✉️</span>
              <div class="info-details">
                <span class="info-label">Email</span>
                <span class="info-value">{{ user.email }}</span>
              </div>
            </div>

            <div class="info-item">
              <span class="info-icon">📱</span>
              <div class="info-details">
                <span class="info-label">Telefonszám</span>
                <span class="info-value">{{ user.phone || 'Nincs megadva' }}</span>
              </div>
            </div>

            <div class="info-item">
              <span class="info-icon">🎂</span>
              <div class="info-details">
                <span class="info-label">Születési dátum</span>
                <span class="info-value">{{ user.birth_date || 'Nincs megadva' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="profile-section points-section">
          <div class="points-card">
            <span class="points-icon">⭐</span>
            <div class="points-content">
              <span class="points-label">Pontjaim</span>
              <span class="points-value">{{ user.points ?? 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="loading-container" v-else>
      <div class="spinner"></div>
      <p>Betöltés...</p>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <button class="close-modal" @click="closeEditModal">✖</button>
        <h2 class="modal-title">Adatok szerkesztése</h2>

        <div class="modal-tabs">
          <button :class="{ active: activeTab === 'profile' }" @click="activeTab = 'profile'">Személyes adatok</button>
          <button :class="{ active: activeTab === 'password' }" @click="activeTab = 'password'">Jelszó módosítás</button>
        </div>

        <div v-if="activeTab === 'profile'" class="modal-tab-content">
          <form @submit.prevent="saveProfile" class="edit-form">
            <div class="form-group">
              <label>Vezetéknév</label>
              <input v-model="editProfileForm.last_name" type="text" required />
            </div>
            <div class="form-group">
              <label>Keresztnév</label>
              <input v-model="editProfileForm.first_name" type="text" required />
            </div>
            <div class="form-group">
              <label>Email cím</label>
              <input v-model="editProfileForm.email" type="email" required />
            </div>
            <div class="form-group">
              <label>Telefonszám</label>
              <input v-model="editProfileForm.phone" type="tel" placeholder="+36301234567" />
            </div>
            <div class="form-group">
              <label>Születési dátum</label>
              <input v-model="editProfileForm.birth_date" type="date" />
            </div>
            <button type="submit" class="save-btn">Mentés</button>
          </form>
        </div>

        <div v-if="activeTab === 'password'" class="modal-tab-content">
          <form @submit.prevent="savePassword" class="edit-form">
            <div class="form-group">
              <label>Jelenlegi jelszó</label>
              <input v-model="passwordForm.oldPassword" type="password" required />
            </div>
            <div class="form-group">
              <label>Új jelszó</label>
              <input v-model="passwordForm.newPassword" type="password" required minlength="6" />
            </div>
            <div class="form-group">
              <label>Új jelszó megerősítése</label>
              <input v-model="passwordForm.confirmPassword" type="password" required minlength="6" />
            </div>
            <button type="submit" class="save-btn">Jelszó frissítése</button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-wrapper {
  min-height: 70vh;
  padding: 40px 20px;
  background: #f3f3f3;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out;
}

.profile-header {
  background: linear-gradient(135deg, #e8786f 0%, #e8786f 100%);
  padding: 40px 30px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.profile-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  background: #ffffff;
  border-radius: 50%;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.avatar-text {
  font-size: 36px;
  font-weight: bold;
  color: #fc9403;
  text-transform: uppercase;
}

.profile-title {
  margin: 0;
  color: #ffffff;
  font-size: 28px;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.edit-btn {
  margin-top: 15px;
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.edit-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  position: relative;
}

.close-modal {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #333;
}

.modal-title {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.modal-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.modal-tabs button {
  flex: 1;
  padding: 10px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  font-weight: bold;
  color: #666;
  cursor: pointer;
}

.modal-tabs button.active {
  color: #fbaf32;
  border-bottom-color: #fbaf32;
}

.edit-form .form-group {
  margin-bottom: 15px;
}

.edit-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
  font-size: 14px;
}

.edit-form input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
}

.save-btn {
  width: 100%;
  padding: 12px;
  background: #fbaf32;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.save-btn:hover {
  background: #e86a61;
}

.profile-content {
  padding: 30px;
}

.profile-section {
  margin-bottom: 30px;
}

.profile-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #fbaf32;
  display: inline-block;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: #ffffff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.info-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.info-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  min-width: 0;
}

.info-label {
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  word-break: break-word;
}

.points-section {
  margin-top: 30px;
}

.points-card {
  background: linear-gradient(135deg, #e86a61 0%, #e8786f 100%);
  padding: 30px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 8px 25px rgba(251, 175, 50, 0.3);
  transition: all 0.3s ease;
}

.points-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(251, 175, 50, 0.4);
}

.points-icon {
  font-size: 48px;
  animation: pulse 2s ease-in-out infinite;
}

.points-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.points-label {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.points-value {
  font-size: 36px;
  font-weight: bold;
  color: #ffffff;
}

.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 20px;
  border: 4px solid #f8f9fa;
  border-top: 4px solid #fbaf32;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-container p {
  font-size: 18px;
  color: #6c757d;
  margin: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .profile-wrapper {
    padding: 20px 10px;
  }

  .profile-header {
    padding: 30px 20px;
  }

  .profile-avatar {
    width: 80px;
    height: 80px;
  }

  .avatar-text {
    font-size: 28px;
  }

  .profile-title {
    font-size: 24px;
  }

  .profile-content {
    padding: 20px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .info-item {
    padding: 15px;
  }

  .points-card {
    padding: 20px;
  }

  .points-value {
    font-size: 28px;
  }
}
</style>
