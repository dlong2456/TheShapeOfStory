package main;

import java.util.Properties;

import org.eclipse.jetty.websocket.server.WebSocketHandler;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;

import edu.stanford.nlp.pipeline.StanfordCoreNLP;

public class WSHandler extends WebSocketHandler {

	private PythonThread outThread;
	private Object lock = new Object();
	private StanfordCoreNLP pipeline;

	@Override
	public void configure(WebSocketServletFactory factory) {
		System.out.println("Loading Word2Vec before anything else");
		loadModel();
		Properties props = new Properties();
		props.put("annotators", "tokenize, ssplit, pos, lemma, ner, parse, mention, dcoref, sentiment");
		pipeline = new StanfordCoreNLP(props);
		factory.setCreator(new WSCreator(outThread, lock, pipeline));
	}
	
	private void loadModel() {
		// Make a new thread that executes the python script
		outThread = new PythonThread(lock);
		// Start the thread
		outThread.start();
		try {
			// Wait on the thread until the model is loaded
			System.out.println("waiting for model to load...");
			synchronized (lock) {
				while (!outThread.isReady()) {
					lock.wait();
				}
			}
			System.out.println("Model has been loaded but thread is still running in background!");
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
