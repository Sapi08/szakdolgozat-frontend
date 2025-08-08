<script setup lang="ts">

</script>

<template>
  <div class="about">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6">
          <div class="about-img">
            <img src="../assets/pictures/apaandmelcsy.JPG" alt="Image" />
          </div>
        </div>
        <div class="col-lg-6">
          <div class="about-content">
            <div class="section-header">
              <h2>30 éve szakmában</h2>
            </div>
            <div class="about-text">
              <p>
                Cégünk családi vállalkozásként üzemel. Kizárólag házhoz szállítással foglalkozunk, rendezvények teljeskörű szervezése-kivitelezése.      Családi-baráti -céges rendezvényre:
              </p>
              <p>
                Napi menük, Levesek, Frissensültek, Sültestálak, Pizzák, Hamburgerek, Gyrosok, Hideg tálak, Szendvicsek ( büféasztal ).
              </p>
              <a class="btn custom-btn" href="">Rendeljen most</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  position: relative;
  width: 100%;
  padding: 45px 0;
  padding-top: 60px;
}
.about .section-header {
  margin-bottom: 30px;
  margin-left: 0;
}
.about .about-img {
  position: relative;
}
.about .about-img img {
  position: relative;
  width: 100%;
  border-radius: 15px;
}
.about .btn-play {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  box-sizing: content-box;
  display: block;
  width: 32px;
  height: 44px;
  border-radius: 50%;
  border: none;
  outline: none;
  padding: 18px 20px 18px 28px;
}
.about .btn-play:before {
  content: "";
  position: absolute;
  z-index: 0;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  display: block;
  width: 100px;
  height: 100px;
  background: #fbaf32;
  border-radius: 50%;
  animation: pulse-border 1500ms ease-out infinite;
}
.about .btn-play:after {
  content: "";
  position: absolute;
  z-index: 1;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  display: block;
  width: 100px;
  height: 100px;
  background: #fbaf32;
  border-radius: 50%;
  transition: all 200ms;
}
.about .btn-play img {
  position: relative;
  z-index: 3;
  max-width: 100%;
  width: auto;
  height: auto;
}
.about .btn-play span {
  display: block;
  position: relative;
  z-index: 3;
  width: 0;
  height: 0;
  border-left: 32px solid #ffffff;
  border-top: 22px solid transparent;
  border-bottom: 22px solid transparent;
}
@keyframes pulse-border {
  0% {
    transform: translateX(-50%) translateY(-50%) translateZ(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) translateY(-50%) translateZ(0) scale(1.5);
    opacity: 0;
  }
}
#videoModal {
  padding-left: 17px;
}
#videoModal .modal-dialog {
  position: relative;
  max-width: 800px;
  margin: 60px auto 0 auto;
}
#videoModal .modal-body {
  position: relative;
  padding: 0px;
}
#videoModal .close {
  position: absolute;
  width: 30px;
  height: 30px;
  right: 0px;
  top: -30px;
  z-index: 999;
  font-size: 30px;
  font-weight: normal;
  color: #ffffff;
  background: #000000;
  opacity: 1;
}
.about .about-content {
  position: relative;
}
.about .about-text p {
  font-size: 16px;
}

.about .about-text a.btn {
  position: relative;
  margin-top: 15px;
}

@media (max-width: 991.98px) {
  .about .about-img {
    margin-bottom: 30px;
  }
}
</style>
