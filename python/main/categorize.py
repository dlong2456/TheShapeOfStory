'''
Created on Apr 1, 2017

@author: Duri
'''

#define functions
def main(model, word):
    categories = ["animal", "person", "location", "object"]
    similarities = []
    for category in categories:
        similarity = model.similarity(word, category)
        similarities.append(similarity)
    return categories[similarities.index(max(similarities))]