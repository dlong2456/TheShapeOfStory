package main;

import org.eclipse.jetty.websocket.servlet.ServletUpgradeRequest;
import org.eclipse.jetty.websocket.servlet.ServletUpgradeResponse;
import org.eclipse.jetty.websocket.servlet.WebSocketCreator;

import edu.stanford.nlp.pipeline.StanfordCoreNLP;

public class WSCreator implements WebSocketCreator {

	PythonThread outThread;
	Object lock;
	StanfordCoreNLP pipeline;

	public WSCreator(PythonThread outThread, Object lock, StanfordCoreNLP pipeline) {
		this.outThread = outThread;
		this.lock = lock;
		this.pipeline = pipeline;
	}

	@Override
	public Object createWebSocket(ServletUpgradeRequest arg0, ServletUpgradeResponse arg1) {
		return new AMyWebSocket(outThread, lock, pipeline);
	}

}
