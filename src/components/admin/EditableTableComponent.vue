<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export interface TableColumn {
  key: string
  label: string
  editable?: boolean
  type?: 'text' | 'number' | 'date' | 'array' | 'boolean'
  format?: (val: any) => string
  cellClass?: string
  cellStyle?: string
}

export default defineComponent({
  name: 'EditableTableComponent',
  props: {
    items: {
      type: Array as PropType<any[]>,
      required: true,
    },
    columns: {
      type: Array as PropType<TableColumn[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    unseenFn: {
      type: Function as PropType<(item: any) => boolean>,
      default: () => false,
    },
  },
  emits: ['save', 'delete', 'row-click'],
  data() {
    return {
      editingId: null as any,
      editForm: {} as any,
    }
  },
  methods: {
    formatCell(item: any, col: TableColumn) {
      const val = item[col.key]
      if (col.format) return col.format(val)
      return val
    },
    startEdit(item: any) {
      this.editingId = item.id
      this.editForm = { ...item }
    },
    cancelEdit() {
      this.editingId = null
      this.editForm = {}
    },
    saveEdit() {
      this.$emit('save', { ...this.editForm })
      this.editingId = null
    },
    deleteItem(item: any) {
      if (confirm('Biztosan törölni szeretné ezt az elemet?')) {
        this.$emit('delete', item.id)
      }
    },
    handleArrayInput(event: Event, key: string) {
      const target = event.target as HTMLInputElement
      this.editForm[key] = target.value.split(',').map((s) => s.trim())
    },
    onRowClick(item: any) {
      this.$emit('row-click', item)
    },
  },
})
</script>

<template>
  <div>
    <template v-if="loading"> Loading.... </template>
    <template v-else>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th v-for="col in columns" :key="col.key">
                {{ col.label }}
              </th>
              <th>Műveletek</th>
              <th>Törlés</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id" :class="{ unseen: unseenFn(item) }" @click="onRowClick(item)">
              <template v-if="editingId === item.id">
                <td v-for="col in columns" :key="col.key" :class="col.cellClass" :style="col.cellStyle">
                  <template v-if="col.editable">
                    <input
                      v-if="col.type === 'number'"
                      v-model.number="editForm[col.key]"
                      type="number"
                      class="border p-1 w-full"
                    />
                    <input
                      v-else-if="col.type === 'array'"
                      :value="(editForm[col.key] || []).join(', ')"
                      @input="handleArrayInput($event, col.key)"
                      class="border p-1 w-full"
                    />
                    <input
                      v-else
                      v-model="editForm[col.key]"
                      type="text"
                      class="border p-1 w-full"
                    />
                  </template>
                  <template v-else>
                    <div :class="col.cellClass" :style="col.cellStyle">{{ formatCell(item, col) }}</div>
                  </template>
                </td>
                <td class="actions">
                  <button @click.stop="saveEdit" class="bg-green-500 text-white px-2 py-1 rounded">Mentés</button>
                  <button @click.stop="cancelEdit" class="bg-gray-500 text-white px-2 py-1 rounded">Mégse</button>
                </td>
                <td class="actions">
                  <button @click.stop="deleteItem(item)" class="bg-red-500 text-black px-2 py-1 rounded">
                    <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" >
                    <path d="M17 6V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H2v2h2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8h2V6zM9 4h6v2H9zM6 20V8h12v12z"></path>
                      <path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
                  </svg></button>
                </td>
              </template>
              <template v-else>
                <td v-for="col in columns" :key="col.key" :class="col.cellClass" :style="col.cellStyle">
                  <div :class="col.cellClass" :style="col.cellStyle">{{ formatCell(item, col) }}</div>
                </td>
                <td class="actions">
                  <button @click.stop="startEdit(item)" class="bg-blue-500 text-black px-2 py-1 rounded">Szerkesztés</button>
                </td>
                <td class="actions">
                  <button @click.stop="deleteItem(item)" class="bg-red-500 text-black px-2 py-1 rounded">
                    <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" >
                    <path d="M17 6V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H2v2h2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8h2V6zM9 4h6v2H9zM6 20V8h12v12z"></path>
                      <path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
                  </svg></button>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<style scoped>
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

.actions {
  white-space: nowrap;
}
</style>
