// function buildMetadata(year) {

//   // @TODO: Complete the following function that builds the metadata panel

//   // Use `d3.json` to fetch the metadata for a sample
//   var url = `/year/${year}`;
//   d3.json(url).then(function(response){
//     // Use d3 to select the panel with id of `#sample-metadata`
//     var sample_meta = d3.select("#sample-metadata");
//     // Use `.html("") to clear any existing metadata
//     sample_meta.html("");
//     // Use `Object.entries` to add each key and value pair to the panel
//     // Hint: Inside the loop, you will need to use d3 to append new
//     // tags for each key-value in the metadata.
//     Object.entries(response).forEach(([key, value]) => {
//       sample_meta.append("p").text(`${key}: ${value}`);
//     });
//     console.log(sample_meta)
//   });
//     // BONUS: Build the Gauge Chart
//     // buildGauge(data.WFREQ);
// };


function buildCharts(year) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var samples_url =  `/year/${year}`;
  d3.json(samples_url).then(function(data){

    // var item = data.item;
    var total_salary = data.total_salary;
    var department = data.department;

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: department,
      y: total_salary,
      text: department,
      mode: 'markers',
      marker: {
      size: total_salary,
      color: department
      }
    };
    
    var data_bubble = [trace1];
    
    var layout = {
      xaxis: { title: 'Departments'}
    };
    
    bubble = document.getElementById("bubble");
    Plotly.newPlot(bubble, data_bubble, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    // Get top 10
    var dict = [];
    for (var c = 0; c < data.department.length; c++) {
      dict.push({
          "department": data.department[c],
          "total_salary": data.total_salary[c]
      });
    }
    dict.sort(function(a, b) {
      return parseFloat(b.total_salary) - parseFloat(a.total_salary);
    });
    // dict = dict.slice(0, 10);

    var data_pie = [{
      type: "pie",
      values: dict.map(row => row.total_salary),
      labels: dict.map(row => row.department),
      textinfo: "label+percent",
      textposition: "inside",
      automargin: true
    }]
    
    var layout_pie = {
      height: 800,
      width: 800,
      showlegend: true
      }

    pie = document.getElementById("pie");
    Plotly.newPlot(pie, data_pie, layout_pie);
  });

};


function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/year").then((listYear) => {
      listYear.forEach((year) => {
        selector
          .append("option")
          .text(year)
          .property("value", year);
      });

    // Use the first sample from the list to build the initial plots
      const firstData = listYear[0];
      // buildMetadata(firstData);
      buildCharts(firstData);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    // buildMetadata(newSample);
  }

  // Initialize the dashboard
  init();