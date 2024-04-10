class LineChart {
    
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
        this.updateVis();
    }
}