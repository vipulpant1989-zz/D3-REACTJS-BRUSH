import React, {Component} from 'react';
import * as d3 from 'd3';
import './index.css';
import Modal from './Modal';

export default class BaseChart extends Component {

    constructor(props) {
        super(props);
        const {width, height, margin, data} = props;
        this.calcHeight = height - 2 * margin;
        this.calcWidth = width - 2 * margin
        this.xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.x)]) //domain: [min,max] of a
            .range([margin, this.calcWidth]);
        this.yScale = d3.scaleLinear()
            .domain([0, 100]) // domain [0,100] of b (start from 0)
            .range([this.calcHeight, margin]);
        this.brush = d3.brushX()
            .extent([[0, 0], [this.calcWidth, this.calcHeight]]);
        this.state = {
            x: 0,
            y: 0,
            message: '',
            data,
        }
    }

    renderLine(data = []) {

    }

    renderInnerComponent(data = []) {
        throw new Error('NEED TO OVERRIDE RENDER LINE METHOD');
    }

    get ruler() {
        console.warn('Override ruler method to add a ruler');
    }

    get xAxis() {
        const {margin, data} = this.props;
        return this.xScale.ticks(d3.max(data, d => d.x)).map(d => (
            <g key={`x-axis-${d}`} transform={`translate(${this.xScale(d)},${this.calcHeight + margin})`}>
                <text>{d}</text>
            </g>
        ));
    }

    get yAxis() {
        const {margin, data} = this.props;
        return this.yScale.ticks(d3.max(data, d => d.y)).map(d => {
            return(
                <g key={`y-axis-${d}`} transform={`translate(${margin},${this.yScale(d)})`}>
                    <text x="-30" y="5">{this.props.formatter ? this.props.formatter(d/100) : d}</text>
                    <line className='gridline' x1='0' x1={this.calcWidth - margin} y1='0' y2='0'
                          transform="translate(-5,0)"/>
                </g>
            );
        });
    }

    render() {
        const {width, height, data, margin} = this.props;
        const { visible, x, y, data: formattedData } = this.state;
        return (
            <div className={`${this.constructor.name}`}>
                <svg width={width} height={height}>
                    {this.ruler}
                    {this.renderInnerComponent(formattedData)}
                    <g className="axis-labels">
                        {this.xAxis}
                    </g>
                    <g className="axis-labels">
                        {this.yAxis}
                    </g>
                    {visible && (<Modal
                        height={50} width={50}
                        message={this.state.message}
                        x={x}
                        y={y}/>)
                    }
                    <g transform={`translate(0,${3 * margin})`}>
                        {this.renderLine(data)}
                        {this.renderAllPoints(data)}
                        <g transform={ `translate(0, ${this.calcHeight - 2 * margin})` } ref={ (x) => {this.brushNode = x}} />
                    </g>
                </svg>

            </div>
        );
    }
}