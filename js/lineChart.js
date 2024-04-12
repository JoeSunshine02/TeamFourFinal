

/* 
        * Class constructor with basic chart configuration
        * This can also be done with getter and setter methods for individual attributes
        * @param {Object}
        * @param {Array}
   */
class LineChart {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 800,
            containerHeight: _config.containerHeight || 400,
            margin: _config.margin || { top: 50, right: 50, bottom: 50, left: 50 }
        };
        this.data = _data;
        const targetAreas = ["United States of America", "Germany", "China", "India", "Brazil", "Egypt"];
        this.data = this.data.filter(obj => targetAreas.includes(obj.Area));
        this.initVis();
        this.updateVis();
    }

    initVis() {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.svg = d3.select(vis.config.parentElement)
            .append('svg')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        vis.chartG = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

        vis.xScale = d3.scaleBand()
            .range([0, vis.width])
            .padding(0.1);

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom(vis.xScale);
        vis.yAxis = d3.axisLeft(vis.yScale);

        vis.xAxisG = vis.chartG.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${vis.height})`);

        vis.yAxisG = vis.chartG.append('g')
            .attr('class', 'axis y-axis');

        vis.marksG = vis.chartG.append('g');
    }


    
    updateVis() {
        let vis = this;
    
        // Update scales
        vis.xScale.domain(vis.data.map(d => d.Year));
        vis.yScale.domain([0, d3.max(vis.data, d => d["Savanna fires"])]);
    
        // Update axes
        vis.xAxisG.transition().call(vis.xAxis);
        vis.yAxisG.transition().call(vis.yAxis);
    
        // Update line
        // const line = d3.line()
        // .x(d => x(d.Year))
        // .y(d => y(d["Savanna fires"]));
        // console.log(line)
        vis.renderVis();
    }
  
    renderVis() {
        let vis = this;
    
        // Filter dataset to include only rows where "Savanna fires" is not null
        const filteredData = vis.data.filter(d => d["Savanna fires"] !== null);
    
        // Define line generator
        const line = d3.line()
            .x(d => vis.xScale(d.Year))
            .y(d => vis.yScale(d["Savanna fires"]));
    
        // Select or create path element for the line
        const path = vis.marksG.selectAll('.line')
            .data([filteredData]); // Pass the filtered data to the line generator
    
        // Enter
        path.enter().append('path')
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', 'green')
            .attr('stroke-width', 1.5)
            .merge(path) // Merge enter and update selections
            .attr('d', line); // Use the line generator with data
    
        // Exit
        path.exit().remove();
    
        return vis.svg.node();
    }
    
}



//this is code what changes should I make any idea