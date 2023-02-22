    värit: 
    -tausta: d90368 // 008148 // 427aa1
    -reunaviivat ja napin reunat: 291720 // ef8a17 // 679436
    -fontti: fb8b24 // 034732 // 05668d
    -laatikko tausta: 820263 // c6c013 // ebf2fa
    -footer ja napin tausta: 04a777 // ef2917 // a5be00
    Toteutus:
        laskin.html on pääasivu josta löytyy linkit laskureille
        selaimella valikkoja on 3 per rivi, mobiililla 1 per rivi
        jokainen oma valikko on nappi/linkki toiselle sivulle 
    Tänne tulee:
        3d laskurit: 
            -kiihtyvyys 
                lasketaan ehtiikö kiihtyä tarpeeksi tiettyyn nopeuteen tietyllä matkalla
                kiihtyvyys tarvitaan. Muut kaksi yksikköä toinen tarvitaan. 
                Tulokset:
                    -ehtii kiihtyä true/false target_speed < sqrt(2 * acceleration * (axis_length / 2))
                    -matka täyteen nopeuteen kiihtyneenä axis_length - 2 * (target_speed^2) / (2 * acceleration)
                    -kiihdytys ja jarrutusmatka (target_speed^2) / (2 * acceleration)
                kaavat:
                    V = sqrt(2*A*D) missä V = suurin saavutettu nopeus A = kiihtyvyys D = kuljettu matka
                    Kuljettu matka täytyy puolittaa
                    speed = sqrt(2 * acceleration * (axis_length / 2))
                    kuljettu matka tiedetyllä kiihtyvyydellä ja tavoitenopeudella on S = (V^2) / (2 * A)
            -mm^3 (pi * (layer_height / 2) * /layer_height / 2)) + (2 * (layer_height / 2) * (layer_width - layer_height)) * speed
        yksikkömuunnokset:
            -2, 10 ja 16 kanta
                käytetään javascriptin valmiita muunnostyökaluja
            -tilavuus
                valitaan syöttö ja ulostulo yksikkö. Muunnetaan ensin si perusyksiköksi ja sen jälkeen valituksi yksiköksi
            -pituus
                valitaan syöttö ja ulostulo yksikkö. Muunnetaan ensin si perusyksiköksi ja sen jälkeen valituksi yksiköksi
            -massa
                valitaan syöttö ja ulostulo yksikkö. Muunnetaan ensin si perusyksiköksi ja sen jälkeen valituksi yksiköksi
        aika:
            -aikamuunnokset

            -aika kahden pisteen välillä
        sähkö:
            -Ohmin laki
                Kaksi arvoa vaaditaan, lasku ja reset napit
                Teho = P, jännite = V, virta = I ja vastus = R
                kaavat:
                    P = R * I * I ; I * U ; (U * U) / R
                    U = I * R ; P / I ; sqrt(P * R)
                    R = U / I ; P / (I * I) ; (U * U) / P
                    I = sqrt(P / R) ; P / V ; V / R
                Neljä arvoa ilmoitetaan, kaksi täytyy olla tyhijä. 
            -vastuskoodi
                4, 5 tai 6 värikoodia. kaksi viimeistä on kerroin ja toleranssi. 
                Viimeine nauha voi olla myös lämpötilanauha
                valinta monellako nauhalla lasketaan
                Kaava vastusarvolle
                "col_1" + "col_2" + "col_3" * col_4
                kaava toleranssille
                resistance +/- (resistance / 100 * col_T)
            -sarja ja rinnan vastus
                valinta onko sarjan vai rinnan
                sarjan:
                    valitaan montako vastusta on, sen jälkeen lisätään arvot yhteen.
                rinnan:
                    valitaan montako vastusta on, sen jälkeen lasketaan vastusarvo kaavalla
                    total_resistance = 1 / ((1/r_1)+(1/r_2)+(1/r_3)) jne
            -akun kesto
                Valitaan yksiköt jonka jälkeen lasketaan kaavalla
                battery_hours = capacity_hours / current
            -akun energia
                valitaan yksikkö kwh / wh ja ah / mah tarvitaan myös jännite
                Kaavat:
                    Wh = V * Ah
                    V = Wh / Ah
                    Ah = Wh / V
            -virran jakautuminen
                Syötetään virta ja vastusten arvot
                Jokaiselle vastukselle lasketaan virta erikseen
                Kaavat:
                    kaksi vastusta: I_1 = I_total * (R_1 / (R_1 + R_2)) ; I_2 = I_total * (R_2 / (R_1 + R_2))
                    kolme vastusta: I_1 = I_total * (R_1 / (R_1 + R_2 + R_3)) ; I_2 = I_total * (R_2 / (R_1 + R_2 + R_3)) ; 
                    I_3 = I_total * (R_3 / (R_1 + R_2 + R_3))
                N määrällä vastuksia kaava:
                    Ekaksi pitää laskea kokonaisrestistanssi:
                        R_total = R_1 + R_2 + R_N ... jne
                    1. katsotaan vastusten määrä ja lisätään jokainen arvo listaan
                    2. tarkistetaan että kaikki arvot ovat double tai int tai float
                    3. lasketaan R_total listasta
                    4. tehdään for loop joka suoritetaan listan pituuden kertaa, jokaiselle vastukselle yhdesti.
                    N = listan pituus X = listan arvo
                    Suoritetaan N kertaa jokaiselle X arvolle ja lisätään arvot uuteen listaan
                    Y = lisättävä arvo uuteen listaan
                    kaava on Y = I_total * R_X / R_total
                    5. tulostetaan uuden listan arvot yksitellen kenttiin
            -jännitteen jakautuminen
                syötteeksi jännite ja kahden vastuksen arvo. arvo lasketaan vastuksen 2 väliltä
                r_total = kahden vastuksen yhteisarvo
                kaava:
                    V_out = (V_in * R_2)/(R_total)
            -sarjan ja rinnan konkka
                tarvittaessa muunnetaan kaikki yksiköt samaan muotoon
                sarjan
                    Sisään N määrä arvoja jotka lisätään listaan
                    Kaava:
                        C_Total = (1)/(C_N + C_N)
                    Lasketaan foreachilla C_N 
                    Lasketaan sitten C_Total
                rinnan
                    Lisätään jokainen arvo listaan
                    Kaava:
                    C_Total = C_1 + C_2 + C_N jne
                Muunnetaan ulostulo kummastakin haluttuun muotoon