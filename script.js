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
        } else if (sceneIndex === 3) {
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
        .html("Overview of songs that have appeared most frequently on the <b>Spotify Top 50 Playlist (March 2023 - July 2023).</b> Hover over bars for more information.")
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
        const topSongs = groupedData.sort((a, b) => b.count - a.count).slice(0, 70);

        // Create a bar chart for Times Appeared on Playlist
        const svg = div.append("svg")
            .attr("width", 900) // Increase the width to make it more visually appealing
            .attr("height", 600); // Increase the height to make it more visually appealing

        const margin = { top: 80, right: 50, bottom: 150, left: 120 }; // Increase the margins for better spacing
        const width = 900 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        const xScale = d3.scaleBand()
          .domain(topSongs.map(d => d.track_name))
          .range([0, width])
          .padding(0.2);

        const yScale = d3.scaleLinear()
          .domain([0, 120])
          .range([height, 0]);

        const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
          .attr("class", "x-axis")
          .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
          .call(xAxis);
        svg.selectAll(".x-axis .tick line").style("display", "none");
        svg.selectAll(".x-axis .tick text").style("display", "none");

        svg.append("g")
          .attr("class", "y-axis")
          .attr("transform", `translate(${margin.left}, ${margin.top})`)
          .call(yAxis);

        const tooltip = div.append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "rgba(0, 0, 0, 0.8)")
            .style("color", "#fff")
            .style("padding", "8px")
            .style("border-radius", "4px");

        const lineGroup = svg.append("g")
            .attr("class", "line-group")
            .style("visibility", "hidden");
        const line = lineGroup.append("line")
            .attr("class", "line")
            .style("stroke", "black")
            .style("stroke-width", 2);
        const lineText = svg.append("g")
            .attr("class", "line-group");

        lineText.append("line")
            .attr("class", "line")
            .style("stroke", "black")
            .style("stroke-width", 2)
            .attr("x1", 370)
            .attr("y1", 140)
            .attr("x2", 700)
            .attr("y2", 300);
        lineText.append("text")
            .attr("class", "labeltext")
            .style("font-size", "16px")
            .style("fill", "black")
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle")
            .attr("x", 890)
            .attr("y", 160)
            .html(`The slope downward shows that the songs on the left have been trending`)
            
        lineText.append("text")
            .attr("class", "labeltext")
            .style("font-size", "16px")
            .style("fill", "black")
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle")
            .attr("x", 830)
            .attr("y", 175)
            .html(`for longer periods of time than the ones on the right.`);

        lineText.append("line")
            .attr("class", "line")
            .style("stroke", "black")
            .style("stroke-width", 2)
            .attr("x1", 125)
            .attr("y1", 95)
            .attr("x2", 213)
            .attr("y2", 95);
        lineText.append("text")
            .attr("class", "labeltext")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("fill", "black")
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle")
            .attr("x", 850)
            .attr("y", 68)
            .html(`Flowers, Ella Baila Sola, Kill Bill, TQG, La Bebe, Cupid, As It Was, Calm Down, and I Wanna Be Yours`);
            
        lineText.append("text")
            .attr("class", "labeltext")
            .style("font-size", "16px")
            .style("fill", "black")
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle")
            .attr("x", 500)
            .attr("y", 85)
            .html(`have appeared <tspan font-weight="bold" dy = "4">113</tspan> <tspan>times, the most on the playlist.</tspan>`);

        const label = lineGroup.append("text")
            .attr("class", "label")
            .style("font-size", "12px")
            .style("fill", "black")
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle");
        // Create bars
        svg.selectAll(".bar")
          .data(topSongs)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", d => xScale(d.track_name) + margin.left)
          .attr("y", d => yScale(d.count) + margin.top)
          .attr("width", xScale.bandwidth())
          .attr("height", 0) // Set initial height to zero for smooth transitions
          .attr("fill", "steelblue")
          .attr("opacity", 0.9)
          .on("mouseover", function (event, d) {
                d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", "orange");
                // Show the line and label
                lineGroup.style("visibility", "visible");

                // Calculate the position and value for the line and label
                const x1 = xScale(d.track_name) + margin.left + xScale.bandwidth() / 2;
                const x2 = margin.left;
                const y = yScale(d.count) + margin.top;
                // const y2 = height + margin.top;

                // Update the line attributes
                line.attr("x1", x1)
                    .attr("y1", y)
                    .attr("x2", x2)
                    .attr("y2", y);

                // Update the label text and position
                label.text(d.count)
                    .attr("x", x2 - 5)
                    .attr("y", y);
                tooltip.style("visibility", "visible")
                    .html(`<b>Song: ${d.track_name}</b><br>
                        <b>Times Appeared on Playlist: ${d.count}</b><br>
                        Duration: ${Math.floor(parseInt(d.duration) / 60000)} mins, ${((parseInt(d.duration) % 60000) / 1000).toFixed(0)} secs<br>
                        Artists: ${d.artists.replace(/[\[\]']/g, "").replace(/,/g, ", ")}<br>
                        Album: ${d.album}<br>
                        Album Release Date: ${new Date(d.album_release_date).toLocaleDateString(undefined, options)}<br>
                        No. of tracks in album: ${d.tracks}<br>
                        Highest position on playlist: ${d.position}
                        `
                    )
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
          })
          .on("mouseout", function (event, d) {
            d3.select(this)
            .transition()
            .duration(200)
            .attr("fill", "steelblue");
            tooltip.style("visibility", "hidden")
            lineGroup.style("visibility", "hidden");
          })
          .transition()
          .duration(1000)
          .attr("height", d => height - yScale(d.count)); // Set the final height of the bars


        // Add the x-axis title
        svg.append("text")
            .attr("class", "x-axis-title")
            .attr("x", width / 2 + margin.left) // Center the title under the x-axis
            .attr("y", height + margin.top + 30) // Position the title below the x-axis
            .style("text-anchor", "middle") // Align the text to the center
            .text("Songs")
            .style("font-weight", "bold");

        // Add the y-axis title
        svg.append("text")
            .attr("class", "y-axis-title")
            .attr("x", -height / 2 - margin.top) // Position the title to the left of the y-axis
            .attr("y", margin.left - 40) // Adjust the y-coordinate to control the distance from the y-axis
            .attr("transform", "rotate(-90)") // Rotate the text to display it vertically
            .style("text-anchor", "middle") // Align the text to the center
            .text("Times Appeared on Playlist")
            .style("font-weight", "bold");
    };

    const createScene2 = () => {

       // Append an h1 heading to the selected div and set text and CSS class
       div.append("h1")
       .text("Top Streamed Songs")
       .attr("class", "heading");

       // Append a paragraph to the selected div and set text and CSS class
       div.append("p")
       .html("Highlighting the top-streamed songs based on their <b>Average Track Popularity Score.</b> Hover over bars for more information.")
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
        const selectedData = groupedData.sort((a, b) => b.average_popularity - a.average_popularity)
        .filter(d => d.average_popularity >= 1);

        const sortedData = [
            ...selectedData.slice(0, 11),
            ...selectedData.slice(66, 70),
            ...selectedData.slice(100, 160)
        ];

        const svg = div.append("svg")
            .attr("width", 900) // Increase the width to make it more visually appealing
            .attr("height", 600); // Increase the height to make it more visually appealing

        const margin = { top: 80, right: 50, bottom: 150, left: 120 }; // Increase the margins for better spacing
        const width = 900 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        const xScale = d3.scaleBand()
          .domain(sortedData.map(d => d.track_name))
          .range([0, width])
          .padding(0.2);

        const yScale = d3.scaleLinear()
          .domain([0, 110])
          .range([height, 0]);

        const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
          .attr("class", "x-axis")
          .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
          .call(xAxis);
        svg.selectAll(".x-axis .tick line").style("display", "none");
        svg.selectAll(".x-axis .tick text").style("display", "none");

        svg.append("g")
          .attr("class", "y-axis")
          .attr("transform", `translate(${margin.left}, ${margin.top})`)
          .call(yAxis);

        const tooltip = div.append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "rgba(0, 0, 0, 0.8)")
            .style("color", "#fff")
            .style("padding", "8px")
            .style("border-radius", "4px");

        const lineGroup = svg.append("g")
            .attr("class", "line-group")
            .style("visibility", "hidden");
        const line = lineGroup.append("line")
            .attr("class", "line")
            .style("stroke", "black")
            .style("stroke-width", 2);
        const lineText = svg.append("g")
            .attr("class", "line-group");

        lineText.append("line")
            .attr("class", "line")
            .style("stroke", "black")
            .style("stroke-width", 2)
            .attr("x1", 350)
            .attr("y1", 130)
            .attr("x2", 800)
            .attr("y2", 230);
        lineText.append("text")
            .attr("class", "labeltext")
            .style("font-size", "16px")
            .style("fill", "black")
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle")
            .attr("x", 900)
            .attr("y", 120)
            .html(`The slope downward shows that the songs on the left have been listened to more`)
            
        lineText.append("text")
            .attr("class", "labeltext")
            .style("font-size", "16px")
            .style("fill", "black")
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle")
            .attr("x", 900)
            .attr("y", 135)
            .html(`frequently and hence have higher track popularity than the ones on the right.`);

        lineText.append("line")
            .attr("class", "line")
            .style("stroke", "black")
            .style("stroke-width", 2)
            .attr("x1", 125)
            .attr("y1", 110)
            .attr("x2", 230)
            .attr("y2", 120);
        lineText.append("text")
            .attr("class", "labeltext")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("fill", "black")
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle")
            .attr("x", 600)
            .attr("y", 80)
            .html(`un x100to, La Bebe, TQG, Creepin, BESO, Kill Bill, <tspan font-weight="normal" dy = 4> and other songs </tspan>`)
            
        lineText.append("text")
            .attr("class", "labeltext")
            .style("font-size", "16px")
            .style("fill", "black")
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle")
            .attr("x", 430)
            .attr("y", 95)
            .html(`have the highest track popularity above <tspan font-weight="bold" dy = 4> 90. </tspan>`);

        const label = lineGroup.append("text")
            .attr("class", "label")
            .style("font-size", "12px")
            .style("fill", "black")
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle");
        // Create bars
        svg.selectAll(".bar")
          .data(sortedData)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", d => xScale(d.track_name) + margin.left)
          .attr("y", d => yScale(d.average_popularity) + margin.top)
          .attr("width", xScale.bandwidth())
          .attr("height", 0) // Set initial height to zero for smooth transitions
          .attr("fill", "red")
          .attr("opacity", 0.9)
          .on("mouseover", function (event, d) {
                d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", "orange");
                // Show the line and label
                lineGroup.style("visibility", "visible");

                // Calculate the position and value for the line and label
                const x1 = xScale(d.track_name) + margin.left + xScale.bandwidth() / 2;
                const x2 = margin.left;
                const y = yScale(d.average_popularity) + margin.top;
                // const y2 = height + margin.top;

                // Update the line attributes
                line.attr("x1", x1)
                    .attr("y1", y)
                    .attr("x2", x2)
                    .attr("y2", y);

                // Update the label text and position
                label.text(d.average_popularity)
                    .attr("x", x2 - 5)
                    .attr("y", y);
                tooltip.style("visibility", "visible")
                    .html(`<b>Song: ${d.track_name}</b><br>
                        <b>Average Track Popularity: ${d.average_popularity}</b><br>
                        Duration: ${Math.floor(parseInt(d.duration) / 60000)} mins, ${((parseInt(d.duration) % 60000) / 1000).toFixed(0)} secs<br>
                        Artists: ${d.artists.replace(/[\[\]']/g, "").replace(/,/g, ", ")}<br>
                        Album: ${d.album}<br>
                        Album Release Date: ${new Date(d.album_release_date).toLocaleDateString(undefined, options)}<br>
                        No. of tracks in album: ${d.tracks}<br>
                        Highest position on playlist: ${d.position}
                        `
                    )
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
          })
          .on("mouseout", function (event, d) {
            d3.select(this)
            .transition()
            .duration(200)
            .attr("fill", "red");
            tooltip.style("visibility", "hidden")
            lineGroup.style("visibility", "hidden");
          })
          .transition()
          .duration(1000)
          .attr("height", d => height - yScale(d.average_popularity)); // Set the final height of the bars


        // Add the x-axis title
        svg.append("text")
            .attr("class", "x-axis-title")
            .attr("x", width / 2 + margin.left) // Center the title under the x-axis
            .attr("y", height + margin.top + 30) // Position the title below the x-axis
            .style("text-anchor", "middle") // Align the text to the center
            .text("Songs")
            .style("font-weight", "bold");

        // Add the y-axis title
        svg.append("text")
            .attr("class", "y-axis-title")
            .attr("x", -height / 2 - margin.top) // Position the title to the left of the y-axis
            .attr("y", margin.left - 40) // Adjust the y-coordinate to control the distance from the y-axis
            .attr("transform", "rotate(-90)") // Rotate the text to display it vertically
            .style("text-anchor", "middle") // Align the text to the center
            .text("Average Track Popularity")
            .style("font-weight", "bold");
    };
    
    const createScene3 = () => {

        // Append an h1 heading to the selected div and set text and CSS class
        div.append("h1")
        .text("Exploring Song Trends")
        .attr("class", "heading");

        // Append a paragraph to the selected div and set text and CSS class
        div.append("p")
        .html("Explore different trends of songs <b>over a period of time.</b>")
        .attr("class", "paragraph");

        div.append("p")
        .html("Select different songs and a visualization to see its chart. Hover over different points on the line to see precise data.")
        .attr("class", "paragraph");

        div.append("p")
        .style("margin-left", "20px")
        .style("margin-right", "20px")
        .html(`Check out songs like <b>TQG, Creepin, Starboy, Flowers</b>, and many more.
            These songs have blue charts with a lot of variance and red charts with less variance and scores in the 90s pretty consistently. This indicates that these songs have consistently been popular among listeners and have been trending on Spotify.
            Interestingly, songs like <b>Search & Rescue, Attention, Hits Different, and BABY HELLO</b> have blue charts with fewer variance and red charts with more variance, indicating lesser average popularity among listeners at times and are not as trending as other songs. Why is this?`)
        .attr("class", "paragraph");

        d3.select(".scene3-container").style("display", "block");

        // Get the unique song names from the data array
        const uniqueSongs = Array.from(new Set(data.map(d => d.track_name))).sort((a,b) => a.localeCompare(b));

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

            // Calculate the average popularity
            const averagePopularity = parseInt(d3.mean(filteredData, d => d.track_popularity));

            // Calculate the count (number of appearances on the playlist)
            const count = filteredData.length;

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

            const infoContainer = d3.select("#info-container");
            infoContainer.selectAll("text").remove();

            // Append text elements to the info-container
            infoContainer.append("text")
                .attr("x", 90)
                .attr("y", 50)
                .attr("font-size", 20)
                .attr("fill", "black")
                .attr("style", "font-weight: bold;")
                .text(`Times Appeared on Playlist: `);

            infoContainer.append("text")
                .attr("x", 335)
                .attr("y", 50)
                .attr("font-size", 20)
                .attr("fill", "steelblue")
                .attr("style", "font-weight: bold;")
                .text(`${count}`);
            

            infoContainer.append("text")
                .attr("x", 90)
                .attr("y", 80)
                .attr("font-size", 20)
                .attr("fill", "black")
                .attr("style", "font-weight: bold;")
                .text(`Average Track Popularity: `);

            infoContainer.append("text")
                .attr("x", 320)
                .attr("y", 80)
                .attr("font-size", 20)
                .attr("fill", "red")
                .attr("style", "font-weight: bold;")
                .text(`${averagePopularity}`);
            
            
                   

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

    const createScene4 = () => {
        // Append an h1 heading to the selected div and set text and CSS class
        div.append("h1")
        .text("Conclusion")
        .attr("class", "heading");

        // Append a paragraph to the selected div and set text and CSS class
        div.append("p")
        .html("There is a <b>positive correlation</b> between a song's <u>Average Track Popularity</u> and the number of <u>Times Appeared</u> on the <b>Spotify Top 50 Playlist.</b>")
        .attr("class", "paragraph");

        div.append("p")
        .html("Hover over circles for more information.")
        .attr("class", "paragraph");

        d3.select(".scene3-container").style("display", "none");

        const tooltip = div.append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "rgba(0, 0, 0, 0.8)")
            .style("color", "#fff")
            .style("padding", "8px")
            .style("border-radius", "4px");

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
                average_popularity: averageTrackPopularity,
                count: entries.length
            };
        });

        const selectedTrackNames = [
            "Starboy",
            "TQG",
            "Creepin' (with The Weeknd & 21 Savage)",
            "Flowers",
            "Attention",
            "BABY HELLO",
            "Hits Different",
            "Search & Rescue",
            "Kill Bill",
            "La Bebe - Remix",
            "Mean (Taylor's Version)",
            "Frágil",
            "Yandel 150",
            "La Bachata",
            "Overdrive",
            "LUNA",
            "Flooded The Face",
            "Blank Space",
            "Eyes Closed",
            "Last Night"

          ];
          
          const sortedData = groupedData.filter((song) => {
            return selectedTrackNames.includes(song.track_name);
          });

          sortedData.sort((a, b) => b.average_popularity - a.average_popularity);

        // Define the SVG container dimensions and margins
        const svgWidth = 800;
        const svgHeight = 600;
        const margin = { top: 80, right: 50, bottom: 150, left: 120 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        // Create the SVG container
        const svg = div.append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        // Create the x and y scales
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(sortedData, d => d.count)])
            .range([margin.left, width + margin.left]);

        const yScale = d3.scaleLinear()
            .domain([50, 100])
            .range([height + margin.top, margin.top]);

        // Append the x and y axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height + margin.top})`)
            .call(xAxis);

        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxis);

        svg.selectAll(".circle")
            .data(sortedData)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("cx", d => xScale(d.count))
            .attr("cy", d => yScale(d.average_popularity))
            .attr("r", 6)
            .attr("fill", "steelblue")
            .attr("opacity", 0.7)
            .on("mouseover", function (event, d) {
                d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", "orange");
                tooltip.style("visibility", "visible")
                    .html(`<b>Song: ${d.track_name}</b><br>
                        <b>Average Track Popularity: ${d.average_popularity}</b><br>
                        <b>Times Appeared on Playlist: ${d.count}</b><br>
                        Duration: ${Math.floor(parseInt(d.duration) / 60000)} mins, ${((parseInt(d.duration) % 60000) / 1000).toFixed(0)} secs<br>
                        Artists: ${d.artists.replace(/[\[\]']/g, "").replace(/,/g, ", ")}<br>
                        Album: ${d.album}<br>
                        Album Release Date: ${new Date(d.album_release_date).toLocaleDateString(undefined, options)}<br>
                        No. of tracks in album: ${d.tracks}<br>
                        Highest position on playlist: ${d.position}
                        `
                    )
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function () {
                d3.select(this)
                  .transition()
                  .duration(200)
                  .attr("fill", "steelblue");
                tooltip.style("visibility", "hidden");
            })

        // Add the x-axis title
        svg.append("text")
            .attr("class", "x-axis-title")
            .attr("x", width / 2 + margin.left)
            .attr("y", height + margin.top + 40)
            .style("text-anchor", "middle")
            .text("Times Appeared on Playlist")
            .style("font-weight", "bold")
            .style("fill", "steelblue");

        // Add the y-axis title
        svg.append("text")
            .attr("class", "y-axis-title")
            .attr("x", -height / 2 - margin.top)
            .attr("y", margin.left - 40)
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .style("fill", "red")
            .text("Average Track Popularity")
            .style("font-weight", "bold");
        svg.append("line")
            .attr("class", "line")
            .style("stroke", "black")
            .style("stroke-width", 2)
            .attr("x1", 120)
            .attr("y1", 370)
            .attr("x2", 120 + width)
            .attr("y2", 95);

    }

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
        if (sceneIndex < 3) {
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
        case 3:
          createScene4();
        default:
          break;
      }
    };
});