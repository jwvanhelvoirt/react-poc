1. Er komt een collection genaamd 'translates'
2. In die collectie zit voor elke taal een record.

Record Engels:
{
    "language": "en",
    "en" : {
      "keyBookings": "bookings",
      "keyInvoicing": "invoicing",
      "keyPlanning": "planning"
    }
}

Record Nederlands:
{
    "language": "nl",
    "nl" : {
      "keyBookings": "urenregistratie",
      "keyInvoicing": "facturering",
      "keyPlanning": "planning"
    }
}

3. In de store zit een state genaamd 'language', deze staat default op 'nl'.
4. We maken ergens (personal setting) een optie om de taal aan te passen.
5. Pas je de taal aan, dan wordt de store state 'language' aangepast en vind er een re-render plaatst van alle componenten,
die subscribed zijn op deze state variabele.
6. In de app component heb je éénmalig het betreffende taalrecord ingeladen en geplaatst in de store variabele 'translates'.
7. Als de user de language aanpast, dient in de app component een nieuw record te worden ingeladen.
8. De component abboneer je dus op 'language', maar ook op 'translates'.
9. Om een label te printen, doe je vervolgens iets als:
    translates[language].keyBookings ? translates[language].keyBookings : <div className={classes.noTranslate}>keyBookings</div>
10. Die class 'noTranslate' globaal zetten en gebruiken om een nog te vetalen label te benadrukken!!
