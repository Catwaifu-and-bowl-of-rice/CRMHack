import React from 'react';
import examplia from '@characters/examplia/examplia';
import { testroom } from '@backgrounds/bcgIndex';
import './App.scss';
import Character from './components/character/character';

function App() {
  return (
    <div className="App">
      <div className="novelWrapper">
        <img src={testroom} className="bcg" />
        <section className="characters">
          {
            <Character character={examplia} emotion="testtag" />
          }
        </section>
        <section className="dialog">
          <h4 className="charName">Examplia</h4>
          <p>Bla bla bla</p>
        </section>
      </div>
    </div >
  );
}

export default App;
