'''
Created on Apr 1, 2017

@author: Duri
'''

#define functions
def main(model, word):
    genders = ["male", "female"]
    similarities = []
    for gender in genders:
        try: 
            similarity = model.similarity(word, gender)
            similarities.append(similarity)
        except KeyError: 
            #set similarity value to 0 if word is not found
            similarities.append(0)
    return genders[similarities.index(max(similarities))]