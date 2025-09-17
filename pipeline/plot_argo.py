import pandas as pd
import matplotlib.pyplot as plt

# Load the combined Argo CSV
df = pd.read_csv("argo_profiles_combined.csv")

# ✅ 1. Temperature Profile (pick one file for example)
sample = df[df['file'] == df['file'].unique()[0]]
plt.figure(figsize=(5,6))
plt.plot(sample['TEMP'], sample['PRES'], marker="o", linestyle="-")
plt.gca().invert_yaxis()  # Depth increases downward
plt.xlabel("Temperature (°C)")
plt.ylabel("Pressure (dbar) ~ Depth")
plt.title(f"Temperature Profile: {sample['file'].iloc[0]}")
plt.grid(True)
plt.show()

# ✅ 2. Salinity Profile (same profile)
plt.figure(figsize=(5,6))
plt.plot(sample['PSAL'], sample['PRES'], marker="o", color="orange", linestyle="-")
plt.gca().invert_yaxis()
plt.xlabel("Salinity (PSU)")
plt.ylabel("Pressure (dbar)")
plt.title(f"Salinity Profile: {sample['file'].iloc[0]}")
plt.grid(True)
plt.show()

# ✅ 3. Map of float locations
plt.figure(figsize=(7,5))
plt.scatter(df['LONGITUDE'], df['LATITUDE'], c=df['TEMP'], cmap="coolwarm", s=30, edgecolors="k")
plt.colorbar(label="Temperature (°C)")
plt.xlabel("Longitude")
plt.ylabel("Latitude")
plt.title("Argo Float Locations (colored by Temp)")
plt.grid(True)
plt.show()

# ✅ 4. Time series of surface temperature (shallowest pressure per profile)
surface = df.sort_values("PRES").groupby(["file", "float_id"]).first().reset_index()
plt.figure(figsize=(10,5))
plt.plot(pd.to_datetime(surface["JULD"]), surface["TEMP"], marker="o", linestyle="-")
plt.xlabel("Date")
plt.ylabel("Surface Temperature (°C)")
plt.title("Surface Temperature Over Time")
plt.grid(True)
plt.show()
