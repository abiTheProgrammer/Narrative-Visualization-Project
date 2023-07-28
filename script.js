d3.csv("playlist.csv").then(data => {
    let sceneIndex = 0; // Initialize the scene index
    const div = d3.select(".scene"); // Use D3 to select the div with class "scene"

    // Use D3 to select the buttons
    const prevBtn = d3.select(".prevBtn");
    const nextBtn = d3.select(".nextBtn");

    // Function to update button visibility based on the scene
    const updateButtonVisibility = (sceneIndex) => {
        if (sceneIndex === 0) {
            prevBtn.style("display", "none");
        } else if (sceneIndex === 2) {
            nextBtn.style("display", "none");
        } else {
            prevBtn.style("display", "block");
            nextBtn.style("display", "block");
        }
    };

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };

    const createScene1 = () => {
        
        // Append an h1 heading to the selected div and set text and CSS class
        div.append("h1")
        .text("Top Songs")
        .attr("class", "heading");

        // Append a paragraph to the selected div and set text and CSS class
        div.append("p")
        .html("Overview of songs that have appeared most frequently on the <b>Spotify Top 50 Playlist (March 2023 - July 2023).</b> Hover over cells for more information.")
        .attr("class", "paragraph");

        d3.select(".scene3-container").style("display", "none");

        // Sort the data based on "position_in_playlist" in ascending order
        const filteredData = data.sort((a, b) => a.position_in_playlist - b.position_in_playlist);

        // Group the filtered data by "track_name" and calculate the count of the positions in playlist
        const groupedData = Array.from(d3.group(filteredData, d => d.track_name), ([track_name, entries]) => ({
            track_name,
            artists: entries[0].name_of_artists,
            album: entries[0].album_name,
            album_release_date: entries[0].album_release_date,
            tracks: entries[0].number_of_tracks_in_album,
            duration: entries[0].track_duration_ms,
            position: entries[0].position_in_playlist,
            count: entries.length
        }));

        // Sort the grouped data based on the count of position_in_playlist in descending order
        const topSongs = groupedData.sort((a, b) => b.count - a.count);

        // Append a table to the selected div and create table rows and cells
        const table = div.append("table");

        // Create table header row
        const headerRow = table.append("tr");
        headerRow.append("th").text("Songs");
        headerRow.append("th").text("Times Appeared");

        // Create table rows for each top song
        const rows = table.selectAll("tr")
        .data(topSongs)
        .enter()
        .append("tr");

        // Add cells for track name, number of times appeared, and tooltip
        rows.append("td")
            .text(d => d.track_name)
            .attr("data-tooltip", d => 
                `Duration: ${Math.floor(parseInt(d.duration) / 60000)} mins, ${((parseInt(d.duration) % 60000) / 1000).toFixed(0)} secs
                Artists: ${d.artists.replace(/[\[\]']/g, "").replace(/,/g, ", ")}
                Album: ${d.album}
                Album Release Date: ${new Date(d.album_release_date).toLocaleDateString(undefined, options)}
                No. of tracks in album: ${d.tracks}
                `
            );
        rows.append("td")
            .text(d => d.count)
            .attr("data-tooltip", d => 
                `Highest position on playlist: ${d.position}`
            );
    };

    const createScene2 = () => {

       // Append an h1 heading to the selected div and set text and CSS class
       div.append("h1")
       .text("Top Streamed Songs")
       .attr("class", "heading");

       // Append a paragraph to the selected div and set text and CSS class
       div.append("p")
       .html("Highlighting the top-streamed songs based on their <b>Average Track Popularity Score.</b> Hover over cells for more information.")
       .attr("class", "paragraph");

       d3.select(".scene3-container").style("display", "none");

        // Group the data by track_name and calculate the average track_popularity for each song
        const groupedData = Array.from(d3.group(data, d => d.track_name), ([track_name, entries]) => {
            const sumTrackPopularity = d3.sum(entries, d => d.track_popularity);
            const averageTrackPopularity = parseInt(sumTrackPopularity / entries.length);
            return { 
                track_name,
                artists: entries[0].name_of_artists,
                album: entries[0].album_name,
                album_release_date: entries[0].album_release_date,
                tracks: entries[0].number_of_tracks_in_album,
                duration: entries[0].track_duration_ms,
                position: entries[0].position_in_playlist,
                average_popularity: averageTrackPopularity 
            };
        });
        
        // Sort the grouped data in descending order based on average_popularity >= 1
        const sortedData = groupedData.sort((a, b) => b.average_popularity - a.average_popularity)
        .filter(d => d.average_popularity >= 1);

        // Append a table to the selected div and create table rows and cells
        const table = div.append("table");

        // Create table header row
        const headerRow = table.append("tr");
        headerRow.append("th").text("Songs");
        headerRow.append("th").text("Average Track Popularity Score");

        // Create table rows for each top song
        const rows = table.selectAll("tr")
        .data(sortedData)
        .enter()
        .append("tr");

        // Add cells for track name, average track popularity, and tooltip
        rows.append("td")
            .text(d => d.track_name)
            .attr("data-tooltip", d => 
                `Duration: ${Math.floor(parseInt(d.duration) / 60000)} mins, ${((parseInt(d.duration) % 60000) / 1000).toFixed(0)} secs
                Artists: ${d.artists.replace(/[\[\]']/g, "").replace(/,/g, ", ")}
                Album: ${d.album}
                Album Release Date: ${new Date(d.album_release_date).toLocaleDateString(undefined, options)}
                No. of tracks in album: ${d.tracks}
                `
            );
        rows.append("td")
            .text(d => d.average_popularity)
            .attr("data-tooltip", d => 
                `Highest position on playlist: ${d.position}`
            );
    };
    
    const createScene3 = () => {

        // Append an h1 heading to the selected div and set text and CSS class
        div.append("h1")
        .text("Song Trends")
        .attr("class", "heading");

        // Append a paragraph to the selected div and set text and CSS class
        div.append("p")
        .html("Explore different trends of songs <b>over a period of time.</b>")
        .attr("class", "paragraph");

        div.append("p")
        .html("Select different songs and a visualization to see its chart. Hover over different points on the line to see precise data.")
        .attr("class", "paragraph");

        d3.select(".scene3-container").style("display", "block");

        // Get the unique song names from the data array
        const uniqueSongs = Array.from(new Set(data.map(d => d.track_name)));

        // Select the song dropdown
        const songDropdown = d3.select("#song-dropdown");

        // Add options to the song dropdown
        songDropdown.selectAll("option")
            .data(uniqueSongs)
            .enter()
            .append("option")
            .attr("value", d => d) // Set the value of the option to the song name
            .text(d => d); // Set the displayed text for the option to the song name

        const svg = d3
            .select(".scene3-container") // Select the drop-down container instead of the .line-chart class
            .select("svg") // Append the SVG to the drop-down container
            .attr("width", 600)
            .attr("height", 400)

        function createLineChart(data, selectedTrackName, selectedYAxis) {
            // Filter data for the selected track name
            const filteredData = data.filter(d => d.track_name === selectedTrackName);
            
            // Sort data based on the track_add_date in ascending order
            filteredData.sort((a, b) => new Date(a.track_add_date) - new Date(b.track_add_date));
            
            // Get the minimum and maximum dates for the x-axis domain
            const minDate = new Date(filteredData[0].track_add_date);
            const maxDate = new Date(filteredData[filteredData.length - 1].track_add_date);

            // Remove previous chart elements
            svg.selectAll(".x-axis").remove();
            svg.selectAll(".y-axis").remove();
            svg.selectAll(".line-path").remove();
            svg.selectAll(".x-axis-title").remove();
            svg.selectAll(".y-axis-title").remove();
            svg.selectAll(".no-data-text").remove();
                   

            const margin = { top: 50, right: 50, bottom: 50, left: 50 };
            const width = 600 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;
            
            if (minDate.getTime() === maxDate.getTime()) {
                const formattedDate = minDate.toLocaleDateString(undefined, options);
                const trackName = selectedTrackName;
                const playlistText = "Spotify Top 50 Playlist";
                const onceText = "once";
                const positionText = "Position:";
                const popularityText = "Track Popularity:";

                const textElement = svg
                    .append("text")
                    .attr("class", "no-data-text")
                    .attr("x", width / 2)
                    .attr("y", height / 2)
                    .attr("text-anchor", "middle")
                    .attr("font-size", "20")
                    .attr("fill", "black");

                if (trackName.length > 50) {
                    const midPoint = Math.floor(trackName.length / 2);

                    // Split the song name into two parts at the mid-point
                    const [songNameLine1, songNameLine2] = [
                        trackName.substring(0, midPoint),
                        trackName.substring(midPoint)
                    ];
                    // Append the song name with line breaks
                    textElement
                        .append("tspan")
                        .attr("x", width / 2)
                        .attr("dy", "-0.6em") // Adjust the line spacing for the first line
                        .text(songNameLine1)
                        .style("font-weight", "bold")
                        .style("fill", "fuchsia")
                        .style("text-shadow", "1px 1px 2px rgba(0, 0, 0, 0.5)");

                    if (songNameLine2) {
                        textElement
                            .append("tspan")
                            .attr("x", width / 2)
                            .attr("dy", "1.2em") // Adjust the line spacing for the second line
                            .text(songNameLine2)
                            .style("font-weight", "bold")
                            .style("fill", "fuchsia")
                            .style("text-shadow", "1px 1px 2px rgba(0, 0, 0, 0.5)");
                    }

                } else {
                    // Append the song name
                    textElement
                        .append("tspan")
                        .attr("x", width / 2)
                        .text(trackName)
                        .style("font-weight", "bold")
                        .style("fill", "fuchsia")
                        .style("text-shadow", "1px 1px 2px rgba(0, 0, 0, 0.5)");
                }
                
                // Append "has appeared on the Spotify Top 50 Playlist only once."
                textElement
                    .append("tspan")
                    .attr("x", width / 2)
                    .attr("dy", "1.2em") // Adjust the line spacing for subsequent lines
                    .text(`has appeared on the ${playlistText} only ${onceText}.`)
                    .style("font-weight", "bold");

                // Append "Date: <formattedDate>"
                textElement
                    .append("tspan")
                    .attr("x", width / 2)
                    .attr("dy", "2.4em") // Adjust the line spacing for subsequent lines
                    .text(`Date: ${formattedDate}`)
                    .style("font-weight", "bold");

                // Append "Position:" or "Track Popularity:" based on selectedYAxis
                textElement
                    .append("tspan")
                    .attr("x", width / 2)
                    .attr("dy", "3.6em") // Adjust the line spacing for subsequent lines
                    .style("font-weight", "bold")
                    .text(selectedYAxis === "position" ? positionText : popularityText)
                    .style("fill", selectedYAxis === "position" ? "steelblue" : "red");

                // Append the position or track popularity value
                textElement
                    .append("tspan")
                    .attr("x", width / 2)
                    .attr("dx", (selectedYAxis === "position") ? "2.4em" : "4.3em") // Adjust the line spacing for subsequent lines
                    .text(selectedYAxis === "position" ? filteredData[0].position_in_playlist : filteredData[0].track_popularity)
                    .style("font-weight", "bold")
                    .style("fill", "limegreen")
                    .style("text-shadow", "1px 1px 2px rgba(0, 0, 0, 0.5)");
                return;
            }

            const xScale = d3.scaleTime()
                    .domain([minDate, maxDate])
                    .range([0, width]);

            // Create the x-axis with the customized tick format
            const xAxis = d3.axisBottom(xScale)
                .tickValues([minDate, maxDate]) // Use only the start and end date as tick values
                .tickFormat(d3.timeFormat("%b %d, %Y"));

            let yScale, yAxis;
            if (selectedYAxis === "position") {
                yScale = d3.scaleLinear()
                    .domain([50, 1])
                    .range([height, 0]);
                
                yAxis = d3.axisLeft(yScale)
                    .tickValues(d3.range(50, 0, -5).concat(1));
            } else {
                yScale = d3.scaleLinear()
                    .domain([0, 100])
                    .range([height, 0]);
                    yAxis = d3.axisLeft(yScale);
            }
            
            // Add the axes to the chart
            svg
                .append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
                .call(xAxis);

            svg
                .append("g")
                .attr("class", "y-axis")
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
                .call(yAxis);

            // Create the line generator for the line chart
            const line = d3.line()
                .x(d => xScale(new Date(d.track_add_date)) + margin.left)
                .y(d => yScale((selectedYAxis === "position") ? d.position_in_playlist : d.track_popularity) + margin.top);

            // Remove any existing line path before adding the new one
            svg.select(".line-path").remove();

            const tooltip = d3.select(".tooltip.line-chart-tooltip");

            // Add the line path to the chart
            svg.append("path")
                .datum(filteredData)
                .attr("class", "line-path")
                .attr("d", line)
                .attr("fill", "none")
                .attr("stroke", (selectedYAxis === "position") ? "steelblue" : "red")
                .attr("stroke-width", 2)
                .on("mouseover", function (event, d) {
                    const [x, y] = d3.pointer(event);

                    // Get the corresponding date and y-axis metric for the hovered point
                    const date = xScale.invert(x - margin.left);
                    const yMetric = Math.round(yScale.invert(y - margin.top));
              
                    // Update the tooltip content and position
                    tooltip.style("display", "block")
                      .html(`Date: ${date.toLocaleDateString(undefined, options)}<br>${(selectedYAxis === "position") ? "Position" : "Track Popularity"}: ${yMetric}`)
                      .style("left", event.pageX + "px")
                      .style("top", event.pageY - 40 + "px")
                      .style("opacity", 1); // Set opacity to 1 to show the tooltip with fade-in animation
                  })
                .on("mouseout", function () {
                    // ... (your existing code)
            
                    // Hide the tooltip on mouseout with fade-out animation
                    tooltip.style("opacity", 0)
                    .transition()
                    .delay(200) // Add a small delay before hiding the tooltip to allow the fade-out animation to complete
                    .style("display", "none");
                });
            
            // Add the x-axis title
            svg.append("text")
                .attr("class", "x-axis-title")
                .attr("x", width / 2 + margin.left) // Center the title under the x-axis
                .attr("y", height + margin.top + 35) // Position the title below the x-axis
                .style("text-anchor", "middle") // Align the text to the center
                .text("Date added to playlist - Date removed from playlist")
                .style("font-weight", "bold");

            // Add the y-axis title
            svg.append("text")
                .attr("class", "y-axis-title")
                .attr("x", -height / 2 - margin.top) // Position the title to the left of the y-axis
                .attr("y", margin.left - 35) // Adjust the y-coordinate to control the distance from the y-axis
                .attr("transform", "rotate(-90)") // Rotate the text to display it vertically
                .style("text-anchor", "middle") // Align the text to the center
                .text((selectedYAxis === "position") ? "Playlist Positions" : "Track Popularity")
                .style("font-weight", "bold");

        }
            

        // Event listener for song dropdown
        d3.select("#song-dropdown").on("change", function () {
            const selectedSong = d3.select(this).property("value");
            const selectedYAxis = d3.select("#y-axis-dropdown").property("value");
            createLineChart(data, selectedSong, selectedYAxis);
        });

        // Event listener for y-axis dropdown
        d3.select("#y-axis-dropdown").on("change", function () {
            const selectedSong = d3.select("#song-dropdown").property("value");
            const selectedYAxis = d3.select(this).property("value");
            createLineChart(data, selectedSong, selectedYAxis);
        });

        createLineChart(data, data[0].track_name, "position");
        d3.select("#song-dropdown").property("value", data[0].track_name);
        d3.select("#y-axis-dropdown").property("value", "position");
              
    };
    
    // Initialize the narrative visualization with the first scene
    createScene1();
    updateButtonVisibility(sceneIndex);

    // Add event listeners for navigation buttons

    prevBtn.on("click", () => {
        if (sceneIndex > 0) {
            sceneIndex--;
            updateButtonVisibility(sceneIndex);
            updateScene();
        }
    });

    nextBtn.on("click", () => {
        if (sceneIndex < 2) {
            sceneIndex++;
            updateButtonVisibility(sceneIndex);
            updateScene();
        }
    });

    // Function to update the scene based on the current scene index
    const updateScene = () => {
      div.selectAll("*").remove(); // Clear the existing content

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
        default:
          break;
      }
    };
});