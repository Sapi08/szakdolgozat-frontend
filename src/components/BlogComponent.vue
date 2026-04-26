<script setup lang="ts">
</script>

<template>
  <div class="blog">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="blog-item">
            <div class="blog-img">
              <img src="../assets/pictures/tableware.png" alt="Blog" />
            </div>
            <div class="blog-content">
              <h2 class="blog-title">Eszköz bérlés</h2>
              <div class="blog-text">
                <p>
                  Cégünk lehetőséget biztosít eszközök bérlésére.
                </p>
                <ul>
                  <li>Evőeszközök</li>
                  <li>Tányérok</li>
                  <li>Poharak</li>
                  <li>Tálak</li>
                  <li>Chafingek</li>
                </ul>
                <a class="btn custom-btn" href="/about">Érdeklődés</a>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="blog-item">
            <div class="blog-img">
              <img src="../assets/pictures/events.png" alt="Blog" />
            </div>
            <div class="blog-content">
              <h2 class="blog-title">Rendezvénylebonyolítás</h2>
              <div class="blog-text">
                <p>
                  Cégünk vállalja rendezvények lebonyolítását külső és belső helyszínen egyaránt 1500 főig.
                </p>
                <ul>
                  <li>Családi rendezvények</li>
                  <li>Baráti összejövetelek</li>
                  <li>Céges rendezvények</li>
                  <li>Esküvők</li>
                </ul>
                <a class="btn custom-btn" href="/event_booking">Érdeklődés</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.blog {
  position: relative;
  width: 100%;
  padding: 45px 0 0 0;
}

.blog .blog-item {
  position: relative;
}

.blog .blog-img {
  position: relative;
  width: 80%;
  height: 500px;
  border-radius: 200px;
  overflow: hidden;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.blog .blog-img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 15px;
}

.blog .blog-content {
  position: relative;
  width: calc(100% - 60px);
  top: -60px;
  left: 30px;
  padding: 25px 30px 30px 30px;
  background: #ffffff;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.08);
  border-radius: 15px;
  z-index: 2;
}

.blog .blog-content h2.blog-title {
  font-size: 22px;
  font-weight: 700;
}

.blog {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.blog p {
  margin: 0 10px 0 0;
  font-size: 14px;
  color: #999999;
}

.blog i {
  color: #e86a61;
  margin-right: 5px;
}

.blog p:last-child {
  margin: 0;
}

.blog .blog-text {
  position: relative;
}

.blog .blog-text p {
  margin-bottom: 10px;
}

.blog .blog-item a.btn {
  margin-top: 10px;
  padding: 5px 15px;
}

.blog .pagination .page-link {
  color: #fbaf32;
  border-radius: 5px;
  border-color: #fbaf32;
  margin: 0 2px;
}

.blog .pagination .page-link:hover,
.blog .pagination .page-item.active .page-link {
  color: #ffffff;
  background: #fbaf32;
}

.blog .pagination .disabled .page-link {
  color: #999999;
}

@media (max-width: 575.98px) {
  .blog p {
    flex: 50%;
    font-size: 13px;
    margin: 0 0 5px 0;
  }
}
</style>
