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


////////////////////////////
// PAGE 1 - VIEW BY YEAR //
///////////////////////////
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

    /// build Bubble chart
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
    Plotly.newPlot(pie, data_pie, layout_pie, { responsive: true });

  //////////// to show department table
    var dept_values = [department,total_salary]
    var dept_table = [{
    type: 'table',
    header: {
      values: [["<b>Department</b>"], ["<b>Total Salary</b>"]],
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
    table = document.getElementById("table");
    Plotly.plot(table, dept_table);

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
  buildCharts2(newSample)
  // buildMetadata(newSample);
}

// Initialize the dashboard
init();

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

//   function optionChanged(newDept) {
//   // Fetch new data each time a new sample is selected
//   buildCharts(newDept);
//   // buildMetadata(newSample);
// };

  // Initialize the dashboard
init2();

    // @TODO: Build a Bubble Chart using the sample data
    // var trace1 = {
    //   x: department,
    //   y: total_salary,
    //   text: department,
    //   mode: 'markers',
    //   marker: {
    //   size: total_salary,
    //   color: department
    //   }
    // };
    
    // var data_bubble = [trace1];
    
    // var layout = {
    //   xaxis: { title: 'Departments'}
    // };
    
    // bubble = document.getElementById("bubble");
    // Plotly.newPlot(bubble, data_bubble, layout);