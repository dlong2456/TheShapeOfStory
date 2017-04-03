'''
Created on Apr 1, 2017

@author: Duri
'''

#define functions
def main(model, word):
    print "in verb"
    verbs = ["smell", "move", "think", "ingest", "speak", "hear", "feel", "have", "conclude", "be"]
    similarities = []
    for verb in verbs:
        similarity = model.similarity(word, verb)
        similarities.append(similarity)
    print verbs[similarities.index(max(similarities))]
    return verbs[similarities.index(max(similarities))]