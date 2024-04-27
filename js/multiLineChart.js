class MultiLineChart {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 960,
            containerHeight: _config.containerHeight || 500,
            margin: _config.margin || { top: 50, right: 50, bottom: 50, left: 50 }
        };
        this.fullData = _data;
        this.data = [];
        this.initVis();
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

        vis.xScale = d3.scaleTime()
            .range([0, vis.width]);

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        vis.xAxis = d3.axisBottom(vis.xScale);
        vis.yAxis = d3.axisLeft(vis.yScale);

        vis.xAxisG = vis.chartG.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${vis.height})`);

        vis.yAxisG = vis.chartG.append('g')
            .attr('class', 'axis y-axis');

        vis.marksG = vis.chartG.append('g');
    }

  
    updateVis(parameters) {
        let vis = this;
    
        // Update scales
        vis.xScale.domain(d3.extent(vis.data, d => d.Year));
        vis.yScale.domain([0, d3.max(vis.data, d => d3.max(parameters, parameter => d[parameter]))]);
        vis.colorScale.domain(parameters);
    
        // Update axes
        vis.xAxisG.transition().call(vis.xAxis);
        vis.yAxisG.transition().call(vis.yAxis);
    
        // Bind data
        const lines = vis.marksG.selectAll('.line')
            .data(parameters);
    
        // Enter & update
        lines.enter().append('path')
            .attr('class', 'line')
            .merge(lines)
            .transition()
            .attr('fill', 'none')
            .attr('stroke', d => vis.colorScale(d))
            .attr('stroke-width', 1.5)
            .attr('d', d => {
                const line = d3.line()
                    .x(data => vis.xScale(data.Year))
                    .y(data => vis.yScale(data[d]));
                return line(vis.data);
            });
    
        // Exit
        lines.exit().remove();
    
    }

    filterDataByCountry(country) {
        this.data = this.fullData.filter(d => d.Area === country);
        this.updateVis(["Savanna fires", "Forest fires", "Crop Residues", "Rice Cultivation", "Pesticides Manufacturing"]);
    }
}