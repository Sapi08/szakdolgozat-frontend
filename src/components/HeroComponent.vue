<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HeroComponent',
})
</script>

<template>
  <div class="carousel">
    <div class="container-fluid">
      <div class="owl-carousel">
        <div class="carousel-item">
          <div class="carousel-img">
            <img src="@/assets/pictures/carousel-1.jpg" alt="Image" />
          </div>
          <div class="carousel-text">
            <h1>A legjobb <span>minőségű</span> összetevők</h1>
            <p>
              Minőség, amit érezni fogsz az ízekben! 🥗🍎 Csak a legjobb alapanyagokkal dolgozunk,
              mert hiszünk abban, hogy az igazi élvezet a részletekben rejlik. Friss, válogatott
              összetevők, gondosan megmunkálva – ez a titka annak, hogy minden falat tökéletes
              legyen. Nálunk a minőség nem kompromisszum!
            </p>
            <div class="carousel-btn">
              <a class="btn custom-btn" href="">Étlap</a>
              <a class="btn custom-btn" href="">Foglalás</a>
            </div>
          </div>
        </div>
        <div class="carousel-item">
          <div class="carousel-img">
            <img src="@/assets/pictures/carousel-2.jpg" alt="Image" />
          </div>
          <div class="carousel-text">
            <h1>Hazánk <span>legjobb </span> szakácsai</h1>
            <p>
              Magyarország legjobb szakácsai, akik a világ ízeit hozzák el hozzád! 🌍🍴 A hazai
              gasztronómia mesterei, akik nemcsak a magyar konyhát, hanem a nemzetközi ízeket is
              mesterien varázsolják a tányérodra. Friss, innovatív fogások, egyedi fúziók és prémium
              alapanyagok – mindez egy helyen, a legjobb szakácsok kezei között!
            </p>
            <div class="carousel-btn">
              <a class="btn custom-btn" href="">Étlap</a>
              <a class="btn custom-btn" href="">Foglalás</a>
            </div>
          </div>
        </div>
        <div class="carousel-item">
          <div class="carousel-img">
            <img src="@/assets/pictures/carousel-3.jpg" alt="Image" />
          </div>
          <div class="carousel-text">
            <h1>A leggyorsabb <span>kiszállítás</span></h1>
            <p>
              Villámgyors kiszállítás, hogy neked csak az élmény maradjon! 🚚⚡ Rendelj egyszerűen,
              és élvezd a hihetetlenül gyors kézbesítést! Legyen szó ebédről, vacsoráról vagy egy
              last-minute ajándékról, mi rekordidő alatt házhoz visszük. Velünk az idő mindig neked
              dolgozik!
            </p>
            <div class="carousel-btn">
              <a class="btn custom-btn" href="">Étlap</a>
              <a class="btn custom-btn" href="">Foglalás</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 400px;
  background: #ffffff;
}

.carousel .container-fluid {
  padding: 0;
}

.carousel .carousel-item {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.carousel .carousel-img {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: right;
  overflow: hidden;
}

.carousel .carousel-img::after {
  position: absolute;
  content: '';
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.carousel .carousel-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel .carousel-text {
  position: absolute;
  max-width: 700px;
  height: calc(100vh - 35px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 2;
}

.carousel .carousel-text h1 {
  text-align: center;
  color: #ffffff;
  font-size: 60px;
  font-weight: 700;
  margin-bottom: 30px;
}

.carousel .carousel-text h1 span {
  color: #fbaf32;
}

.carousel .carousel-text p {
  color: #ffffff;
  text-align: center;
  font-size: 20px;
  margin-bottom: 35px;
}

.carousel .carousel-btn .btn:last-child {
  margin-left: 10px;
  background: #719a0a;
  border-color: #719a0a;
}

.carousel .carousel-btn .btn:last-child:hover {
  color: #719a0a;
  background: transparent;
}

.carousel .animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
}

@media (max-width: 991.98px) {
  .carousel,
  .carousel .carousel-item,
  .carousel .carousel-text {
    height: calc(100vh - 105px);
  }

  .carousel .carousel-text h1 {
    font-size: 35px;
  }

  .carousel .carousel-text p {
    font-size: 16px;
  }

  .carousel .carousel-text .btn {
    padding: 12px 30px;
    font-size: 15px;
    letter-spacing: 0;
  }
}

@media (max-width: 767.98px) {
  .carousel,
  .carousel .carousel-item,
  .carousel .carousel-text {
    height: calc(100vh - 70px);
  }

  .carousel .carousel-text h1 {
    font-size: 30px;
  }

  .carousel .carousel-text .btn {
    padding: 10px 25px;
    font-size: 15px;
    letter-spacing: 0;
  }
}

@media (max-width: 575.98px) {
  .carousel .carousel-text h1 {
    font-size: 25px;
  }

  .carousel .carousel-text .btn {
    padding: 8px 20px;
    font-size: 14px;
    letter-spacing: 0;
  }
}
</style>
