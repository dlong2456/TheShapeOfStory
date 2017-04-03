'''
Created on Apr 1, 2017

@author: Duri
'''

#define functions
def main(model, word):
    print "hi2"
    categories = ["animal", "person", "location", "object"]
    similarities = []
    for category in categories:
        similarity = model.similarity(word, category)
        similarities.append(similarity)
    print categories[similarities.index(max(similarities))]
    return categories[similarities.index(max(similarities))]