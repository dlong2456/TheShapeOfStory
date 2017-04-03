'''
Created on Apr 1, 2017

@author: Duri
'''
import gensim as gensim

#todo: deal with word not in library exception from word2vec

# Load Google's pre-trained Word2Vec model.
print "hi"
model = gensim.models.KeyedVectors.load_word2vec_format('GoogleNews-vectors-negative300.bin', binary=True)
print "model loaded"

try:
    import traceback
    import categorize
    import emotion
    import gender
    import verb

    while True:
        print "waiting for input"
        string = raw_input()
        strings = string.split()
        function = strings[0]
        word = strings[1]
        try:
            print"got input " + function + " " + word
            if (function == "categorize"):
                print "categorize"
                reload(categorize)
                categorize.main(model, word)
            elif (function == "gender"): 
                print "gender"
                reload(gender)
                gender.main(model, word) 
            elif (function == "verb"): 
                print "verb"
                reload(verb)
                verb.main(model, word)
            elif (function == "emotion"):
                print "emotion"
                reload(emotion)
                emotion.main(model, word)
        except:
            print traceback.print_exc()

except KeyboardInterrupt:
    print 'exit launcher'