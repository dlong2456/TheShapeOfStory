'''
Created on Apr 1, 2017

@author: Duri
'''

#define functions
def main(model, word):
    emotions = ["happy", "sad", "fear", "anger", "disgust", "surprise"]
    similarities = []
    for emotion in emotions:
        similarity = model.similarity(word, emotion)
        similarities.append(similarity)
    return emotions[similarities.index(max(similarities))]