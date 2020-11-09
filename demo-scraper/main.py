import subprocess
from string import punctuation
from typing import List
import stuff
import re
import os
import sqlite3



IGNORE_LIST = ["__pycache__"]
NAME = "Minionsman"

directories = filter(lambda x: x not in IGNORE_LIST, next(os.walk("./demos"))[1]) # get list of directories in ./demos
conn = sqlite3.connect("database.db")
cur = conn.cursor()

cur.execute("DELETE FROM games")
cur.execute("DELETE FROM stats")
game_id = 0
for directory in directories:
    print(directory)
    p = subprocess.run(["strings", "-d", f"./demos/{directory}/{directory}"], stdout=subprocess.PIPE)
    text = p.stdout.decode("utf-8")
    split_text = text.splitlines()
    data = filter(lambda x: x.startswith("plstats"), split_text)
    player_data = filter(lambda x: re.search("^cs [0-9][0-9][0-9][0-9].*hand.*$", x), split_text)
    player_names = stuff.Parser.get_player_names(list(player_data))
    player_accs = stuff.get_all_player_stats(list(data))
    final_dict = {}
    for line in player_accs:
        player_id = line[0] # the player id is the first number in the list, we need to hold on to it
        cleaned_list = stuff.clean_player_stats(line)
        stats = stuff.get_player_stats(cleaned_list)
        final_dict[player_names[player_id]] = stats


    if "Minionsman" in final_dict:
        # print("I was in this game")
        my_stats = final_dict["Minionsman"]
        if len(my_stats) == 8: #we only care about these properly recorded games
            # print(my_stats)
            print("adding this game")
            gb_fired = my_stats["gb"][0]
            gb_hit = my_stats["gb"][1]
            mg_fired = my_stats["mg"][0]
            mg_hit = my_stats["mg"][1]
            rg_fired = my_stats["rg"][0]
            rg_hit = my_stats["rg"][1]
            gl_fired = my_stats["gb"][0]
            gl_hit = my_stats["gb"][1]
            rl_fired = my_stats["rl"][0]
            rl_hit = my_stats["rl"][1]
            pg_fired = my_stats["pg"][0]
            pg_hit = my_stats["pg"][1]
            lg_fired = my_stats["lg"][0]
            lg_hit = my_stats["lg"][1]
            eb_fired = my_stats["eb"][0]
            eb_hit = my_stats["eb"][1]
            print(f"game_id: {game_id} directory: {directory}")
            # cur.execute(f"INSERT INTO games VALUES ({game_id}, {directory})")
            cur.execute("INSERT INTO games VALUES (?, ?)", [game_id, directory])
            params = [game_id, gb_fired, gb_hit, mg_fired, mg_hit, rg_fired, rg_hit, gl_fired, gl_hit, rl_fired, rl_hit, pg_fired, pg_hit, lg_fired, lg_hit, eb_fired, eb_hit]
            cur.execute("INSERT INTO stats VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", params)
            # conn.execute(f"INSERT INTO stats VALUES ({game_id}, {gb_fired}, {gb_hit}, {mg_fired}, {mg_hit}, {rg_fired}, {rg_hit}, {gl_fired}, {gl_hit}, {rl_fired}, {rl_hit}, {pg_fired}, {pg_hit}, {lg_fired}, {lg_hit}, {eb_fired}, {eb_hit})")
            game_id += 1
            continue #go to the next game..
    else:
        print("I was not in this game")

conn.commit()
conn.close()

# so say we had an entry like this: [8, 0, 563, 170, 100, 27, 10, 1, 66, 14, 6, 0, 2041, 40, 21]
# the order of weapons is... gb, mg, rg, gl, rl, pg, lg, eb
# mappings = {"gb": [1, 2], "mg": [3, 4], "rg": [5, 6], "gl": [7, 8], "rl": [9, 10], "pg": [11, 12], "lg": [13, 14], "eb": [17, 18]}
weapon_order = ["gb", "mg", "rg", "gl", "rl", "pg", "lg", "eb"]
# the order of weapons is... gb, mg, rg, gl, rl, pg, lg, eb

# plstats 0 " 9 20 0 0 0 48 1 192 43 16 2 1075 346 1075 124 55 124 0"
# player 9
# 0% gb 20 0
# 0% mg 0
# 0% rg 0 
# 2% gl 48 1
# 22% rl 192 43
# 13% pg 16 2
# 32% lg 1075 346
# 44% eb 124 55
# so basically, we get each pair of numbers [shots fired, shots hit]
# but we ignore 0s
# the last pair is worthless
# the pair before that is eb%
#




#so we know that lines that begin with ch are chats, tch are team chat. scb is scoreboard

# ch 10 "(v) Good game!"
# means that character 10 put in the chat (v) Good Game!
# if you wanted to cross reference that with the scoreboard, remember that the indices start at 0
# so &p 9 is actually the 10th player (need to verify this, I've seen cases where that is not true)

#scb "&t 2 2 73 &p 1 stoned^7 53 11 21 0 &p 7 ^7 5 2 71 0 &p 0 ^7 0 0 103 0 &p 2 soup^7 0 0 11 0 &p 6 ^7 0 1 162 0 &t 3 11 83 &p 5 ^7 41 20 7 0 &p 3 ^3ICA^7 39 13 15 0 &p 9 ^7 10 1 143 0 &p 8 ^7 9 3 176 0 &p 4 NSSH^7 0 0 77 0 &s &y "
#scb describes the scoreboard. it has info for each player, startign at the top left on the scoreboard and going down.
# &p 1 stoned 53 11 21 0
# &p 1 clan tag, score, frags, ping, 0 (idk what this is)

# &t 2 2 73
# team, score of 2, ping of 73
# &t 3 11 83
# team, score of 11, ping of 83

# plstats 0 " 1 43 8 0 0 146 23 122 9 0 455 177 455 55 27 55 0"
# the first number is the player number (indexed from 0)
# and then each pair numbers is [shots fired, shots hit] for each weapon
# so 43 8 is 43 shots fired on gunblade, and 8 of them hit. 19%
# 0 mg
# 0 rg
# 146 23 - gl 16%
# 122 9 - rl 7%
# 0 pg
# 455 177 - lg 39%
# 55 27 - eb 49%
# 55 0 - I don't know what these numbers are.

# plstats 0 " 1 43 8 0 0 146 23 122 9 0 455 177 55 27"

# with open("result.txt", "w") as file:
#     file.write(text)
    