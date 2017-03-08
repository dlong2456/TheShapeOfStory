package main;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Properties;
import java.util.UUID;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketError;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.json.JSONArray;
import org.json.simple.JSONObject;

import edu.stanford.nlp.pipeline.Annotation;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import frameComponents.ASetting;
import frameComponents.AnAction;
import frameComponents.AnAgent;
import frameComponents.AnEmotion;
import story.AStory;
import story.Frame;
import story.Story;

@WebSocket
public class AMyWebSocket implements MyWebSocket {
	private Session session;
	private StanfordCoreNLP pipeline;
	private Story story;
	private PrintWriter out;

	@OnWebSocketClose
	public void onClose(int statusCode, String reason) {
		if (out != null) {
			out.close();
		}
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
		props.put("annotators", "tokenize, ssplit, pos, lemma, ner, parse, mention, dcoref, sentiment");
		pipeline = new StanfordCoreNLP(props);
		story = new AStory();
	}

	// Receives messages from the web client(s)
	@OnWebSocketMessage
	public void onMessage(String message) {
		// For debugging
		System.out.println("received message: " + message);
		if (!message.equals(null)) {
			if (message.equals("new person")) {
				// perform sentiment analysis on story
				story.setSentiment(pipeline);
				JSONObject sentiment = new JSONObject();
				sentiment.put("sentiment", story.getSentiment());
				sendMessage(sentiment.toJSONString());
				writeToFile(sentiment.toJSONString());
			} else if (message.equals("new story")) {
				// start a new file for each new story
				out = null;
			} else {
				Annotation document = new Annotation(message);
				pipeline.annotate(document);
				FrameMaker frameMaker = new AFrameMaker(pipeline);
				ArrayList<Frame> frames = frameMaker.makeFrame(document);
				if (story.getFrames() == null) {
					story.setFrames(frames);
				} else {
					story.addFrames(frames);
				}
				story.augmentFullText(message);
				// Only send message back if frames exist
				if (frames != null) {
					String jsonString = convertToJSON(frames);
					sendMessage(jsonString);
					writeToFile(jsonString);
				}
			}
		}
	}

	public Session getSession() {
		return session;
	}

	// Send message to the web client
	public void sendMessage(String message) {
		// For debugging
		System.out.println("OUTGOING MESSAGE: " + message);
		try {
			getSession().getRemote().sendString(message);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private void writeToFile(String json) {
		if (out != null) {
			out.println(json);
			out.flush();
		} else {
			File file = new File("stories/" + UUID.randomUUID() + ".txt");
			try {
				out = new PrintWriter(new FileWriter(file, true));
				out.println(json);
				out.flush();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

	@SuppressWarnings("unchecked")
	private static String convertToJSON(ArrayList<Frame> frames) {
		JSONObject obj = new JSONObject();
		JSONArray frameList = new JSONArray();
		for (int i = 0; i < frames.size(); i++) {
			JSONObject frame = new JSONObject();
			AnAction action = (AnAction) frames.get(i).getAction();
			AnEmotion emotion = (AnEmotion) frames.get(i).getEmotion();
			ASetting setting = (ASetting) frames.get(i).getSetting();
			if (action != null) {
				frame.put("action", action.getAnimation());
			} else {
				frame.put("action", null);
			}
			if (emotion != null) {
				frame.put("color", emotion.getColor());
			} else {
				frame.put("color", null);
			}
			if (setting != null) {
				frame.put("setting_preposition", setting.getPreposition());
			} else {
				frame.put("setting_preposition", null);
			}
			JSONArray subjects = new JSONArray();
			if (frames.get(i).getSubjects() != null) {
				for (int j = 0; j < frames.get(i).getSubjects().size(); j++) {
					JSONObject subject = new JSONObject();
					if (frames.get(i).getSubjects().get(j).getClass() == AnAgent.class) {
						subject.put("subjectType", "agent");
						subject.put("agentType", ((AnAgent) frames.get(i).getSubjects().get(j)).getAgentType());
						subject.put("gender", ((AnAgent) frames.get(i).getSubjects().get(j)).getAgentType());
					} else {
						subject.put("subjectType", "object");
					}
					subjects.put(subject);
				}
				frame.put("subjects", subjects);
			} else {
				frame.put("predicates", null);
			}
			JSONArray predicates = new JSONArray();
			if (frames.get(i).getPredicates() != null) {
				for (int j = 0; j < frames.get(i).getPredicates().size(); j++) {
					JSONObject predicate = new JSONObject();
					if (frames.get(i).getPredicates().get(j).getClass() == AnAgent.class) {
						predicate.put("predicateType", "agent");
						predicate.put("agentType", ((AnAgent) frames.get(i).getPredicates().get(j)).getAgentType());
						predicate.put("gender", ((AnAgent) frames.get(i).getPredicates().get(j)).getAgentType());
					} else {
						predicate.put("predicateType", "object");
					}
					predicates.put(predicate);
				}
				frame.put("predicates", predicates);
			} else {
				frame.put("predicates", null);
			}
			frameList.put(frame);
		}
		obj.put("frames", frameList);
		return obj.toJSONString();
	}

}