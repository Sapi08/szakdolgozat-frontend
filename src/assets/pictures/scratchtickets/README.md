# Kaparós Sorsjegy Képek

## Hogyan adhatsz hozzá új ticket képeket?

1. **Képek elhelyezése:**
   - Helyezd el az új ticket képeket ebbe a mappába
   - Javasolt formátum: PNG (átlátszó háttérrel)
   - Javasolt méret: 500x320 px vagy hasonló arány

2. **Képek importálása:**
   Nyisd meg a `ScratchCardComponent.vue` fájlt és:
   
   ```typescript
   // Import a képeket
   import ticket1 from "@/assets/pictures/scratchtickets/ticket1.png";
   import ticket2 from "@/assets/pictures/scratchtickets/ticket2.png";
   import ticket3 from "@/assets/pictures/scratchtickets/ticket3.png";
   
   // Add hozzá a ticketImages tömbhöz
   const ticketImages = [
     ticket1,
     ticket2,
     ticket3,
   ];
   ```

3. **Készítsd el a képeket:**
   - Dizájnolj szép kaparós sorsjegy háttereket
   - Használhatsz pizzás mintákat, logót, éttermi elemeket
   - A háttéren látható lesz a nyeremény és a kaparóréteg alatt

## Jelenlegi képek:
- `ticket1.png` - Alapértelmezett sorsjegy

