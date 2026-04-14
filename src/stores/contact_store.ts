import { defineStore } from 'pinia'
import api from '@/config/axios.ts'
import type { ContactMessage } from '@/types/contact.ts'

export const useContactStore = defineStore('contact', {
  state: () => ({
    // Üres - csak sendContact-hez van szükség
  }),
  actions: {
    async sendContact(name: string, email: string, subject: string, message: string) {
      // ContactMessage objektum adatok
      const contactData: ContactMessage = { name, email, subject, message }

      const res = await api.post('/add_contact_message', contactData)
      console.log('Sikeres kapcsolatfelvétel:', res.data)
      return res.data
    },
  },
})
