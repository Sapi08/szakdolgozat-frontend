describe('Bejelentkezés és Regisztráció Tesztek', () => {

  it('Bejelentkezési oldal betöltése és form jelenléte', () => {
    cy.visit('/login')
    cy.url().should('include', '/login')

    // Ellenőrizzük, hogy látható-e valamilyen input (email és jelszó)
    cy.get('input[type="email"]').should('exist')
    cy.get('input[type="password"]').should('exist')

    // Alap gomb jelenlétének ellenőrzése
    cy.get('button[type="submit"], button[type="button"], .btn').should('exist')
  })

  it('Regisztrációs oldal betöltése', () => {
    cy.visit('/registration')
    cy.url().should('include', '/registration')

    // Leellenőrizzük a regisztrációs űrlap alapvető elemeinek meglétét
    cy.get('input[type="email"]').should('exist')
    cy.get('input[type="password"]').should('exist')
  })
})

