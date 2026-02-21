# Batted Ball Data Viz

Data Visualization of the Excel file provided by the ATL Braves

## How to see the visualization

### Locally

If the CSV file is not available, and you only have the Excel file, please run `python3 data/excel-to-csv.py` and have the Excel file be named `BattedBallData.xlsx` and in the same directory as the python file.

After getting the data, please run a local server. If you are using VS Code, I recommend _Live Server_ since it is an extension.

Installation steps for _Live Server_ extension:

1. Launch VS Code
2. Quick Open (Ctrl+P) or (Command + P - on Mac)
3. Paste the following command, and press enter: `ext install ritwickdey.liveserver`
4. if prompted, confirm that you do want to install the extension

Open the port where the local server is running, and the visualizations should appear.

### Online

The visualization can be seen on my website: [https://acevedojetter.com/projects/batted-ball-data-viz](https://acevedojetter.com/projects/batted-ball-data-viz)

## What am I looking at after running the local server?

There are two visualizations that are the same when opening the local server:

1. Can be filtered by the outcome of the play, such as _single, double, triple, home run, error, fielders choice, sacrifice, out,_ and _other_.
2. Can be filtered to see the plate appearances of each player in the dataset

The circles in the visualizations are the distance the ball traveled and where it lands according to the data. The color in the circle means the outcome of the play.

There is a tooltip that tells you who took the plate appearance, outcome, distance, LA, EV, and hang time. If you click on a circle, it will open the video of the play which it references.
