# This directory contains the demo scraper portion of this project.

My most recent demos are not automatically parsed and loaded into the database.
This part is done semi-manually using this script, main.py
First, you must extract your .wdz20 files into this demos directory (this part is not automated yet.)
It reads through all directories found in the [demos](./demos) directory and stores relevant statistics in the database.
This script initially wipes the database, and then populates it with data from the demos. This means that all demo scraping is done at the same time.

Whenever you want to load new demos into the project, just put them in the [demos](./demos) directory, and run main.py.
For each demo, the script attempts to parse accuracy information for each player.
However, I am disregarding other players' information. I'm only interested in my statistics, and that's what gets loaded into the database.