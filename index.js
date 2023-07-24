function scene1() {
    // Use D3 to select the div with id "myDiv"
    const div = d3.select("#myDiv");

    // Append an h1 heading to the selected div and set text and CSS class
    div.append("h1")
    .text("Top Songs")
    .attr("class", "heading");

    // Append a paragraph to the selected div and set text and CSS class
    div.append("p")
    .html("Overview of songs that have appeared most frequently on the <b>Spotify Top 50 Playlist</b>.")
    .attr("class", "paragraph");

    // Load the data from the CSV file
    d3.csv("playlist.csv").then(data => {
        // Sort the data based on "position_in_playlist" in ascending order
        const filteredData = data.sort((a, b) => a.position_in_playlist - b.position_in_playlist);

        // Group the filtered data by "track_name" and calculate the count of the positions in playlist
        const groupedData = Array.from(d3.group(filteredData, d => d.track_name), ([track_name, entries]) => ({
            track_name,
            artists: entries[0].name_of_artists,
            count: entries.length
        }));

        // Sort the grouped data based on the count of #1 positions in descending order
        const topSongs = groupedData.sort((a, b) => b.count - a.count);

        // Append a table to the selected div and create table rows and cells
        const table = div.append("table");

        // Create table header row
        const headerRow = table.append("tr");
        headerRow.append("th").text("Songs");
        headerRow.append("th").text("Artists");
        headerRow.append("th").text("Frequency");

        // Create table rows for each top song
        const rows = table.selectAll("tr")
        .data(topSongs)
        .enter()
        .append("tr");

        // Add cells for track name, artists, and count of #1 positions
        rows.append("td").text(d => d.track_name);
        rows.append("td").text(d => d.artists.replace(/[\[\]']/g, "").replace(/,/g, ", "));
        rows.append("td").text(d => d.count);
    });
}

scene1();