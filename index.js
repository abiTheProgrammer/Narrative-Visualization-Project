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

    const createScene1 = () => {
        
        // Append an h1 heading to the selected div and set text and CSS class
        div.append("h1")
        .text("Top Songs")
        .attr("class", "heading");

        // Append a paragraph to the selected div and set text and CSS class
        div.append("p")
        .html("Overview of songs that have appeared most frequently on the <b>Spotify Top 50 Playlist</b>.")
        .attr("class", "paragraph");

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
                Album Release Date: ${d.album_release_date}
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
       .html("Highlighting the top-streamed songs based on their <b>Average Track Popularity Score.</b>")
       .attr("class", "paragraph");

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
                Album Release Date: ${d.album_release_date}
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
      // Implement code for Scene 3 here
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