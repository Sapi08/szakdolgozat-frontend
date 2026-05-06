<script setup lang="ts"></script>

<template>
  <div class="about">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6">
          <div class="about-img">
            <img src="../assets/pictures/apaandmelcsy.jpg" alt="Image" />
          </div>
        </div>
        <div class="col-lg-6">
          <div class="about-content">
            <div class="section-header">
              <h2>25 éve szakmában</h2>
            </div>
            <div class="about-text">
              <p>
                Cégünk családi vállalkozásként üzemel. Kizárólag házhoz szállítással foglalkozunk,
                rendezvények teljeskörű szervezése-kivitelezése, családi, baráti, céges rendezvényre:
              </p>
              <p>
                Napi menük, Levesek, Frissensültek, Sültestálak, Pizzák, Hamburgerek,
                Gyrosok, Hideg tálak, Szendvicsek ( büféasztal ).
              </p>
              <a class="btn custom-btn" href="/menu">Rendeljen most</a>
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
