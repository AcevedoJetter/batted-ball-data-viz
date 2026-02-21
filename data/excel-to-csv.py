import pandas as pd

pd.read_excel("BattedBallData.xlsx").to_csv("batted_ball_data.csv", index=False)