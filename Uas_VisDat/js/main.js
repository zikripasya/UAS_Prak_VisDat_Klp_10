// js/script.js

// Membaca Dataset CSV

d3.csv("data/players_fifa23_clean.csv").then(function(data){

    // KONVERSI DATA NUMERIK
    data.forEach(function(d){

        d.Overall = +d.Overall;
        d.Age = +d.Age;
        d.ValueEUR = +d.ValueEUR;

    });

    // TOOLTIP
    const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "#141c2f")
        .style("color", "white")
        .style("padding", "10px")
        .style("border-radius", "10px")
        .style("font-size", "14px")
        .style("display", "none");

    const width = 500;
    const height = 400;
    const margin = 50;

    // VISUALISASI 1
    // BAR CHART
    // TOP 10 PLAYER OVERALL

    const topPlayers = data
        .sort((a, b) => b.Overall - a.Overall)
        .slice(0, 10);

    const barSvg = d3.select("#barChart");

    barSvg
        .attr("width", width)
        .attr("height", height);

    const x = d3.scaleBand()
        .domain(topPlayers.map(d => d.Name))
        .range([margin, width - margin])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height - margin, margin]);

    // Axis X

    barSvg.append("g")
        .attr("transform", `translate(0, ${height - margin})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-20)")
        .style("text-anchor", "end")
        .style("fill", "white");

    // Axis Y

    barSvg.append("g")
        .attr("transform", `translate(${margin},0)`)
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("fill", "white");

    // Bar

    barSvg.selectAll("rect")
        .data(topPlayers)
        .enter()
        .append("rect")
        .attr("x", d => x(d.Name))
        .attr("y", height - margin)
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .attr("fill", "#00ff88")

        .on("mouseover", function(event, d){

            tooltip
                .style("display", "block")
                .html(`
                    <strong>${d.Name}</strong><br>
                    Overall: ${d.Overall}<br>
                    Club: ${d.Club}
                `);

        })

        .on("mousemove", function(event){

            tooltip
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 30) + "px");

        })

        .on("mouseout", function(){

            tooltip.style("display", "none");

        })

        .transition()
        .duration(1500)
        .attr("y", d => y(d.Overall))
        .attr("height", d => height - margin - y(d.Overall));

    // VISUALISASI 2
    // LINE CHART
    // AGE DISTRIBUTION

    const ageCount = d3.rollup(
        data,
        v => v.length,
        d => d.Age
    );

    const ageData = Array.from(ageCount, ([Age, Count]) => ({
        Age,
        Count
    }));

    ageData.sort((a, b) => a.Age - b.Age);

    const lineSvg = d3.select("#lineChart");

    lineSvg
        .attr("width", width)
        .attr("height", height);

    const xLine = d3.scaleLinear()
        .domain(d3.extent(ageData, d => d.Age))
        .range([margin, width - margin]);

    const yLine = d3.scaleLinear()
        .domain([0, d3.max(ageData, d => d.Count)])
        .range([height - margin, margin]);

    // Axis X

    lineSvg.append("g")
        .attr("transform", `translate(0, ${height - margin})`)
        .call(d3.axisBottom(xLine))
        .selectAll("text")
        .style("fill", "white");

    // Axis Y

    lineSvg.append("g")
        .attr("transform", `translate(${margin},0)`)
        .call(d3.axisLeft(yLine))
        .selectAll("text")
        .style("fill", "white");

    // Line

    const line = d3.line()
        .x(d => xLine(d.Age))
        .y(d => yLine(d.Count));

    lineSvg.append("path")
        .datum(ageData)
        .attr("fill", "none")
        .attr("stroke", "#00ff88")
        .attr("stroke-width", 3)
        .attr("d", line);

    // VISUALISASI 3
    // SCATTER PLOT
    // OVERALL VS VALUE

    const scatterSvg = d3.select("#scatterPlot");

    scatterSvg
        .attr("width", width)
        .attr("height", height);

    const xScatter = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Overall)])
        .range([margin, width - margin]);

    const yScatter = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.ValueEUR)])
        .range([height - margin, margin]);

    // Axis X

    scatterSvg.append("g")
        .attr("transform", `translate(0, ${height - margin})`)
        .call(d3.axisBottom(xScatter))
        .selectAll("text")
        .style("fill", "white");

    // Axis Y

    scatterSvg.append("g")
        .attr("transform", `translate(${margin},0)`)
        .call(d3.axisLeft(yScatter))
        .selectAll("text")
        .style("fill", "white");

    // Circle

    scatterSvg.selectAll("circle")
        .data(data.slice(0, 500))
        .enter()
        .append("circle")
        .attr("cx", d => xScatter(d.Overall))
        .attr("cy", d => yScatter(d.ValueEUR))
        .attr("r", 5)
        .attr("fill", "#00ff88")
        .attr("opacity", 0.7)

        .on("mouseover", function(event, d){

            tooltip
                .style("display", "block")
                .html(`
                    <strong>${d.Name}</strong><br>
                    Overall: ${d.Overall}<br>
                    Value: €${d.ValueEUR}
                `);

        })

        .on("mousemove", function(event){

            tooltip
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 30) + "px");

        })

        .on("mouseout", function(){

            tooltip.style("display", "none");

        });

    // VISUALISASI 4
    // PIE CHART
    // PLAYER POSITION DISTRIBUTION

    const pieSvg = d3.select("#pieChart");

    pieSvg
        .attr("width", width)
        .attr("height", height);

    const positionCount = d3.rollup(
        data,
        v => v.length,
        d => d.Positions.split(",")[0]
    );

    const pieData = Array.from(positionCount, ([Position, Count]) => ({
        Position,
        Count
    }));

    const radius = Math.min(width, height) / 2 - 40;

    const pieGroup = pieSvg.append("g")
        .attr(
            "transform",
            `translate(${width / 2}, ${height / 2})`
        );

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie()
        .value(d => d.Count);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    pieGroup.selectAll("path")
        .data(pie(pieData))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.Position))

        .on("mouseover", function(event, d){

            tooltip
                .style("display", "block")
                .html(`
                    <strong>${d.data.Position}</strong><br>
                    Total Player: ${d.data.Count}
                `);

        })

        .on("mousemove", function(event){

            tooltip
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 30) + "px");

        })

        .on("mouseout", function(){

            tooltip.style("display", "none");

        });

    // VISUALISASI 5
    // HORIZONTAL BAR CHART
    // TOP CLUB AVERAGE OVERALL

    const clubSvg = d3.select("#horizontalBarChart");

    clubSvg
        .attr("width", width)
        .attr("height", height);

    const clubAverage = Array.from(

        d3.rollup(
            data,
            v => d3.mean(v, d => d.Overall),
            d => d.Club
        ),

        ([Club, Average]) => ({
            Club,
            Average
        })

    );

    clubAverage.sort((a, b) => b.Average - a.Average);

    const topClubs = clubAverage.slice(0, 10);

    const xClub = d3.scaleLinear()
        .domain([0, 100])
        .range([margin, width - margin]);

    const yClub = d3.scaleBand()
        .domain(topClubs.map(d => d.Club))
        .range([margin, height - margin])
        .padding(0.2);

    // Axis X

    clubSvg.append("g")
        .attr("transform", `translate(0, ${height - margin})`)
        .call(d3.axisBottom(xClub))
        .selectAll("text")
        .style("fill", "white");

    // Axis Y

    clubSvg.append("g")
        .attr("transform", `translate(${margin},0)`)
        .call(d3.axisLeft(yClub))
        .selectAll("text")
        .style("fill", "white");

    // Bar

    clubSvg.selectAll(".clubBar")
        .data(topClubs)
        .enter()
        .append("rect")
        .attr("class", "clubBar")
        .attr("x", margin)
        .attr("y", d => yClub(d.Club))
        .attr("width", d => xClub(d.Average) - margin)
        .attr("height", yClub.bandwidth())
        .attr("fill", "#00ff88")

        .on("mouseover", function(event, d){

            tooltip
                .style("display", "block")
                .html(`
                    <strong>${d.Club}</strong><br>
                    Average Overall: ${d.Average.toFixed(2)}
                `);

        })

        .on("mousemove", function(event){

            tooltip
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 30) + "px");

        })

        .on("mouseout", function(){

            tooltip.style("display", "none");

        });

});
