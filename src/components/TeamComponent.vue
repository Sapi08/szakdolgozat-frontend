<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "TeamComponent"
})
</script>

<template>
  <div class="team">
    <div class="container">
      <div class="section-header text-center">
        <p>Csapatunk</p>
        <h2>Mesterszakácsaink</h2>
      </div>
      <div class="row align-items-center justify-content-center">
        <div class="col-lg-4 col-md-6 mr-5">
          <div class="team-item">
            <div class="team-img">
              <img src="../assets/pictures/team-1.jpg" alt="Image">
              <div class="team-social">
                <a href=""><i class="fab fa-twitter"></i></a>
                <a href=""><i class="fab fa-facebook-f"></i></a>
                <a href=""><i class="fab fa-linkedin-in"></i></a>
                <a href=""><i class="fab fa-instagram"></i></a>
              </div>
            </div>
            <div class="team-text">
              <h2>Kucsera László</h2>
              <p>Mesterszakács</p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6 ml-5">
          <div class="team-item">
            <div class="team-img">
              <img src="../assets/pictures/team-2.jpg" alt="Image">
              <div class="team-social">
                <a href=""><i class="fab fa-twitter"></i></a>
                <a href=""><i class="fab fa-facebook-f"></i></a>
                <a href=""><i class="fab fa-linkedin-in"></i></a>
                <a href=""><i class="fab fa-instagram"></i></a>
              </div>
            </div>
            <div class="team-text">
              <h2>Szilágyi Melinda</h2>
              <p>Mesterszakács</p>
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
  transition: .3s;
}
.team .team-item:hover img {
  margin-top: 0;
  margin-bottom: 15px;
}
.team .team-social {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: .5s;
}
.team .team-social a {
  position: relative;
  margin: 0 3px;
  margin-top: 100px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40px;
  font-size: 16px;
  color: #ffffff;
  background: #e86a61;
  opacity: 0;
}
.team .team-social a:hover {
  color: #ffffff;
  background: #fbaf32;
}
.team .team-item:hover .team-social {
  background: rgba(256, 256, 256, .5);
}
.team .team-item:hover .team-social a:first-child {
  opacity: 1;
  margin-top: 0;
  transition: .3s 0s;
}
.team .team-item:hover .team-social a:nth-child(2) {
  opacity: 1;
  margin-top: 0;
  transition: .3s .1s;
}
.team .team-item:hover .team-social a:nth-child(3) {
  opacity: 1;
  margin-top: 0;
  transition: .3s .2s;
}
.team .team-item:hover .team-social a:nth-child(4) {
  opacity: 1;
  margin-top: 0;
  transition: .3s .3s;
}
.team .team-text {
  position: relative;
  padding: 25px 15px;
  text-align: center;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, .07);
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
