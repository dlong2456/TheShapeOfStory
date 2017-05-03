'''
Created on Apr 1, 2017

@author: Duri
'''

#define functions
def main(model, word):
    categories = ["animal", "person", "location", "object"]
    similarities = []
    for category in categories:
        try: 
            similarity = model.similarity(word, category)
            similarities.append(similarity)
        except KeyError: 
            #set similarity value to 0 if word is not found
            similarities.append(0)
    return categories[similarities.index(max(similarities))]