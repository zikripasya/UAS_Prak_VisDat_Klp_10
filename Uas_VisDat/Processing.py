# FIFA 23 DATA PREPROCESSING

# Import Library

import pandas as pd
import numpy as np

# Membaca Dataset

players = pd.read_csv('data/players_fifa23.csv')
teams = pd.read_csv('data/teams_fifa23.csv')

# Menampilkan Data Awal

print("===== DATA PLAYERS =====")
print(players.head())

print("\n===== INFO DATASET =====")
print(players.info())

print("\n===== UKURAN DATASET =====")
print(players.shape)

# Mengecek Missing Value

print("\n===== MISSING VALUE =====")
print(players.isnull().sum())

# Menghapus Kolom Tidak Digunakan

drop_columns = [
    'PhotoUrl'
]

players.drop(
    columns=drop_columns,
    inplace=True,
    errors='ignore'
)

# Memilih Kolom Penting

players = players[[
    'Name',
    'Overall',
    'Potential',
    'Age',
    'Club',
    'Nationality',
    'Positions',
    'ValueEUR',
    'WageEUR',
    'PaceTotal',
    'ShootingTotal',
    'PassingTotal',
    'DribblingTotal',
    'DefendingTotal',
    'PhysicalityTotal'
]]

# Menghapus Missing Value

players = players.dropna()

# Mengecek Data Duplikat

print("\n===== DATA DUPLIKAT =====")
print(players.duplicated().sum())

# Menghapus Data Duplikat

players = players.drop_duplicates()

# Mengecek Tipe Data

print("\n===== TIPE DATA =====")
print(players.dtypes)

# Mengubah Format Data Numerik

numeric_cols = [
    'Overall',
    'Potential',
    'Age',
    'ValueEUR',
    'WageEUR',
    'PaceTotal',
    'ShootingTotal',
    'PassingTotal',
    'DribblingTotal',
    'DefendingTotal',
    'PhysicalityTotal'
]

for col in numeric_cols:

    players[col] = pd.to_numeric(
        players[col],
        errors='coerce'
    )

# Menghapus Null Setelah Konversi

players = players.dropna()

# Membersihkan Data String

players['Club'] = (
    players['Club']
    .astype(str)
    .str.strip()
)

players['Nationality'] = (
    players['Nationality']
    .astype(str)
    .str.strip()
)

players['Positions'] = (
    players['Positions']
    .astype(str)
    .str.strip()
)

# Feature Engineering

# Membuat Kategori Umur

def age_category(age):

    if age < 23:
        return 'Young'

    elif age < 30:
        return 'Adult'

    else:
        return 'Senior'


players['AgeCategory'] = (
    players['Age']
    .apply(age_category)
)

# Membuat Kategori Rating

def rating_category(overall):

    if overall >= 85:
        return 'World Class'

    elif overall >= 75:
        return 'Good Player'

    else:
        return 'Average'


players['RatingCategory'] = (
    players['Overall']
    .apply(rating_category)
)

# Filtering Data

players = players[
    players['Overall'] > 65
]

# Reset Index

players = players.reset_index(drop=True)

# Informasi Dataset Setelah Preprocessing

print("\n===== DATASET SETELAH PREPROCESSING =====")

print(players.head())

print("\n===== UKURAN DATASET BARU =====")
print(players.shape)

print("\n===== INFO DATASET BARU =====")
print(players.info())

# Menyimpan Dataset Bersih

players.to_csv(
    'players_fifa23_clean.csv',
    index=False
)

# Preprocessing Selesai

print("\n===================================")
print("PREPROCESSING SELESAI")
print("File berhasil disimpan:")
print("players_fifa23_clean.csv")
print("===================================")