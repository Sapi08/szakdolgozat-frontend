<script setup lang="ts">

</script>

<template>
  <div class="contact">
    <div class="container">
      <div class="section-header text-center">
        <h2>Keressen bizalommal</h2>
      </div>
      <div class="row align-items-center contact-information">
        <div class="col-md-6 col-lg-3">
          <div class="contact-info">
            <div class="contact-icon">
              <i class="fa fa-map-marker-alt"></i>
            </div>
            <div class="contact-text">
              <h3>Cím</h3>
              <p>6800 Hódmezővásárhely, Rákóczi út 29.</p>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="contact-info">
            <div class="contact-icon">
              <i class="fa fa-phone-alt"></i>
            </div>
            <div class="contact-text">
              <h3>Telefon</h3>
              <p>+36 30 214 30 75</p>
              <p>+36 62 684 519</p>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="contact-info">
            <div class="contact-icon">
              <i class="fa fa-envelope"></i>
            </div>
            <div class="contact-text">
              <h3>Email</h3>
              <p>info@pizzahaz.hu</p>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="contact-info">
            <div class="contact-icon">
              <i class="fa fa-share"></i>
            </div>
            <div class="contact-text">
              <h3>Social média</h3>
              <div class="contact-social">
                <a href=""><i class="fab fa-facebook-f"></i></a>
                <a href=""><i><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tiktok" viewBox="0 0 16 16"><path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/></svg></i></a>
                <a href=""><i class="fab fa-instagram"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row contact-form">
        <div class="col-md-6">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26252.48294144675!2d20.30057860812809!3d46.42314420952771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47446f7544a0848f%3A0x6a7495745810782a!2zSMOzZG1lesWRdsOhc8OhcmhlbHksIFLDoWvDs2N6aSDDunQgMjksIDY4MDA!5e1!3m2!1shu!2shu!4v1743716221997!5m2!1shu!2shu" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
        <div class="col-md-6">
          <div id="success"></div>
          <form name="sentMessage" id="contactForm" novalidate="novalidate">
            <div class="control-group">
              <input type="text" class="form-control" id="name" placeholder="Név" required="required" data-validation-required-message="Név" />
              <p class="help-block text-danger"></p>
            </div>
            <div class="control-group">
              <input type="email" class="form-control" id="email" placeholder="Email" required="required" data-validation-required-message="Email" />
              <p class="help-block text-danger"></p>
            </div>
            <div class="control-group">
              <input type="text" class="form-control" id="subject" placeholder="Tárgy" required="required" data-validation-required-message="Tárgy" />
              <p class="help-block text-danger"></p>
            </div>
            <div class="control-group">
              <textarea class="form-control" id="message" placeholder="Üzenet" required="required" data-validation-required-message="Üzenet"></textarea>
              <p class="help-block text-danger"></p>
            </div>
            <div>
              <button class="btn custom-btn" type="submit" id="sendMessageButton">Küldés</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact {
  position: relative;
  width: 100%;
  padding: 45px 0 15px 0;
}

.contact .contact-information {
  min-height: 150px;
  margin: 0 0 30px 0;
  padding: 30px 15px 0 15px;
  background: rgba(0, 0, 0, .04);
}

.contact .contact-info {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.contact .contact-icon {
  position: relative;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e86a61;
  border-radius: 50px;
}

.contact .contact-icon i {
  font-size: 18px;
  color: #ffffff;
}

.contact .contact-text {
  position: relative;
  width: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  padding-left: 15px;
}

.contact .contact-text h3 {
  font-size: 18px;
  font-weight: 700;
  color: #e86a61;
}

.contact .contact-text p {
  margin: 0;
  font-size: 16px;
  color: #454545;
}

.contact .contact-social a {
  margin-right: 10px;
  margin-left: 10px;
  font-size: 18px;
  color: #fbaf32;
}

.contact .contact-social a:hover {
  color: #e86a61;
}

.contact .contact-form iframe {
  width: 100%;
  height: 380px;
  border-radius: 15px;
  margin-bottom: 25px;
}

.contact .contact-form input {
  padding: 15px;
  background: none;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, .1);
}

.contact .contact-form textarea {
  height: 150px;
  padding: 8px 15px;
  background: none;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, .1);
}

.contact .help-block ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
</style>
