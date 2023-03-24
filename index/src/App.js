import styles from './index.css';




const Text = () => {
  return (
    <div>
      <h1>
        Heloust !
      </h1>
      <h3>
        Nämä ovat Vilungin omat testisivut. <br />
        Tämä SPA on kirjoitettu käyttäen REACT.js frameworkkia. <br />
        Opiskelen ohjelmistokehittäjäksi Oulaissa. <br />
        Tällä hetkellä työn alla on html, css, dart, flutter ja <br />
        tietenkin kaikkien rakastama javascript kirjastojen kanssa, kuten react.js. <br />
        Opiskelen seuraavia kursseja: <br />
        </h3>
        <li>
          <ul><a href="https://www.yle.fi" target="_blank">moi</a></ul>
          <ul></ul>
          <ul></ul>
        </li>
        <h3>
        <br />
        Alla kaunis galleria vihreiden kuulien eri käyttötarkoituksista:
      </h3>
    </div>
  )
}

const galleria = () => {
  return (
    <div>
      
    </div>
  )
}



const Footer = () => {
  return (
    <div>
      <p>&copy; Vilunki 2023</p>
    </div>
  )
}




const App = () => {
  return (
    <>
      <Text />
      <Footer />
    </>
  )
}




export default App