import xarray as xr
import pandas as pd
import glob
import os

base_path = "."  # script is inside C:\argo

all_data = []

for float_dir in os.listdir(base_path):
    folder_path = os.path.join(base_path, float_dir)
    
    if os.path.isdir(folder_path):  # only process folders
        profile_files = glob.glob(os.path.join(folder_path, "*.nc"))
        print(f"🔎 Found {len(profile_files)} files in {float_dir}")
        
        for f in profile_files:
            if "_meta" in f:
                continue  # skip meta files
            try:
                ds = xr.open_dataset(f)
                df = ds.to_dataframe().reset_index()
                
                # Keep only useful columns (handle missing ones safely)
                keep_cols = [c for c in ['N_PROF','PRES','TEMP','PSAL','LATITUDE','LONGITUDE','JULD'] if c in df.columns]
                df = df[keep_cols]
                
                df['float_id'] = float_dir
                df['file'] = os.path.basename(f)
                
                all_data.append(df)
            except Exception as e:
                print(f"⚠️ Error reading {f}: {e}")

if all_data:
    final_df = pd.concat(all_data)
    final_df.to_csv("argo_profiles_combined.csv", index=False)
    print("✅ Done! Saved argo_profiles_combined.csv")
    print(final_df.head())
else:
    print("⚠️ No data extracted — check file naming or structure")


import pandas as pd
df = pd.read_csv("argo_profiles_combined.csv")
print(df.head())
print(df.columns)