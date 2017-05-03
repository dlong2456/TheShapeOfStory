'''
Created on Apr 1, 2017

@author: Duri
'''

#define functions
def main(model, word):
    verbs = ["smell", "move", "think", "ingest", "speak", "see", "hear", "feel", "have", "conclude", "be", "transport", "expel", "propel"]
    similarities = []
    for verb in verbs:
        try: 
            similarity = model.similarity(word, verb)
            similarities.append(similarity)
        except KeyError: 
            #set similarity value to 0 if word is not found
            similarities.append(0)
    return verbs[similarities.index(max(similarities))]