'''
Created on Apr 1, 2017

@author: Duri
'''

#define functions
def main(model, word):
    genders = ["male", "female"]
    similarities = []
    for gender in genders:
        similarity = model.similarity(word, gender)
        similarities.append(similarity)
    return genders[similarities.index(max(similarities))]