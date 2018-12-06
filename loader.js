document.addEventListener('DOMContentLoaded', () => {

    init();

});

let links;
let nodes;

const init = async () => {

    const data = await d3.json('../ass_rules/new_mushroom_data_3_06.json');

    const columnNodes = data.nodes.filter(node => node.type === 'column');

    links = data.links;
    nodes = data.nodes;

    const svg = d3.select('#force-directed-graph')
        .append('div')
        .attr('id', 'vis-container')
        .append('svg')
        .attr('id', 'vis-svg')
        .attr("viewBox", [0, 0, svgWidth, svgHeight]);

    const svgScatter = d3.select('div#scatterplot')
        .append('svg')
        .attr('id', 'scatter-svg')
        .attr("viewBox", [0, 0, svgWidth, svgHeight]);

    defineMetrics();

    renderScatter(svgScatter);
    renderGraph(data, svg);
    renderGainButtons(svg);
    renderLegend(svg, data);

};
