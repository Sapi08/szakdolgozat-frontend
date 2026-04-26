<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TeamComponent',
})
</script>

<template>
  <div class="team">
    <div class="container">
      <div class="section-header text-center">
        <p>Csapatunk</p>
        <h2>Szakácsaink</h2>
      </div>
      <div class="row align-items-center justify-content-center">
        <div class="col-lg-4 col-md-6 mr-5">
          <div class="team-item">
            <div class="team-img">
              <img src="../assets/pictures/team-1.jpg" alt="Image" />
            </div>
            <div class="team-text">
              <h2>Kucsera László</h2>
              <p>Szakács, Felszolgáló</p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6 ml-5">
          <div class="team-item">
            <div class="team-img">
              <img src="../assets/pictures/team-2.jpg" alt="Image" />
            </div>
            <div class="team-text">
              <h2>Szilágyi Melinda</h2>
              <p>Szakács, Felszolgáló</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.team {
  position: relative;
  width: 100%;
  padding: 45px 0 15px 0;
}
.team .team-item {
  position: relative;
  margin-bottom: 30px;
  background: #ffffff;
}
.team .team-img {
  position: relative;
  border-radius: 15px 15px 0 0;
  overflow: hidden;
}
.team .team-img img {
  position: relative;
  width: 100%;
  margin-top: 15px;
  transform: scale(1.1);
  transition: 0.3s;
}
.team .team-item:hover img {
  margin-top: 0;
  margin-bottom: 15px;
}
.team .team-item:hover {
  background: rgba(256, 256, 256, 0.5);
}
.team .team-item:hover a:first-child {
  opacity: 1;
  margin-top: 0;
  transition: 0.3s 0s;
}
.team .team-item:hover a:nth-child(2) {
  opacity: 1;
  margin-top: 0;
  transition: 0.3s 0.1s;
}
.team .team-item:hover a:nth-child(3) {
  opacity: 1;
  margin-top: 0;
  transition: 0.3s 0.2s;
}
.team .team-item:hover a:nth-child(4) {
  opacity: 1;
  margin-top: 0;
  transition: 0.3s 0.3s;
}
.team .team-text {
  position: relative;
  padding: 25px 15px;
  text-align: center;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-top: none;
  border-radius: 0 0 15px 15px;
}
.team .team-text h2 {
  font-size: 22px;
  font-weight: 700;
}
.team .team-text p {
  margin: 0;
  font-size: 16px;
}
</style>
