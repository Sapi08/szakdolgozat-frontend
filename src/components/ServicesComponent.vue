<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ServicesComponent',
})
</script>

<template>
  <div class="feature">
    <div class="container">
      <div class="row">
        <div class="col-lg-5">
          <div class="section-header">
            <p>Miért válasszon minket?</p>
            <h2>Fontos jellemzőink:</h2>
          </div>
          <div class="feature-text">
            <div class="feature-img">
              <div class="row">
                <div class="col-6">
                  <img src="../assets/pictures/feature-1.jpg" alt="Image" />
                </div>
                <div class="col-6">
                  <img src="../assets/pictures/feature-2.png" alt="Image" />
                </div>
                <div class="col-6">
                  <img src="../assets/pictures/feature-3.png" alt="Image" />
                </div>
                <div class="col-6">
                  <img src="../assets/pictures/feature-4.png" alt="Image" />
                </div>
              </div>
            </div>
            <a class="btn custom-btn" href="/event_booking">Időpont foglalás rendezvényre</a>
          </div>
        </div>
        <div class="col-lg-7">
          <div class="row">
            <div class="col-sm-6">
              <div class="feature-item">
                <i class="flaticon-cooking"></i>
                <h3>Szakácsaink több éves tapasztalattal rendelkeznek</h3>
                <p>
                  Szakácsaink szenvedélye a főzés és céljuk, hogy a legjobb ételeket készítsék el Önnek.
                </p>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="feature-item">
                <i class="flaticon-vegetable"></i>
                <h3>Természetes összetevők</h3>
                <p>
                  Minden ételünk természetes összetevőkből készül, hogy a lehető legjobb ízt és minőséget biztosítsuk.
                </p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <div class="feature-item">
                <i class="flaticon-medal"></i>
                <h3>Legjobb minőségű termékek</h3>
                <p>
                  Igyekszünk mindig a legjobb minőségű alapanyagokat beszerezni, hogy ételeink kiválóak legyenek.
                </p>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="feature-item">
                <i class="flaticon-meat"></i>
                <h3>Friss zöldségek és húsok</h3>
                <p>
                  Minden zöldségünk és húsunk friss, hogy ételeink ízletesek és táplálóak legyenek.
                </p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <div class="feature-item">
                <i class="flaticon-courier"></i>
                <h3>Gyors házhozszállítás</h3>
                <p>
                  Gyors és megbízható házhozszállítást kínálunk, hogy ételeink mindig frissen és melegen érkezzenek meg Önhöz.
                </p>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="feature-item">
                <i class="flaticon-fruits-and-vegetables"></i>
                <h3>Egészséges étkezés, alacsony zsírtartalom</h3>
                <p>
                  Egészséges és tápláló ételeket kínálunk, amelyek alacsony zsírtartalmúak, hogy Ön jól érezze magát.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feature {
  position: relative;
  width: 100%;
  padding: 45px 0 0 0;
}
.feature .section-header {
  margin-bottom: 30px;
}
.feature .feature-text {
  position: relative;
  width: 70%;
}
.feature .feature-img {
  border-radius: 15px;
  margin-bottom: 25px;
  overflow: hidden;
}
.feature .feature-img .col-6,
.feature .feature-img .col-12 {
  padding: 0;
  overflow: hidden;
}
.feature .feature-img img {
  width: 100%;
  transition: .3s;
}
.feature .feature-img img:hover {
  transform: scale(1.1);
}
.feature .feature-text .btn {
  width: 100%;
  margin-top: 15px;
  margin-bottom: 45px;
}
.feature .feature-item {
  width: 100%;
  margin-bottom: 45px;
}
.feature .feature-item i {
  position: relative;
  display: block;
  color: #e86a61;
  font-size: 60px;
  line-height: 60px;
  margin-bottom: 15px;
  background-image: linear-gradient(#fbaf32, #e86a61);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.feature .feature-item i::after {
  position: absolute;
  content: "";
  width: 40px;
  height: 40px;
  top: -10px;
  left: 20px;
  background: #e86a61;
  border-radius: 30px;
  z-index: -1;
}

.feature .feature-item h3 {
  font-size: 22px;
  font-weight: 700;
}
</style>
