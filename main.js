var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";

d3.json(url, function(error, data) {
  if (error) throw error;

	let baseTemperature = data.baseTemperature,
			monthlyVariance = data.monthlyVariance,
			varianceRange   = [];

	monthlyVariance.map(d => {
		d.variance = d.variance + baseTemperature
		return d.variance;
	})

	let minMaxTemp = d3.extent(monthlyVariance, d => d.variance);

	function CalculateVariance(min, max, count){
		let arr = [];
		let step = (max - min)/count;
		for (let index = 1; index <= count; index++) {
			arr.push(index*step);
		}
		return arr;
	}

	let width = 1518,
			height = 600,
		  cellWidth = Math.ceil(width/Math.ceil(monthlyVariance.length/12)),
			cellHeight = Math.ceil(height/12),
			margin = { top: 120, right: 60, bottom: 120, left: 100 };

	let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
	'August', 'September', 'October', 'November', 'December'];
		
	let svg = d3.select('.container')
							.append('svg')
							.attr('width', width + margin.left + margin.right)
							.attr('height', height + margin.top + margin.bottom);
						
	let toolTip = d3.select('.container')
									.append('div')
									.classed('tooltip',true)
									.attr('id', 'tooltip')
									.style('opacity', 0);

	let xScale = d3.scaleLinear()
									.domain(d3.extent(monthlyVariance, d => d.year))
									.range([0,width]);

	let yScale = d3.scaleBand()
									.domain(months) //months
									.range([0, height]);

	let cScale = d3.scaleOrdinal()
									.domain(d3.extent(monthlyVariance, d => d.variance))
									.range(d3.schemeCategory10);

	let yAxis = d3.axisLeft(yScale)
								.tickSize(10, 1);

	let xAxis = d3.axisBottom(xScale)
								.tickFormat(d3.format('d'));

	let legendHeight = 100,
			legendWidth = 400,
			colors = cScale.range();

	varianceRange = CalculateVariance(minMaxTemp[0], minMaxTemp[1], colors.length);	
	
	let lScale = d3.scaleBand()
									.domain(varianceRange)
									.range([0,legendWidth]);

	let lAxis = d3.axisBottom(lScale)
								.tickFormat(d3.format('.1f'));

	svg
		.append('g')
		.attr('transform', `translate(${margin.left}, ${height+margin.top})`)
		.attr('id', 'x-axis')
		.call(xAxis);
	svg
		.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`)
		.attr('id', 'y-axis')
		.call(yAxis);

	svg
		.selectAll('rect')
		.data(monthlyVariance)
		.enter()
		.append('rect')
		.classed('cell', true)
		.attr('data-year', d => d.year)
		.attr('data-month', d => d.month)
		.attr('data-temp', d => d.variance)
		.attr('x', d => xScale(d.year))
		.attr('y', d => yScale(months[d.month]))
		.attr('width', cellWidth)
		.attr('height', cellHeight)
		.attr('fill', d => cScale(d.variance))
		.attr('transform', `translate(${margin.left}, ${margin.top})`)
		.on('mouseover', (d, i) => {
			toolTip
				.attr('data-year', d.year)
				.transition()
				.duration(200);

			toolTip	
				.style('opacity', '1')
				.style('left', d3.event.pageX+10 + 'px')
				.style('top', d3.event.pageY + 'px')
				.html(`
					<p>${d.year} - ${months[d.month]}</p>
					<p>${d3.format('.1f')(d.variance)} &#8451;</p>
				`);
			
		})
		.on('mouseout', (d, i) => {
			toolTip
				.style('opacity', 0);
		})

	svg
		.append('text')
		.attr('id', 'title')
		.attr('x', width/2)
		.style('font-size', '2em')
		.attr('y', 30)
		.style('text-anchor', 'middle')
		.text('Monthly Global Land-Surface Temperature');

	svg
		.append('text')
		.attr('id', 'description')
		.attr('x', width/2)
		.attr('y', 80)
		.style('font-size', '1.5em')
		.style('text-anchor', 'middle')
		.text('1753 - 2015: base temperature 8.66℃');

	let legend = svg
							.append('g')
							.attr('transform', `translate(${margin.left+30}, ${margin.top+height+margin.bottom-70})`)
							.attr('id', 'legend')
							.attr('width', legendWidth)
							.attr('height', legendHeight);

	legend
		.selectAll('rect')
		.data(varianceRange)
		.enter()
		.append('rect')
		.attr('x', (d, i) => 40*i)
		.attr('y', 0)
		.attr('width', 40)
		.attr('height', 30)
		.attr('fill', d => cScale(d))
		.style('stroke', 'black')
		.style('stroke-width', 2);

	legend	
		.append('g')
		.attr('transform', `translate(0, ${30})`)
		.call(lAxis);
	

})