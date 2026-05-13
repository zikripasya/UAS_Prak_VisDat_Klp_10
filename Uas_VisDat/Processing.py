# ============================================
# FIFA 23 DATA PREPROCESSING
# ============================================

# ============================================
# IMPORT LIBRARY
# ============================================

import pandas as pd
import numpy as np

# ============================================
# MEMBACA DATASET
# ============================================

players = pd.read_csv('data/players_fifa23.csv')
teams = pd.read_csv('data/teams_fifa23.csv')

# ============================================
# MENAMPILKAN DATA AWAL
# ============================================

print("===== DATA PLAYERS =====")
print(players.head())

print("\n===== INFO DATASET =====")
print(players.info())

print("\n===== UKURAN DATASET =====")
print(players.shape)

# ============================================
# CEK MISSING VALUE
# ============================================

print("\n===== MISSING VALUE =====")
print(players.isnull().sum())

# ============================================
# HAPUS KOLOM TIDAK DIGUNAKAN
# ============================================

drop_columns = [
    'PhotoUrl'
]

players.drop(
    columns=drop_columns,
    inplace=True,
    errors='ignore'
)

# ============================================
# PILIH KOLOM PENTING
# ============================================

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

# ============================================
# HAPUS MISSING VALUE
# ============================================

players = players.dropna()

# ============================================
# CEK DATA DUPLIKAT
# ============================================

print("\n===== DATA DUPLIKAT =====")
print(players.duplicated().sum())

# ============================================
# HAPUS DATA DUPLIKAT
# ============================================

players = players.drop_duplicates()

# ============================================
# CEK TIPE DATA
# ============================================

print("\n===== TIPE DATA =====")
print(players.dtypes)

# ============================================
# UBAH FORMAT DATA NUMERIK
# ============================================

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

# ============================================
# HAPUS NULL SETELAH KONVERSI
# ============================================

players = players.dropna()

# ============================================
# MEMBERSIHKAN STRING
# ============================================

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

# ============================================
# FEATURE ENGINEERING
# ============================================

# --------------------------------------------
# KATEGORI UMUR
# --------------------------------------------

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

# --------------------------------------------
# KATEGORI RATING
# --------------------------------------------

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

# ============================================
# FILTERING DATA
# ============================================

players = players[
    players['Overall'] > 70
]

# ============================================
# RESET INDEX
# ============================================

players = players.reset_index(drop=True)

# ============================================
# INFORMASI DATASET SETELAH CLEANING
# ============================================

print("\n===== DATASET SETELAH PREPROCESSING =====")

print(players.head())

print("\n===== UKURAN DATASET BARU =====")
print(players.shape)

print("\n===== INFO DATASET BARU =====")
print(players.info())

# ============================================
# SIMPAN DATASET BERSIH
# ============================================

players.to_csv(
    'players_fifa23_clean.csv',
    index=False
)

# ============================================
# SELESAI
# ============================================

print("\n===================================")
print("PREPROCESSING SELESAI")
print("File berhasil disimpan:")
print("players_fifa23_clean.csv")
print("===================================")