package main;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketError;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;

public interface MyWebSocket {

	@OnWebSocketClose
	public void onClose(int statusCode, String reason);

	@OnWebSocketError
	public void onError(Throwable t);

	@OnWebSocketConnect
	public void onConnect(Session session);

	@OnWebSocketMessage
	public void onMessage(String message);

	public Session getSession();

	public void sendMessage(String message);
	
}
