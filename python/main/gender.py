'''
Created on Apr 1, 2017

@author: Duri
'''

#define functions
def main(model, word):
    print "in gender"
    genders = ["male", "female"]
    similarities = []
    for gender in genders:
        similarity = model.similarity(word, gender)
        similarities.append(similarity)
    print genders[similarities.index(max(similarities))]
    return genders[similarities.index(max(similarities))]