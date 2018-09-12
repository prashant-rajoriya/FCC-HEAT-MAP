var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";

d3.json(url, function(error, data) {
  if (error) throw error;

	let baseTemperature = data.baseTemperature,
			monthlyVariance = data.monthlyVariance;

	monthlyVariance.map(d => {
		d.variance = d.variance + baseTemperature
		return d.variance;
	})

	let cellWidth = 5,
			cellHeight = 50,
			width = Math.ceil(monthlyVariance.length/12)*cellWidth,
			height = cellHeight*12,
			margin = { top: 120, right: 10, bottom: 60, left: 100 };

			
	let svg = d3.select('.container')
							.append('svg')
							.attr('width', width + margin.left + margin.right)
							.attr('height', height + margin.top + margin.bottom);

	let xScale = d3.scaleLinear()
									.domain(d3.extent(monthlyVariance, d => d.year))
									.range([0,width]);

	let yScale = d3.scaleTime()
									.domain([new Date(2018, 0, 1), new Date(2018, 11, 1)]) //months
									.range([0, height]);

	let cScale = d3.scaleOrdinal()
									.domain(d3.extent(monthlyVariance, d => d.variance))
									.range(d3.schemeCategory10);

	let yAxis = d3.axisLeft(yScale)
								.ticks(d3.timeMonth)
			 					.tickFormat(d3.timeFormat("%B"))
								.tickSize(10, 1);

	let xAxis = d3.axisBottom(xScale)
								.tickFormat(d3.format('d'));

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
		.attr('y', d => yScale(new Date(2018, d.month, 1)))
		.attr('width', cellWidth)
		.attr('height', cellHeight)
		.attr('fill', d => cScale(d.variance))
		.attr('transform', `translate(${margin.left}, ${margin.top})`);

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

})