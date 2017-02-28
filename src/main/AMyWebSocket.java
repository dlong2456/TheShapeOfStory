package main;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Properties;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketError;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;

import edu.stanford.nlp.pipeline.Annotation;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import frameComponents.AnAgent;
import frameTypes.AConversationFrame;
import frameTypes.ALocationFrame;
import frameTypes.AnActionFrame;
import frameTypes.AnAgentFrame;
import frameTypes.AnEmotionFrame;
import frameTypes.AnObjectFrame;
import frameTypes.Frame;
import frameTypes.AFrame.FrameType;

@WebSocket
public class AMyWebSocket implements MyWebSocket {
	private Session session;
	private StanfordCoreNLP pipeline;

	@OnWebSocketClose
	public void onClose(int statusCode, String reason) {

	}

	@OnWebSocketError
	public void onError(Throwable t) {
		System.out.println("Error: " + t.getMessage());
	}

	@OnWebSocketConnect
	public void onConnect(Session session) {

		this.session = session;
		// Make NLP pipeline here because it takes awhile
		Properties props = new Properties();
		props.put("annotators", "tokenize, ssplit, pos, lemma, ner, parse, mention, dcoref");
		pipeline = new StanfordCoreNLP(props);
	}

	// Receives messages from the web client(s)
	@OnWebSocketMessage
	public void onMessage(String message) {
		System.out.println("received message: " + message);
		// TODO: Check message before processing it
		Annotation document = new Annotation(message);
		pipeline.annotate(document);
		FrameMaker frameMaker = new AFrameMaker(pipeline);
		ArrayList<Frame> frames = frameMaker.makeFrame(document);
		if (frames != null) {
			String jsonString = convertToJSON(frames);
			sendMessage(jsonString);
		}
	}

	public Session getSession() {
		return session;
	}

	// Send message to the web client
	public void sendMessage(String message) {
		System.out.println("OUTGOING MESSAGE: " + message);
		try {
			getSession().getRemote().sendString(message);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private static String convertToJSON(ArrayList<Frame> frames) {
		String json = "{\"frames\": [";
		for (int i = 0; i < frames.size(); i++) {
			Frame currentFrame = frames.get(i);
			String currentFrameJSON = "";
			if (currentFrame.getFrameType().equals(FrameType.ACTION)) {
				currentFrameJSON = "{ \"frameType\": \"action\", \"animation\": \""
						+ ((AnActionFrame) currentFrame).getAnimation() + "\" }";
			} else if (currentFrame.getFrameType().equals(FrameType.AGENT)) {
				currentFrameJSON = "{ \"frameType\": \"agent\", \"agents\": [";
				for (int j = 0; j < ((AnAgentFrame) currentFrame).getEntities().size(); j++) {
					currentFrameJSON += "{ \"agentType\": \""
							+ ((AnAgent) ((AnAgentFrame) currentFrame).getEntities().get(j)).getAgentType().toString()
							+ "\", \"gender\": \"" + ((AnAgent) ((AnAgentFrame) currentFrame).getEntities().get(j))
									.getGender().toString().toLowerCase()
							+ "\" }";
					if (j < ((AnAgentFrame) currentFrame).getEntities().size() - 1) {
						currentFrameJSON += ", ";
					}
				}
				currentFrameJSON += "]}";
			} else if (currentFrame.getFrameType().equals(FrameType.CONVERSATION)) {
				currentFrameJSON = "{ \"frameType\": \"conversation\", \"agents\": [";
				for (int j = 0; j < ((AConversationFrame) currentFrame).getEntities().size(); j++) {
					currentFrameJSON += "{ \"agentType\": \""
							+ ((AnAgent) ((AConversationFrame) currentFrame).getEntities().get(j)).getAgentType()
									.toString()
							+ "\", \"gender\": \""
							+ ((AnAgent) ((AConversationFrame) currentFrame).getEntities().get(j)).getGender()
									.toString().toLowerCase()
							+ "\" }";
					if (j < ((AConversationFrame) currentFrame).getEntities().size() - 1) {
						currentFrameJSON += ", ";
					}
				}
				currentFrameJSON += "], \"animation\": \"" + ((AConversationFrame) currentFrame).getAnimation()
						+ "\" }";
			} else if (currentFrame.getFrameType().equals(FrameType.LOCATION)) {
				currentFrameJSON = "{\"frameType\": \"location\", \"setting\": \""
						+ ((ALocationFrame) currentFrame).getLocation().getLemma() + "\"}";
			} else if (currentFrame.getFrameType().equals(FrameType.OBJECT)) {
				currentFrameJSON = "{\"frameType\": \"object\", \"object\": \""
						+ ((AnObjectFrame) currentFrame).getObject().getLemma() + "\"}";
			} else {
				// closeup frames
				currentFrameJSON = "{ \"frameType\": \"closeup\", \"agent\": { \"agentType\": \""
						+ ((AnAgent) ((AnEmotionFrame) currentFrame).getEntity()).getAgentType().toString()
						+ "\", \"gender\": \""
						+ ((AnAgent) ((AnEmotionFrame) currentFrame).getEntity()).getGender().toString().toLowerCase()
						+ "\" }, \"animation\": \"" + ((AnEmotionFrame) currentFrame).getAnimation() + "\" }";
			}
			// append new frame to JSON frame list
			if (i == frames.size() - 1) {
				json += currentFrameJSON;
			} else {
				json += currentFrameJSON + ", ";
			}
		}
		// close JSON object
		json += "]}";
		return json;
	}

}