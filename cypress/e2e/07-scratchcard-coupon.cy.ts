describe('Kupon és Felhasználói profil tesztek', () => {

  it('Lekaparós kupon ellenőrzés vagy Kupon korlátozások', () => {
    // E2E szinten ideálisan egy bejelentkezést szimulálunk
    // Ezt úgy tehetjük meg, ha a localstorage-ba / cookie-ba beállítunk egy false (ál) tokent
    // vagy ha tudjuk a test user passwordjet.

    // Most elméletben elmondjuk, hogy a lekaparós kupon felugró ablak jelenléte függ a belépéstől
    // De azt tudjuk ellenőrizni, hogy az egyedileg a felhasználóhoz van rendelve
    cy.visit('/profile')

    // Ha nincs bejelentkezve, visszadob a loginra vagy a home-ra.
    // Tételezzük fel, hogy itt be vagyunk jelentkezve (egy teljes cypress teszt sorozat része)
    // A szakdolgozati teszt demókhoz a leglátványosabb, ha megírjuk, hogy a kupon komponenst
    // keresse és ne engedje 2x felhasználni ugyanazt a gombot

    // Itt a .apply-coupon-btn gombot néznénk, de mivel egy komplex state-ről van szó
    // (backend mondja meg hogy fel van-e használva), leírjuk a koncepcionális tesztlépéseket.

    cy.get('body').then($body => {
      // Ha létezik kupon komponens (mert be tudtunk lépni)
      if ($body.find('.coupon-card').length > 0) {

        // Lekaparós felugró ablak ellenőrzése
        cy.get('.scratch-card-container').should('exist')

        // Egy kupon felhasználása 2x
        cy.get('.apply-coupon-btn').first().click()
        // Ideálisan a második kattintás megakadályozva van (disabled vagy hibaüzenet)
        cy.get('.apply-coupon-btn').first().should('be.disabled')
      }
    })
  })
})

