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
    great : true,
    hourly : false,
    onlyExtras: false
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

    let filteredData =this.state.data;

    filteredData = filteredData.sort((a, b) => {
      var promA = 0;
      var promB = 0;
      filterIndex.map((el,i) => {
        promA = promA + Math.round(60*a[el]/a.minutes);
        promB = promB + Math.round(60*b[el]/b.minutes);
      })

      promA = promA/filterIndex.length;
      promB = promB/filterIndex.length;

      return promB - promA;
    });
    filterIndex.map((el,i) => {
    })


    filteredData = filteredData.filter(item => {
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

  /* toggle Hourly */
  toggleHourly = () => {
    const hourly = this.state.hourly;
    this.setState({ hourly: !hourly })
  }

  /* toggle onlyExtras */
  toggleonlyExtras = () => {
    const onlyExtras = this.state.onlyExtras;
    this.setState({ onlyExtras: !onlyExtras })
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

    if((this.state.filtered !== null) && ((this.state.filtered).length > 0)){
      results = (
        <div className="showResults">
          {this.state.filtered.map((item, index) => {

            let charcoalDisplay, steelDisplay, coolantDisplay, whetstoneDisplay, time;

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

            if(this.state.hourly){
              charcoalDisplay = Math.round(60*charcoalDisplay/item.minutes);
              steelDisplay = Math.round(60*steelDisplay/item.minutes);
              coolantDisplay = Math.round(60*coolantDisplay/item.minutes);
              whetstoneDisplay = Math.round(60*whetstoneDisplay/item.minutes);
            }

            var hours = (item.minutes / 60);
            var rhours = Math.floor(hours);
            var minutes = (hours - rhours) * 60;
            var rminutes = Math.round(minutes);
            time = ('0'+rhours).slice(-2) + ":" + ('0'+rminutes).slice(-2);

            if(this.state.onlyExtras && item.other === ''){return;}

            return(
              <div key={item.id} className="result">
                <h2>{item.id}<small>{time}</small></h2>
                <div className="result-content">
                  <div>
                    <ul>
                      <li>Charcoal: {charcoalDisplay}</li>
                      <li>Steel: {steelDisplay}</li>
                      <li>Coolant: {coolantDisplay}</li>
                      <li>Whetstone: {whetstoneDisplay}</li>
                    </ul>
                    {item.other !== '' &&
                      <span className="icon-plus">{item.other}</span>
                    }
                  </div>
                  <div className="requires">
                    <div>Sword level: {item.req_level}</div>
                    {item.req_sword !== '' &&
                      <div>Sword type: {item.req_sword}</div>
                    }
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      );
    }else{
      results = (
        <div className="startText">
          <p>To start click on the material(s) you need.</p>
          <p><small>This tool was made for fun, based on data from the <a href="https://touken-ranbu.fandom.com/wiki/Expeditions" target="_blank">Expeditions page</a> from the Touken Ranbu wiki. It shows the best expedition to get the materials selected.</small></p>
        </div>
      );
    }


    return (
      <div className="App">
        <div className="App-wrapper">
          <header className="App-header">
            <div>
              <h1 className="App-title">Expedition drop calculator</h1>
              <div>
                {materials}
                <div>
                  <div className="custom-control custom-switch  custom-control-inline">
                    <input type="checkbox"
                      className="custom-control-input showGreatSuccess"
                      name="showGreatSuccess" id="showGreatSuccess"
                      onChange={this.toggleGreatSuccess} checked={this.state.great} />
                    <label className="custom-control-label" htmlFor="showGreatSuccess">Great Success</label>
                  </div>

                  <div className="custom-control custom-switch  custom-control-inline">
                    <input type="checkbox"
                      className="custom-control-input toggleHourly"
                      name="toggleHourly" id="toggleHourly"
                      onChange={this.toggleHourly} checked={this.state.hourly} />
                    <label className="custom-control-label" htmlFor="toggleHourly">Drop by hour</label>
                  </div>

                  <div className="custom-control custom-switch  custom-control-inline">
                    <input type="checkbox"
                      className="custom-control-input toggleHourly"
                      name="toggleonlyExtras" id="toggleonlyExtras"
                      onChange={this.toggleonlyExtras} checked={this.state.onlyExtras} />
                    <label className="custom-control-label" htmlFor="toggleonlyExtras">Only extra drop</label>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main className="App-content">
            {results}
          </main>
          <footer  className="App-footer">
            <a href="https://github.com/acapponi" target="_blank"><img src="./images/github.svg" width="15"/> <span>acapponi</span></a>
          </footer>
        </div>
      </div>
    );
  }
}

export default App;
