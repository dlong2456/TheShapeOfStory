package main;

import java.io.IOException;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketError;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;

@WebSocket
public class AMyWebSocket implements MyWebSocket {
	private Session session;

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
	}

	// Receives messages from the web client(s)
	@OnWebSocketMessage
	public void onMessage(String message) {
		System.out.println("received message: " + message);
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

}