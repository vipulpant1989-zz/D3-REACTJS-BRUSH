import React, {Fragment} from 'react';
import BaseChart from './BaseChart';
import * as d3 from 'd3';

const symbol = d3.symbol().size([25]);

const Dot = ({
    x,
    y,
    onMouseOverHandler,
    onMouseLeaveHandler,
    keyName
}) => {
    return (
        <path
            key={keyName}
            className="points"
            onMouseLeave={onMouseLeaveHandler}
            onMouseOver={onMouseOverHandler}
            d={symbol.type(d3.symbolCircle)()}
            transform={`translate(${x},${y})`}
        />
    );
};

export default class LineChart extends BaseChart {

    constructor(props) {
        super(props);
        this.onMouseOverHandler = this.onMouseOverHandler.bind(this);
    }
    componentDidMount() {
        this.renderBrush();
    }

    brushed() {
        const extent = d3.event.selection.map(this.xScale.invert, this.xScale);
        const minX = Math.floor(extent[0]);
        const maxY = Math.floor(extent[1]);
        const { data } = this.props;
        const formattedData = data.filter((d) => d.category >= minX && d.category <= maxY );
        this.setState((prevState) => {
           if(prevState.data.length !== formattedData.length){
               return {
                   data: formattedData
               }
           }
        });
    }

    beforeBrushed() {
        d3.event.stopImmediatePropagation();
        d3.select(this.parentNode).transition().call(this.brush.move, this.xScale.range());
    }

    renderBrush(){
        this.brush.on("start brush", this.brushed.bind(this));
        d3.select(this.brushNode)
            .append('g')
            .call(this.brush)
            .call(this.brush.move, d3.extent(this.props.data, d => d.x).map(this.xScale))
            .selectAll('.overlay')
            .on("mousedown touchstart", this.beforeBrushed.bind(this), true);
        d3.select('selection').attr('height', this.props.margin);
    }


    onMouseOverHandler = (d, i, x, y) => {
        const {data} = this.props;
        const username = data.filter(o => o.category === d.category)
            .reduce((total, currentValue) => {
                return total ? `${total},${currentValue.user}` : currentValue.user;
            }, '');
        this.setState((prevState) => {
            let newState = {};
            if (prevState.message !== d.user) {
                newState = {
                    x,
                    y,
                    message: username,
                };
            }
            newState.visible = true;
            return newState;
        });
    };

    renderInnerComponent(data) {
        return (
            <Fragment>
                {this.renderLine(data)}
                {this.renderPoints(data)}
            </Fragment>
        );
    }

    renderLine(data) {
        const lineFunction = d3.line()
            .x(d => this.xScale(d.x))
            .y(d => this.yScale(d.y));
        return (<path
                d={lineFunction(data)}/>
        );
    }

    renderAllPoints(data) {
        return data.map((d, i) => {
            const x = this.xScale(d.x);
            const y = this.yScale(d.y);
            return (<Dot
                keyName={d.user}
                className="points"
                x={x}
                y={y}
            />);
        });
    }


    renderPoints(data) {
        return data.map((d, i) => {
            const x = this.xScale(d.x);
            const y = this.yScale(d.y);
            return (<Dot
                keyName={`points-${d.user}`}
                className="points"
                onMouseLeaveHandler={() => this.setState((prevState) => {
                    if (prevState.visible === true) {
                        return {visible: false};
                    }
                })}
                onMouseOverHandler={(evt) => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    this.onMouseOverHandler(d, i, x, y)
                }}
                x={x}
                y={y}
            />);
        });
    }


    get ruler() {
        const {margin} = this.props;
        const {visible} = this.state;
        return visible && (
            <Fragment>
                <line className="axis"
                      x1={margin}
                      x2={this.calcWidth}
                      y1={this.state.y}
                      y2={this.state.y}/>
                <line className="axis"
                      x1={this.state.x}
                      x2={this.state.x}
                      y1={margin}
                      y2={this.calcHeight}/>
            </Fragment>
        );
    }

}