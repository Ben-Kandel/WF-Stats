# WF-Stats

## **The Goal**
[Warsow](https://warsow.net/) is an open-source arena FPS, first released in 2005 as an alpha version.

I will not describe the game here (that information is available on the wbesite), but I will say that movement and aim are the key to success.

Player statistics are displayed in-game on the scoreboard, but are not available anywhere else. For other arena FPS games, websites like [qlstats.net](https://qlstats.net/) exist. However, there is nothing like this for Warsow.

I am interested in visualizing my statistics over time, such as weapon accuracies (how well I can aim) and game scores (how often I win).

Players can record their games, called demos, in the .wdz20 file format. They can play back their demos using the Warsow client.
Demo files basically contain lines of timestamped commands that the engine reads through to reconstruct the state of the game over time.
This is why you can't easily export demo files to a video format - that information simply doesn't exist in the files.
The qfusion engine takes care of translating demo files to something you can see. Demo files don't make sense by themselves.

**Except**...you can parse some useful information from them. You can extract .wdz20 files and look through the resulting files.
Each demo contains a file, which you can run the `strings` utility on. `strings` takes in a file and returns printable character sequences.
We can use this to look at the contents of any demo. More information about this is located in the demo-scraper directory.

**This project is my attempt to provide a way to collate and visualize player statistics.**
*It's also a great way for me to learn front-end technologies :)*

Sidenote: [Warfork](https://store.steampowered.com/app/671610/Warfork/) is a fork of Warsow. There is a lot to talk about here with regards to why it was created and the goals of each game, but I will not go into that here. At the time of writing, both games are very similar, and use the same file format for their demos. That means the demo-scraper will work on both Warfork **AND** Warsow demos. 

You may be wondering why the project is called 
> WF-Stats

when I've been speaking about Warsow. It's simply because I have more demos from Warfork than Warsow, and so that's where the majority of the data is coming from.

## **The Methods**

This project is made up of 3 parts: the [demo scraper](./demo-scraper), the [api server](./server), and the [client](./client).

The demo scraper is written in Python. It takes in any amount of .wdz20 files and writes relevant information into the sqlite database.

The api server is written using NodeJS and Express. It provides API endpoints for the client and sends data from the sqlite database.

The client is written in vanilla HTML, CSS, and Javascript. It visualizes the data for the user.

More information about each of these parts is available in their respective directories.


## Languages/Tools Used
- Python (for reading through the demo files in the unknown .wdz20 format)
- SQLite (for storing data pulled from the demos)
- NodeJS, ExpressJS (for the RESTful api endpoints that the client uses)
- ChartJS (for visualizing data on the client)
- Vanilla HTML, CSS, and JS (for writing the client)
- VSCode (for developing the project)
- Git/GitHub (for version control)

## **TODO**
The demo scraper does not automatically extract .wdz20 files into their respective folders. This has to be done manually for now.
Use a program like 7-zip to extract all of your .wdz20 files into the demo-scraper/demos directory.

I'm ignoring all other player stats except mine. I think this is fine for now, but it would be interesting to gather other players' information.
I don't scrape damage information from the demos - only accuracy information. Some of the damage info is implicit, ie. damage for weapons like
lg and eb is constant, so if I record that I hit 30 EBs in one game, that means I did 30*75 = 2,250 damage with the EB.
However, other weapons vary in their damage. Rockets do different damage based on the splash radius; so do grenades from the GL.
I need to rewrite the demo scraper to include accurate damage information contained in the demos.

Currently, I'm only parsing weapon accuracy stats, along with the name of the demo file.
I would like to parse additional information, like the length of each game, the final score, the gametype, the winning/losing players, and damage information (as mentioned above).
