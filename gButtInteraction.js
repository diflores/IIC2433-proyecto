const addInteraction = gainButtons => {

    // start with the first button selected
    const first = gainButtons.select('g.gain-button')
        .select('rect')
        .attr('fill', 'darkgrey')
        .classed('selected', true)
        .classed('selected', true);

    gainButtons.selectAll('g.gain-button').each( (_, i, n) => {

        const button = d3.select(n[i]);
        const rect = button.select('rect');
        const text = button.select('text');

        button.on('mouseover', () => {

            rect.attr('fill', 'darkgrey');
            button.style('cursor', 'pointer');

        });

        button.on('mouseout', () => {

            if (!rect.classed('selected')) {
                rect.attr('fill', 'gainsboro')
            }

        });

        button.on('click', () => {

            //console.log(gainButtons.selectAll('g.gain-button, text'));

            // clear selected (other and self)
            gainButtons.selectAll('rect')
                .attr('fill', 'gainsboro')
                .classed('selected', false);

            // add selected class to clicked
            rect.classed('selected', true);
            rect.attr('fill', 'darkgrey');

            // change the radius function
            const metric = translator(text.text());
            d3.selectAll('g').filter('.column').select('circle')
                .transition()
                .duration(200)
                .attr('r', node => metricScales(metric)(node.cumGain[metric]));
            d3.selectAll('g').filter('.aggregator').selectAll('.sector')
                .transition()
                .duration(200)
                .attr('d', sectorGenerator.outerRadius(node => metricScales(metric)(node.data.cumGain[metric])));

        })

    })
};