from typing import List, Tuple, Dict
from string import punctuation
import re

PLAYER_OFFSET = 2912

def remove_punc(s: str) -> str:
    return s.translate(str.maketrans('', '', punctuation))

def convert_to_acc_list(acc_list: str) -> List[int]:
    answer = remove_punc(acc_list).split() #remove punctuation, split on whitespace
    answer = answer[2::] #we want to get rid of the "plstats 0" part
    return list(map(lambda x: int(x), answer)) #turn everything into an int and return as a list



def get_all_player_stats(data: List[str]) -> List[int]:
    # so right now, we're not getting all of the players accuracies.
    # but I guess I don't care. I just want MY accuracies.
    seen_players = set()
    answer = []
    for line in reversed(data):
        cleaned_line = convert_to_acc_list(line)
        player_num = cleaned_line[0]
        if player_num not in seen_players:
            seen_players.add(player_num)
            #now add it to our final answer list
            answer.append(cleaned_line)
    return answer

def clean_player_stats(stats: List[int]) -> List[int]:
    acc_list = stats[1:-2] #get rid of the player id and last two numbers (which are useless)
    acc_list = acc_list[0:-3] + acc_list[-2::] #get rid of the random duplicate number
    return acc_list

def get_player_stats(stats: List[int]) -> Dict[str, Tuple[int, int]]:
    current_weapon = 0
    answer = {}
    weapon_list = ["gb", "mg", "rg", "gl", "rl", "pg", "lg", "eb"]
    skip_next = False
    for i in range(0, len(stats)-1):
        if(skip_next):
            skip_next = False
            continue
        shots_fired = stats[i]
        shots_hit = stats[i+1]
        if(shots_fired == 0): # this weapon wasn't used. record it and move on to the next pair
            answer[weapon_list[current_weapon]] = (0, 0)
            current_weapon += 1
        else:
            answer[weapon_list[current_weapon]] = (shots_fired, shots_hit)
            current_weapon += 1
            skip_next = True
    return answer





class Parser:
    @staticmethod
    def get_player_names(data: List[str]) -> Dict[int, str]:
        answer = {}
        for line in data:
            player_id = int(line[3:7]) - PLAYER_OFFSET
            player_name = line[15:line.find("\\hand")]
            player_name = re.sub(r"(\^[0-9])*", "", player_name)
            answer[player_id] = player_name
        return answer

