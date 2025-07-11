(() => {
  const width = 700;
  const height = 600;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const centerX = innerWidth / 2;
  const centerY = innerHeight * 0.9;

  let svg;
  let state = {
    data: [],
    selectedOutcome: "all",
  };

  const distanceScale = d3.scaleLinear().domain([0, 500]).range([0, 500]);

  function drawField() {
    svg
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 300)
      .attr("y2", -300)
      .attr("stroke", "green")
      .attr("stroke-width", 2);

    svg
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", -300)
      .attr("y2", -300)
      .attr("stroke", "green")
      .attr("stroke-width", 2);

    svg
      .append("path")
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(0)
          .outerRadius(425)
          .startAngle(-Math.PI / 4)
          .endAngle(Math.PI / 4)
      )
      .attr("stroke", "green")
      .attr("stroke-width", 2)
      .attr("fill", "lightgreen");

    svg.append("circle").attr("r", distanceScale(500)).attr("fill", "none");
  }

  function draw() {
    const filteredData =
      state.selectedOutcome === "all"
        ? state.data
        : state.data.filter((d) => d.PLAY_OUTCOME === state.selectedOutcome);

    const tooltip = d3.select("#tooltip");

    const colorScale = {
      homerun: "red",
      triple: "gold",
      double: "blue",
      single: "green",
      out: "gray",
      error: "pink",
      sacrifice: "lightblue",
      fielderschoice: "purple",
      undefined: "orange",
    };

    const circles = svg
      .selectAll("circle.hit")
      .data(filteredData, (d) => d.BATTER + d.GAME_DATE);

    circles.join(
      (enter) =>
        enter
          .append("circle")
          .attr("class", "hit")
          .attr("r", 5)
          .attr("stroke", "black")
          .attr(
            "cx",
            (d) =>
              distanceScale(d.HIT_DISTANCE) *
              Math.sin((d.EXIT_DIRECTION * Math.PI) / 180)
          )
          .attr(
            "cy",
            (d) =>
              -distanceScale(d.HIT_DISTANCE) *
              Math.cos((d.EXIT_DIRECTION * Math.PI) / 180)
          )
          .attr("fill", (d) => colorScale[d.PLAY_OUTCOME] || "brown")
          .on("mouseover", (event, d) => {
            const playOutcome =
              d.PLAY_OUTCOME === "undefined"
                ? "other"
                : d.PLAY_OUTCOME === "homerun"
                ? "home run"
                : d.PLAY_OUTCOME === "fielderschoice"
                ? "fielders choice"
                : d.PLAY_OUTCOME;
            tooltip.transition().duration(100).style("opacity", 1);
            tooltip.html(`
          <strong>${d.BATTER}</strong><br/>
          Outcome: ${playOutcome}<br/>
          Distance: ${d.HIT_DISTANCE} ft<br/>
          Launch Angle: ${d.LAUNCH_ANGLE}°<br/>
          Exit Speed: ${d.EXIT_SPEED} mph<br/>
          Hang Time: ${d.HANG_TIME}s<br/>
          <i>Click this circle to view the video highlight<i/>
        `);
          })
          .on("mousemove", (event) => {
            tooltip
              .style("left", event.pageX + 12 + "px")
              .style("top", event.pageY - 28 + "px");
          })
          .on("click", (event, d) => {
            window.open(d.VIDEO_LINK, "_blank");
          })
          .on("mouseout", () =>
            tooltip.transition().duration(200).style("opacity", 0)
          ),
      (update) =>
        update
          .transition()
          .duration(300)
          .attr(
            "cx",
            (d) =>
              distanceScale(d.HIT_DISTANCE) *
              Math.sin((d.EXIT_DIRECTION * Math.PI) / 180)
          )
          .attr(
            "cy",
            (d) =>
              -distanceScale(d.HIT_DISTANCE) *
              Math.cos((d.EXIT_DIRECTION * Math.PI) / 180)
          )
          .attr("fill", (d) => colorScale[d.PLAY_OUTCOME] || "brown"),
      (exit) => exit.transition().duration(300).attr("r", 0).remove()
    );
  }

  svg = d3
    .select("#field")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${centerX}, ${centerY})`);

  drawField();

  d3.csv("batted_ball_data.csv", d3.autoType).then((rawData) => {
    state.data = rawData.map((d) => ({
      ...d,
      PLAY_OUTCOME: d.PLAY_OUTCOME.trim().toLowerCase(),
      BATTER: d.BATTER.trim(),
    }));

    const outcomes = [
      "all",
      "single",
      "double",
      "triple",
      "homerun",
      "error",
      "fielderschoice",
      "sacrifice",
      "out",
      "undefined",
    ];

    const dropdown = d3.select("#outcomeSelect");
    dropdown
      .selectAll("option")
      .data(outcomes)
      .join("option")
      .attr("value", (d) => d)
      .text((d) => d.charAt(0).toUpperCase() + d.slice(1));

    dropdown.on("change", (event) => {
      state.selectedOutcome = event.target.value;
      draw();
    });

    draw();
  });
})();
