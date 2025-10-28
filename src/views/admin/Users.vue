<script lang="ts">
import UsersTableComponent from "@/components/admin/UsersTableComponent.vue";
import {defineComponent} from "vue";

export default defineComponent({
  name: "UsersView",
  components: {UsersTableComponent}
})
</script>

<template>
 <UsersTableComponent/>
</template>

<style scoped>

</style>
