package main;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.websocket.server.WebSocketHandler;

public class Driver {

	public static void main(String[] args) {
		// Open a Jetty Websocket for the client to connect to
		Server server = new Server(8000);
		WebSocketHandler wsHandler = new WSHandler();
		server.setHandler(wsHandler);
		try {
			server.start();
			server.join();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
