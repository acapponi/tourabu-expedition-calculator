import React, { Component } from 'react';
import './App.scss';
import data from './data/tourabu_calculator.json';

class App extends Component {
  state = {
    data: data,
    material: [
      { id:'charcoal', selected:false },
      { id:'steel', selected:false },
      { id:'coolant', selected:false },
      { id:'whetstone', selected:false },
    ],
    filtered : null,
    great : false
  }

  /* cambio el estado del checkbox*/
  selectMaterials = (e) => {
    const materialIndex = this.state.material.findIndex(p => {
      return p.id === e.target.value;
    })

    const materialSeleccionado = {...this.state.material[materialIndex]}
  	materialSeleccionado.selected = !materialSeleccionado.selected

    const material = [...this.state.material];
    material[materialIndex] = materialSeleccionado;

    this.setState({ material: material },
    () => {
      this.getFiltered()
    });
  }

  /* filtro valores */
  getFiltered = () => {
    let filterIndex = this.state.material.map((elm, idx) => elm.selected === true ? elm.id : '').filter(String);

    const filteredData = this.state.data.filter(item => {
      let aux = false;
      filterIndex.map((el,i) => {
        if(item[el] > 0){
          aux=aux+1;
        }
      })

      if(aux === filterIndex.length){
        return item;
      }
    });

    this.setState({ filtered: filteredData })
  }

  /* toggle Great Success */
  toggleGreatSuccess = () => {
    const great = this.state.great;
    this.setState({ great: !great })
  }

  render() {

    let materials = null;
    materials = (
      <div className="material-selector">
        {this.state.material.map((mat, index) => {
          return(
            <label key={mat.id}>
              <input type="checkbox"
                name="materialSelector"
                value={mat.id}
                checked={mat.selected}
                onChange={this.selectMaterials.bind(this)} />
              <span>
                <img src={'./images/'+mat.id+'.png'} alt={mat.id} />
                <span>{mat.id}</span>
              </span>
            </label>
          )
        })}
      </div>
    );

    let results = null;
    if(this.state.filtered !== null){
      results = (
        <div className="showResults">
          {this.state.filtered.map((item, index) => {

            let charcoalDisplay, steelDisplay, coolantDisplay, whetstoneDisplay;

            if(this.state.great){
              charcoalDisplay = item.charcoal_success;
              steelDisplay = item.steel_success;
              coolantDisplay = item.coolant_success;
              whetstoneDisplay = item.whetstone_success;
            }else{
              charcoalDisplay = item.charcoal;
              steelDisplay = item.steel;
              coolantDisplay = item.coolant;
              whetstoneDisplay = item.whetstone;
            }

            return(
              <div key={item.id}>
                <h2>{item.id}</h2>
                <ul>
                  <li>Charcoal: {charcoalDisplay}</li>
                  <li>Steel: {steelDisplay}</li>
                  <li>Coolant: {coolantDisplay}</li>
                  <li>Whetstone: {whetstoneDisplay}</li>
                </ul>
              </div>
            )
          })}
        </div>
      );
    }


    return (
      <div className="App container">
        <header className="App-header">
          <h1 className="App-title">Expedition drop calculator</h1>
        </header>
        <div>
          {materials}
          <label>
            <input type="checkbox"
              name="showGreatSuccess"
              onClick={this.toggleGreatSuccess} />
            Show Great Success
          </label>
        </div>
        {results}
      </div>
    );
  }
}

export default App;
