'''
Created on Apr 1, 2017

@author: Duri
'''
import gensim as gensim

#todo: deal with word not in library exception from word2vec

# Load Google's pre-trained Word2Vec model.
print "hi"
model = ""

def initialize():
    model = gensim.models.KeyedVectors.load_word2vec_format('GoogleNews-vectors-negative300.bin', binary=True)

#define functions
def categorize(word):
    categories = ["animal", "person", "location", "object"]
    similarities = []
    for category in categories:
        similarity = model.similarity(word, category)
        similarities.append(similarity)
    print categories[similarities.index(max(similarities))]
    return categories[similarities.index(max(similarities))]


def findGender(word):
    genders = ["male", "female"]
    similarities = []
    for gender in genders:
        similarity = model.similarity(word, gender)
        similarities.append(similarity)
    return genders[similarities.index(max(similarities))]


def findEmotion(word):
    emotions = ["happy", "sad", "fear", "anger", "disgust", "surprise"]
    similarities = []
    for emotion in emotions:
        similarity = model.similarity(word, emotion)
        similarities.append(similarity)
    return emotions[similarities.index(max(similarities))]


def findVerb(word):
    verbs = ["smell", "move", "think", "ingest", "speak", "hear", "feel", "have", "conclude", "be"]
    similarities = []
    for verb in verbs:
        similarity = model.similarity(word, verb)
        similarities.append(similarity)
    return verbs[similarities.index(max(similarities))]

#run program
# words = ["dog", "cat", "store", "apple", "man", "woman", "sister", "princess", "prince", "home", "Cathy", "Bob", "Anne", "Suzy", "Nick"]
# for word in words:
#     print "word: " + word
#     category = categorize(word)
#     print "category: " + category
#     if category is "person":
#         print "gender: " + findGender(word)
# verbs = ["sniff", "walk", "run", "eat", "consume", "buy", "listen", "hold", "possess", "decide", "consider", "ponder", "am", "is", "was", "are", "were", "converse", "said", "drive"]
# for verb in verbs:
#     print "original: " + verb
#     print "mapped verb: " + findVerb(verb)
# emotions = ["smiling", "happy", "miserable", "crying", "scared", "frightened", "afraid", "furious", "gross", "shock"]
# for emotion in emotions:
#     print "original: " + emotion
#     print "mapped emotion: " + findEmotion(emotion)
