import { defineStore } from "pinia";
import api from "@/config/axios.ts";
import ContactMessage from "@/models/contact.ts";

export const useContactStore = defineStore("contact", {
  state: () => ({
    contacts: [] as ContactMessage[],
  }),
  actions: {
    async sendContact(name: string, email: string, subject: string, message: string) {
      // ContactMessage objektum létrehozása
      const contactData = new ContactMessage(name, email, subject, message);

      const res = await api.post("/add_contact_message", contactData);
      console.log("Sikeres kapcsolatfelvétel:", res.data);
      return res.data;
    },

    async loadContacts() {
      const x = await api.get("/contacts");
      this.contacts = x.data as ContactMessage[];
      return x.data;
    }
  }
});
