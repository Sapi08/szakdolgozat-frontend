<script lang="ts">
import {defineComponent, onMounted} from 'vue'
import CardComponent from "@/components/admin/CardComponent.vue";
import { useStatisticsStore } from '@/stores/statistics_store.ts'

export default defineComponent({
  name: "DashboardView",
  components: {CardComponent},
  setup() {
    const statisticsStore = useStatisticsStore()

    onMounted(() => {
      statisticsStore.fetchStatistics()
    })

    return {
      statisticsStore
    }
  }
})
</script>

<template>
  <!-- Osszesitett statisztikak -->
  <div class="container">
    <h1>Összesített statisztikák</h1>
    <div class="row">
      <div class="col-sm">
        <CardComponent
          title="Regisztrált felhasználók"
          :value="statisticsStore.usersCount"
          icon="👥"
        />
      </div>
      <div class="col-sm">
        <CardComponent
          title="Mindenkori rendelések száma"
          :value="statisticsStore.ordersCount"
          icon="📦"
        />
      </div>
      <div class="col-sm">
        <CardComponent
          title="Napi rendelések száma"
          :value="statisticsStore.dailyOrdersCount"
          icon="📈"
        />
      </div>
    </div>
  </div>

  <!-- Napi statisztikak -->
  <div class="container">
    <h1>Napi statisztikák</h1>
    <div class="row">
      <div class="col-sm">
        <CardComponent
          title="Napi rendelések száma"
          :value="statisticsStore.todayStats.count"
          icon="👥"
        />
      </div>
      <div class="col-sm">
        <CardComponent
          title="Napi bevétel"
          :value="statisticsStore.todayStats.total_revenue"
          icon="📦"
        />
      </div>
      <div class="col-sm">
        <CardComponent
          title="Váró rendelések száma"
          :value="statisticsStore.todayStats.pending"
          icon="📈"
        />
      </div>
    </div>
  </div>

  <!-- Heti statisztikak -->
  <div class="container">
    <h1>Heti statisztikák</h1>
    <div class="row">
      <div class="col-sm">
        <CardComponent
          title="Heti rendelések száma"
          :value="statisticsStore.weekStats.count"
          icon="👥"
        />
      </div>
      <div class="col-sm">
        <CardComponent
          title="Heti bevétel"
          :value="statisticsStore.weekStats.total_revenue"
          icon="📦"
        />
      </div>
      <div class="col-sm">
        <CardComponent
          title="Heti átlaghos rendelési érték"
          :value="statisticsStore.weekStats.avg_order_value"
          icon="📈"
        />
      </div>
    </div>
  </div>

  <!-- Havi statisztikak -->
  <div class="container">
    <h1>Havi statisztikák</h1>
    <div class="row">
      <div class="col-sm">
        <CardComponent
          title="Havi rendelések száma"
          :value="statisticsStore.monthStats.count"
          icon="👥"
        />
      </div>
      <div class="col-sm">
        <CardComponent
          title="Mindenkori rendelések száma"
          :value="statisticsStore.monthStats.total_revenue"
          icon="📦"
        />
      </div>
      <div class="col-sm">
        <CardComponent
          title="Napi rendelések száma"
          :value="statisticsStore.monthStats.completed"
          icon="📈"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  margin-top: 20px;
  margin-bottom: 20px;}
</style>
