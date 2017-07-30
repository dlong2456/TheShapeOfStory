# The Shape of Story

The Shape of Story is an interactive story circle experience in which participants collectively create a story line-by-line. Artificial intelligence in narrative understanding is used in conjunction with a symbolic visual language in order to visualize this story in real-time. The result is a narrative art piece that is collaboratively created by both participants and the computer. Read more [here](http://www.durilong.com/art/#/shape-of-story/).


# The Shape of Story

To run this project: 

1. Clone this Github repository.
2. Download Eclipse if you don't already have it and import the project into Eclipse.
3. Add [all necessary jar files](https://drive.google.com/open?id=0B7Q1JqWywb_nWEM3TmRwR09BdVU) to the project. 
4. [Install Python](http://python-guide-pt-br.readthedocs.io/en/latest/starting/installation/) if it is not already installed on your machine. Also install setup tools and pip.
5. [Create a Python virtual environment](http://python-guide-pt-br.readthedocs.io/en/latest/dev/virtualenvs/#virtualenvironments-ref) and install the following libraries within it using pip: numpy, scipy, gensim.
6. [Install PyDev for Eclipse](https://codeyarns.com/2014/12/23/how-to-install-pydev/).
7. In the Eclipse project properties, set the Python interpreter to the one in your virtual environment (located in the /bin folder within your virtual environment).
8. Run the backend by running the project from within Eclipse (main/Driver).
9. Run the front end by [starting a HTTP server](http://lifehacker.com/start-a-simple-web-server-from-any-directory-on-your-ma-496425450) in the client folder (using any port besides 8000) and opening client/JS/sketch.js in your web browser.
