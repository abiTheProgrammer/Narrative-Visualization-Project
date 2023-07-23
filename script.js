// Load data and start the narrative visualization
d3.csv("playlist.csv").then(data => {
    let sceneIndex = 0; // Initialize the scene index
    const scenes = [
      { title: "Scene 1: Overview", description: "An overview of the top songs in the playlist." },
      { title: "Scene 2: Top-streamed songs", description: "Highlight the top-streamed songs and their artists." },
      { title: "Scene 3: Song/Artist Trend", description: "Visualize the trend of streams over time for a specific song or artist." },
      { title: "Scene 4: Conclusion", description: "Concluding remarks." }
    ];
    const svg = d3.select(".chart");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
  
    // Define functions to create scenes
    const createScene1 = () => {
        d3.csv("playlist.csv").then(data => {
            // Filter rows where the "Position" is equal to 1
            const filteredData = data.filter(item => parseInt(item.Position) === 1);
            
            // Group the filtered data by song name and calculate the count of #1 positions
            const groupedData = Array.from(d3.group(filteredData, d => d["Track Name"]), ([song, entries]) => ({
                song,
                count: entries.length,
            }));
            
            // Sort the grouped data based on the count of #1 positions in descending order
            const topSongs = groupedData.sort((a, b) => b.count - a.count);

            // Create a table to show the top songs' overview
            const table = d3.select(".chart")
            .append("table")
            .attr("class", "overview-table");

            // Create table rows for each top song
            const rows = table.selectAll("tr")
            .data(topSongs)
            .enter()
            .append("tr");

            // Add cells for song name
            rows.append("td").text(d => d["track_name"]);
        });      
    };
  
    const createScene2 = () => {
      // Implement code for Scene 2 here
    };
  
    const createScene3 = () => {
      // Implement code for Scene 3 here
    };
  
    const createScene4 = () => {
      // Implement code for Scene 4 here
    };
  
    // Initialize the narrative visualization with the first scene
    createScene1();
    d3.select(".chart").append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .text(scenes[sceneIndex].title)
        .style("font-size", "24px");
  
      d3.select(".chart").append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2 + 30)
        .text(scenes[sceneIndex].description)
        .style("font-size", "16px");
  
    // Add event listeners for navigation buttons
    d3.select("#prevBtn").on("click", () => {
      if (sceneIndex > 0) {
        sceneIndex--;
        updateScene();
      }
    });
  
    d3.select("#nextBtn").on("click", () => {
      if (sceneIndex < scenes.length - 1) {
        sceneIndex++;
        updateScene();
      }
    });
  
    // Function to update the scene based on the current scene index
    const updateScene = () => {
      svg.selectAll("*").remove(); // Clear the existing content
  
      // Update scene title and description
      const currentScene = scenes[sceneIndex];
      d3.select(".chart").append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .text(currentScene.title)
        .style("font-size", "24px");
  
      d3.select(".chart").append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2 + 30)
        .text(currentScene.description)
        .style("font-size", "16px");
  
      // Call the appropriate scene function based on the scene index
      switch (sceneIndex) {
        case 0:
          createScene1();
          break;
        case 1:
          createScene2();
          break;
        case 2:
          createScene3();
          break;
        case 3:
          createScene4();
          break;
        default:
          break;
      }
    };
  });
  