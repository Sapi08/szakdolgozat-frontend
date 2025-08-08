<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "FooterComponent"
})
</script>

<template>
  <div class="footer">
    <div class="container">
      <div class="row">
        <div class="col-lg-7">
          <div class="row">
            <div class="col-md-6">
              <div class="footer-contact">
                <h2>Cím</h2>
                <p><i class="fa fa-map-marker-alt"></i>6800 Hódmezővásárhely, <br>Rákóczi út 29, Magyarország</p>
                <p><i class="fa fa-phone-alt"></i>62 123 4567</p>
                <p><i class="fa fa-envelope"></i>info@pizzahaz.hu</p>
                <div class="footer-social">
                  <a href=""><i class="fab fa-twitter"></i></a>
                  <a href=""><i class="fab fa-facebook-f"></i></a>
                  <a href=""><i class="fab fa-youtube"></i></a>
                  <a href=""><i class="fab fa-instagram"></i></a>
                  <a href=""><i class="fab fa-tiktok"></i></a>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="footer-link">
                <h2>Hasznos Linkek</h2>
                <a href="/about">Rólunk</a>
                <a href="/services">Szolgáltatások</a>
                <a href="/menu">Étlap</a>
                <a href="/event_booking">Rendezvény</a>
                <a href="/contact">Kapcsolat</a>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="footer-newsletter">
            <h2>Hírlevél</h2>
            <p>
              Ha szeretne föliratkozni hírlevelünkre írja be e-mail címét és mindig értesítjük legfrissebb akcióinkról és ajánlatainkról.
            </p>
            <div class="form">
              <input class="form-control" placeholder="E-mail">
              <button class="btn custom-btn">Küldés</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">
      <div class="container">
        <p>Copyright &copy; <a href="#">Pizzahaz.hu</a>, Minden Jog Fenntartva.</p><br>
        <p> Alkotó: <a href="#">Kucsera Milán</a></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.footer {
  position: relative;
  margin-top: 45px;
  padding-top: 90px;
  background: rgba(0, 0, 0, .04);
}
.footer .footer-contact,
.footer .footer-link,
.footer .footer-newsletter {
  position: relative;
  margin-bottom: 45px;
  color: #454545;
}
.footer .footer-contact h2,
.footer .footer-link h2,
.footer .footer-newsletter h2 {
  position: relative;
  margin-bottom: 30px;
  padding-bottom: 10px;
  font-size: 22px;
  font-weight: 700;
  color: #e86a61;
}
.footer .footer-contact h2::after,
.footer .footer-link h2::after,
.footer .footer-newsletter h2::after {
  position: absolute;
  content: "";
  width: 45px;
  height: 2px;
  bottom: 0;
  left: 0;
  background: #e86a61;
}
.footer .footer-link a {
  display: block;
  margin-bottom: 10px;
  color: #454545;
  transition: .3s;
}
.footer .footer-link a::before {
  position: relative;
  content: "\f105";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  margin-right: 10px;
  color: #fbaf32;
}
.footer .footer-link a:hover {
  color: #fbaf32;
  letter-spacing: 1px;
}
.footer .footer-contact p i {
  width: 25px;
  color: #fbaf32;
}
.footer .footer-social {
  position: relative;
  margin-top: 20px;
  display: flex;
}
.footer .footer-social a {
  display: inline-block;
  margin-right: 5px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e86a61;
  border-radius: 35px;
  font-size: 16px;
  color: #ffffff;
}
.footer .footer-social a:hover {
  background: #fbaf32;
}
.footer .footer-social a:last-child {
  margin: 0;
}
.footer .footer-newsletter .form {
  position: relative;
  width: 100%;
}
.footer .footer-newsletter input {
  height: 60px;
  background: transparent;
  border: 1px solid #fbaf32;
  border-radius: 5px;
}
.footer .footer-newsletter .btn {
  position: absolute;
  top: 8px;
  right: 8px;
  height: 44px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 700;
}
.footer .copyright {
  position: relative;
  width: 100%;
  padding: 30px 0;
  text-align: center;
  background: #ffffff;
}
.footer .copyright p {
  margin: 0;
  display: inline-block;
  color: #454545;
}
.footer .copyright p a {
  color: #fbaf32;
}
.footer .copyright p a:hover {
  color: #e86a61;
}
</style>
