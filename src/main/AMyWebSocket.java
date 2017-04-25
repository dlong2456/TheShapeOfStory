package main;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
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
import frameComponents.Action;
import frameComponents.AnAgent;
import frameComponents.AnObject;
import frameComponents.Emotion;
import frameComponents.Setting;
import story.AStory;
import story.AStory.Sentiment;
import story.Frame;
import story.Story;

@WebSocket
public class AMyWebSocket implements MyWebSocket {
	private Session session;
	private StanfordCoreNLP pipeline;
	private Story story;
	private PrintWriter out;
	private PythonThread outThread;
	private Object lock;

	public AMyWebSocket(PythonThread outThread, Object lock, StanfordCoreNLP pipeline) {
		this.outThread = outThread;
		this.lock = lock;
		this.pipeline = pipeline;
		System.out.println(pipeline);
	}

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
		story = new AStory();
	}

	// Receives messages from the web client(s)
	@SuppressWarnings("unchecked")
	@OnWebSocketMessage
	public void onMessage(String message) {
		// For debugging
		System.out.println("received message: " + message);
		if (!message.equals(null)) {
			// Sent each time a new person begins to speak
			if (message.equals("new person")) {
				// get story sentiment
				JSONObject sentiment = new JSONObject();
				if (story.getSentiment() != null) {
					sentiment.put("sentiment", story.getSentiment().toString().toLowerCase());
				} else {
					sentiment.put("sentiment", "");
				}
				sendMessage(sentiment.toJSONString());
				// save story sentiment to file
				writeToFile(sentiment.toJSONString());
				// Sent each time a new story session begins
			} else if (message.equals("new story")) {
				// start a new file for each new story
				out = null;
			} else {
				// TODO: Measure how long this annotation takes and see if you
				// can speed it up
				// Annotate the new piece of the story that server has received
				Annotation document = new Annotation(message);
				pipeline.annotate(document);
				// Generate frames from annotated story
				FrameMaker frameMaker = new AFrameMaker(outThread, lock, story);
				ArrayList<Frame> frames = frameMaker.makeFrame(document);
				if (story.getFrames() == null) {
					story.setFrames(frames);
				} else {
					story.addFrames(frames);
				}
				// Add new section to existing story
				story.augmentFullText(message);
				// Only send message back to client if frames exist
				if (frames != null) {
					String jsonString = convertToJSON(frames);
					sendMessage(jsonString);
					// Write new frames to file for display later
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

	// Writes JSON string to a .txt file in the stories folder
	// NOTE: To get project to run, you need to create a stories folder in your
	// project
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

	// Converts a list of frames to a JSON object so it can be sent to client
	@SuppressWarnings("unchecked")
	private static String convertToJSON(ArrayList<Frame> frames) {
		JSONObject obj = new JSONObject();
		JSONArray frameList = new JSONArray();
		for (int i = 0; i < frames.size(); i++) {
			JSONObject frame = new JSONObject();
			Action action = frames.get(i).getAction();
			Emotion emotion = frames.get(i).getEmotion();
			Setting setting = frames.get(i).getSetting();
			Sentiment sentiment = frames.get(i).getSentiment();
			if (action != null) {
				frame.put("action", action.getAnimation());
			} else {
				frame.put("action", "");
			}
			if (emotion != null) {
				frame.put("emotion", emotion.getPrimitiveEmotion());
			} else {
				frame.put("emotion", "");
			}
			if (sentiment != null) {
				frame.put("sentiment", sentiment.toString().toLowerCase());
			} else {
				frame.put("sentiment", "");
			}
			if (setting != null) {
				frame.put("setting_preposition", setting.getPreposition().toLowerCase());
			} else {
				frame.put("setting_preposition", "");
			}
			JSONArray subjects = new JSONArray();
			if (frames.get(i).getSubjects() != null) {
				for (int j = 0; j < frames.get(i).getSubjects().size(); j++) {
					JSONObject subject = new JSONObject();
					if (frames.get(i).getSubjects().get(j).getClass() == AnAgent.class) {
						subject.put("subjectType", "agent");
						subject.put("agentType",
								((AnAgent) frames.get(i).getSubjects().get(j)).getAgentType().toString());
						subject.put("gender", ((AnAgent) frames.get(i).getSubjects().get(j)).getGender().toString());
					} else {
						subject.put("subjectType", "object");
					}
					subjects.put(subject);
				}
				frame.put("subjects", subjects);
			} else {
				frame.put("subjects", "");
			}
			JSONArray predicates = new JSONArray();
			if (frames.get(i).getPredicates() != null) {
				for (int j = 0; j < frames.get(i).getPredicates().size(); j++) {
					JSONObject predicate = new JSONObject();
					if (frames.get(i).getPredicates().get(j).getClass() == AnAgent.class) {
						predicate.put("predicateType", "agent");
						predicate.put("agentType",
								((AnAgent) frames.get(i).getPredicates().get(j)).getAgentType().toString());
						predicate.put("gender",
								((AnAgent) frames.get(i).getPredicates().get(j)).getGender().toString());
					} else if (frames.get(i).getPredicates().get(j).getClass() == AnObject.class) {
						predicate.put("predicateType", "object");
					}
					predicates.put(predicate);
				}
				frame.put("predicates", predicates);
			} else {
				frame.put("predicates", "");
			}
			frameList.put(frame);
		}
		obj.put("frames", frameList);
		return obj.toJSONString();
	}

}