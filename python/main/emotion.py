'''
Created on Apr 1, 2017

@author: Duri
'''

#define functions
def main(model, word):
    emotions = ["happy", "sad", "fear", "anger", "disgust", "surprise"]
    similarities = []
    for emotion in emotions:
        try: 
            similarity = model.similarity(word, emotion)
            similarities.append(similarity)
        except KeyError: 
            #set similarity value to 0 if word is not found
            similarities.append(0)
    return emotions[similarities.index(max(similarities))]