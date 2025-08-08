<script setup lang="ts">

</script>

<template>
  <div class="blog">
    <div class="container">
      <div class="section-header text-center">
        <p>Food Blog</p>
        <h2>Latest From Food Blog</h2>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="blog-item">
            <div class="blog-img">
              <img src="../assets/pictures/feature-1.jpg" alt="Blog">
            </div>
            <div class="blog-content">
              <h2 class="blog-title">Lorem ipsum dolor sit amet</h2>
              <div class="blog-meta">
                <p><i class="far fa-user"></i>Admin</p>
                <p><i class="far fa-list-alt"></i>Food</p>
                <p><i class="far fa-calendar-alt"></i>01-Jan-2045</p>
                <p><i class="far fa-comments"></i>10</p>
              </div>
              <div class="blog-text">
                <p>
                  Lorem ipsum dolor sit amet elit. Neca pretim miura bitur facili ornare velit non vulpte liqum metus tortor. Lorem ipsum dolor sit amet elit. Neca pretim miura bitur facili ornare velit non vulpte
                </p>
                <a class="btn custom-btn" href="">Read More</a>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="blog-item">
            <div class="blog-img">
              <img src="../assets/pictures/feature-1.jpg" alt="Blog">
            </div>
            <div class="blog-content">
              <h2 class="blog-title">Lorem ipsum dolor sit amet</h2>
              <div class="blog-meta">
                <p><i class="far fa-user"></i>Admin</p>
                <p><i class="far fa-list-alt"></i>Food</p>
                <p><i class="far fa-calendar-alt"></i>01-Jan-2045</p>
                <p><i class="far fa-comments"></i>10</p>
              </div>
              <div class="blog-text">
                <p>
                  Lorem ipsum dolor sit amet elit. Neca pretim miura bitur facili ornare velit non vulpte liqum metus tortor. Lorem ipsum dolor sit amet elit. Neca pretim miura bitur facili ornare velit non vulpte
                </p>
                <a class="btn custom-btn" href="">Read More</a>
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
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
  z-index: 1;
}

.blog .blog-img img {
  width: 100%;
}

.blog .blog-content {
  position: relative;
  width: calc(100% - 60px);
  top: -60px;
  left: 30px;
  padding: 25px 30px 30px 30px;
  background: #ffffff;
  box-shadow: 0 0 30px rgba(0, 0, 0, .08);
  border-radius: 15px;
  z-index: 2;
}

.blog .blog-content h2.blog-title {
  font-size: 22px;
  font-weight: 700;
}

.blog .blog-meta {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.blog .blog-meta p {
   margin: 0 10px 0 0;
   font-size: 14px;
   color: #999999;
 }

.blog .blog-meta i {
  color: #e86a61;
  margin-right: 5px;
}

.blog .blog-meta p:last-child {
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

@media(max-width: 575.98px){
  .blog .blog-meta p {
    flex: 50%;
    font-size: 13px;
    margin: 0 0 5px 0;
  }
}
</style>
