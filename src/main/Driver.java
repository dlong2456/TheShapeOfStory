package main;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.websocket.server.WebSocketHandler;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;

public class Driver {

	public static void main(String[] args) {
		// Once the model is loaded, the thread will call notify() and the
		// program can proceed
		// Don't kill the thread so we can call functions later without
		// reloading the model
		// Open a Jetty Websocket for the client to connect to
		Server server = new Server(8000); // 8080 for localhost
		WebSocketHandler wsHandler = new WebSocketHandler() {
			@Override
			public void configure(WebSocketServletFactory factory) {
				factory.register(AMyWebSocket.class);
			}
		};
		server.setHandler(wsHandler);
		try {
			server.start();
			server.join();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
