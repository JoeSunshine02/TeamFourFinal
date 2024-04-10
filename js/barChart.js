class BarChart {
    
    /**
     * class constructor with basic chart configuration
     * @param {Object} _config 
     * @param {Array} _data 
     * @param {d3.Scale} _colorScale 
     */
    constructor(_config, _data, _colorScale) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 500,
            containerHeight: _config.containerHeight || 140,
            margin: _config.margin || {top: 5, right: 5, bottom: 20, left: 50}
        };
        this.data = _data;
        this.colorScale = _colorScale;
        this.initVis();
    }

    initVis() {
        let vis = this;
        

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.svg = d3.select(vis.config.parentElement)
            .append('svg')
            .attr('id', 'barchart') // ID of the svg element
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);
        
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        }
    updateVis() {
        let vis = this;
        const speciesCounts = d3.rollups(
            data, 
            v => v.length, 
            d => d.species 
        );
        
        // Extracting species labels and counts from the rollup result
        const speciesLabels = speciesCounts.map(d => d[0]);
        const speciesCountsValues = speciesCounts.map(d => d[1]);

        // Update scales with actual data
        
        vis.xScale.domain(speciesLabels);
        
        vis.yScale.domain([0, d3.max(speciesCountsValues)]);
        console.log(vis)
        vis.renderVis();
    }
    renderVis(x,y) {
       
        let vis = this;

        // Add bars
        vis.chart.selectAll('.bar')
            .data(vis.data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => vis.xScale(d[0]))
            .attr('y', d => vis.yScale(d[1]))
            .attr('width', vis.xScale.bandwidth())
            .attr('height', d => vis.height - vis.yScale(d[1]))
            .attr('fill', 'steelblue')
           
            .on('mouseover', function() {
                d3.select(this).attr('stroke-width', '2px');
            })
            .on('mouseout', function() {
                d3.select(this).attr('stroke-width', '0px');
            });

        // Update axes
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }

}
