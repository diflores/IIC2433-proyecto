const buttonHeight = 20;
const buttonWidth = 88;
const buttonMargin = 10;


const renderGainButtons = svg => {

    const gainButtons = svg.append('g')
        .attr('transform', `translate(${buttonMargin}, ${buttonMargin})`);

    const buttonsUpdate = gainButtons.selectAll('g.gain-button')
        .data(
            ['Support', 'Support Count', 'Confidence', 'Lift']
        );

    // Add rectangles for each button
    const buttonsEnter = buttonsUpdate.enter()
        .append('g')
        .attr('transform', (_d, i) => `translate(${i*buttonWidth})`)
        .attr('class', 'gain-button');

    buttonsEnter.append('rect')
        .attr('class', 'gain-button')
        .attr('fill', 'gainsboro')
        .attr('width', buttonWidth)
        .attr('height', buttonHeight)
        .attr('stroke', 'black');

    const texts = buttonsEnter.append('text')
        .attr('class', 'gain-button')
        .attr('x', buttonWidth / 2)
        .attr('y', buttonMargin)

        // set text at horizontal middle relative to container
        .attr('text-anchor', 'middle')

        // set to vertical middle
        .attr('alignment-baseline', 'middle')
        .attr('font-size', 10)
        .text(d => d);

    gainButtons.call(addInteraction);

};