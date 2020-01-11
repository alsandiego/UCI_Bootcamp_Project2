////////////////////////////
// PAGE 2 - VIEW BY DEPT //
///////////////////////////

function buildCharts2(department) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var scatterURL =  `/bubble2/${department}`;
  d3.json(scatterURL).then(function(data){
    // our data dict
    var position = data.position
    var salary2014 = data["2014"]
    var salary2015 = data["2015"]
    var salary2016 = data["2016"]
    var salary2017 = data["2017"]
    var salary2018 = data["2018"]

    var trace1 = {
      x: position,
      y: salary2014,
      // mode: 'markers',
      type: 'bar',
      name: "2014"
    };
    
    var trace2 = {
      x: position,
      y: salary2015,
      // mode: 'markers',
      type: 'bar',
      name: "2015"
    };

    var trace3 = {
      x: position,
      y: salary2016,
      // mode: 'markers',
      type: 'bar',
      name: "2016"
    };
    
    var trace4 = {
      x: position,
      y: salary2017,
      // mode: 'markers',
      type: 'bar',
      name: "2017"
    };

    var trace5 = {
      x: position,
      y: salary2018,
      // mode: 'markers',
      type: 'bar',
      name: "2018"
    };
    
    var data = [trace1, trace2, trace3, trace4, trace5];
    var layout = {barmode: 'group'}
    scatter = document.getElementById("scatter");
    Plotly.newPlot("scatter", data, layout, {responsive: true})


    //////////// to show department table
    var dept_values = [position,salary2014,salary2015,salary2016,salary2017,salary2018]
    var dept_table = [{
    type: 'table',
    header: {
      values: [["<b>Position</b>"], ["<b>2014</b>"],["<b>2015</b>"],["<b>2016</b>"],["<b>2017</b>"],["<b>2018</b>"]],
      align: "center",
      line: {width: 1, color: 'black'},
      fill: {color: "grey"},
      font: {family: "Arial", size: 12, color: "white"}
    },
    cells: {
      values: dept_values,
      align: "center",
      line: {color: "black", width: 1},
      font: {family: "Arial", size: 11, color: ["black"]}
    }
    }]
    table = document.getElementById("table2");
    Plotly.newPlot(table, dept_table);

  }); 
};

function init2() {
  // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset2");
  // Use the list of sample names to populate the select options
    d3.json("/department").then((listDepartment) => {
      listDepartment.forEach((department) => {
        selector
          .append("option")
          .text(department)
          .property("value", department);
      });

  // Use the first sample from the list to build the initial plots
      const firstData2 = listDepartment[0];
      buildCharts2(firstData2);
    });
  }

// Initialize the dashboard
init2();


function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts2(newSample);
  // buildMetadata(newSample);
}