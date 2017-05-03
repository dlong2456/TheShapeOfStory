'''
Created on Apr 1, 2017

@author: Duri
'''
import sys
import gensim as gensim
import traceback
import categorize
import emotion
import gender
import verb
import time

# Load Google's pre-trained Word2Vec model.
model = gensim.models.KeyedVectors.load_word2vec_format('GoogleNews-vectors-negative300.bin', binary=True)
print("model loaded")
#have to flush output so that java program can read it in real-time
sys.stdout.flush()

try:  
    while True:
        try:
            string = sys.stdin.readline()
            if (string is not None):
                strings = string.split()
                function = strings[0]
                word = strings[1]
                if (function == "categorize"):
                    reload(categorize)
                    print(categorize.main(model, word))
                    sys.stdout.flush()
                elif (function == "gender"): 
                    reload(gender)
                    print(gender.main(model, word))
                    sys.stdout.flush()
                elif (function == "verb"): 
                    reload(verb)
                    print(verb.main(model, word))
                    sys.stdout.flush()
                elif (function == "emotion"):
                    reload(emotion)
                    print(emotion.main(model, word))
                    sys.stdout.flush()
                else:
                    print("no response")
                    sys.stdout.flush()
        except:
            print traceback.print_exc()
  
except KeyboardInterrupt:
    print 'exit launcher'
