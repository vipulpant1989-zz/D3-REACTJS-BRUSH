import React from 'react';
import LineChart from './components/Chart/LineChart';
import './App.css';
import data from './constants';
import * as d3 from 'd3';

const width = 500, height = 350, margin = 30;

const onMouseOverHandler = (x, y, data) => {
    console.log(this);
};

const formatter = d3.format(",.1%")	;


function App() {

    const sum = d3.sum(data, d => d.category);
    const formatterData = data.sort((o1, o2) => o1.category - o2.category).map((o, index, self) => {
        const { category , value } = o;
        const proportion =  Number(((value / sum)).toFixed(2));
        return {
            ...o,
            x: category,
            y: proportion * 100,
            proportion,
        };
    });

  return (
    <div className="App">
      <LineChart formatter={formatter} data={formatterData} width={width} height={height} margin={margin} onMouseOverHandler={onMouseOverHandler} />
    </div>
  );
}

export default App;
