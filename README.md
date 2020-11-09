# WF-Stats

This project is made up of 3 parts: the [demo scraper](./demo-scraper), the [api server](./server), and the [client](./client).

The demo scraper is written in Python. It takes in any amount of .wdz20 files and writes statistics into a sqlite database.

The api server is written using NodeJS and Express. It provides API endpoints for the client by pulling data from the sqlite database.

The client is written in vanilla HTML, CSS, and Javascript. It visualizes the data for the user.

More information about each of these parts is available in their respective directories.


## Languages/Tools Used
- Python (for reading through the demo files in the unknown .wdz20 format)
- SQLite (for storing data pulled from the demos)
- NodeJS, ExpressJS (for the api endpoints that the client can use)
- ChartJS (for visualizing data on the client)
- Vanilla HTML, CSS, and JS (for writing the client)
- VSCode (for developing the project)
- Git/GitHub (for version control)

## TODO
The demo scraper does not automatically extract .wdz20 files into their respective folders. This has to be done manually for now.
Use a program like 7-zip to extract all of your .wdz20 files into the demo-scraper/demos directory.

I'm ignoring all other player stats except mine. I think this is fine for now, but it would be interesting to gather other players' information.
I don't scrape damage information from the demos - only accuracy information. Some of the damage info is implicit, ie. damage for weapons like
lg and eb is constant, so if I record that I hit 30 EBs in one game, that means I did 30*75 = 2,250 damage with the EB.
However, other weapons vary in their damage. Rockets do different damage based on the splash radius; so do grenades from the GL.
I need to rewrite the demo scraper to include accurate damage information contained in the demos.

Currently, I'm only parsing weapon accuracy stats, along with the name of the demo file.
I would like to parse additional information, like the length of each game, the final score, the gametype, the winning/losing players, and damage information (as mentioned above).