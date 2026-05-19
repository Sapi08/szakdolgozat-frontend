describe('Fejlett funkcionalitások: Bejelentkezés validáció és hibakezelés', () => {

  beforeEach(() => {
    cy.visit('/login')
  })

  it('Figyelmeztetést mutat, ha üres adatokkal próbálunk bejelentkezni', () => {
    cy.get('button.loginbtn').click()

    // Frontend szintű validáció ellenőrzése
    cy.get('.error-message').should('contain', 'Kérjük, adja meg az email címét!')
    cy.get('.error-message').should('contain', 'Kérjük, adja meg a jelszavát!')
  })

  it('Hibás bejelentkezési adatoknál backend hibát jelenít meg', () => {
    // Ezt úgy teszteljük, hogy megadunk egy érvényes formátumú, de nem létező taget/jelszót.
    cy.get('input#email').type('nincilyen@teszt.hu')
    cy.get('input#psw').type('rosszjelszo123')
    cy.get('button.loginbtn').click()

    // Mivel E2E, feltételezzük, hogy visszatér egy hibaüzenet (pl. "Hibás felhasználónév vagy jelszó" - amit a backend dob)
    // Elvárjuk, hogy a backendError v-if="backendError" div megjelenjen
    cy.get('.backend-error', { timeout: 8000 }).should('be.visible')
    cy.get('.backend-error .error-text').should('not.be.empty')
  })
})

