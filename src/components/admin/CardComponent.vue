<template>
  <div class="capacity-card">
    <div class="card-header">
      <h3 class="card-title">Capacity</h3>
      <span class="update-badge">
        <i class="update-icon">📌</i> Updated now
      </span>
    </div>
    <div class="card-content">
      <p class="capacity-value">105GB</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardComponent',
  props: {
    value: {
      type: String,
      default: '105GB'
    },
    updatedText: {
      type: String,
      default: 'Updated now'
    }
  }
}
</script>

<style scoped>
.capacity-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 240px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-left: 1000px;
}

.capacity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  background: white;
}

.card-title {
  color: #4a5568;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.update-badge {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: #718096;
  background-color: #f7fafc;
  padding: 4px 8px;
  border-radius: 12px;
}

.update-icon {
  margin-right: 4px;
  font-size: 0.9rem;
}

.card-content {
  display: flex;
  align-items: flex-end;
}

.capacity-value {
  color: #2d3748;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .capacity-card {
    max-width: 100%;
  }

  .capacity-value {
    font-size: 1.5rem;
  }
}
</style>
