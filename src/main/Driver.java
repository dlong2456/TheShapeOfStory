package main;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintStream;
import java.util.Scanner;

public class Driver {

	private PrintStream input = null;
	private Scanner output = null;

	public static void main(String[] args) {
		// initialize gensim model
		System.out.println("HI");
		try {
			ProcessBuilder pb = new ProcessBuilder("/Users/Duri/virtualenvironment/jython_app/venv/bin/python",
					"launcher.py", "run");
			pb.inheritIO();
			pb.directory(new File("/Users/Duri/TheRoadNotTaken/python/main"));
			Process process;
			//Make a new thread
			//start the process in the new thread
			//wait on that thread for output
			//wait in a loop here until thread notifies that model has been loaded
			//then proceed here. Leave thread running
			//pass reference to thread to frameMaker so we can call functions
			process = pb.start();
			//InputStream errStream = process.getErrorStream();
			OutputStream stdin = process.getOutputStream();
			InputStream stdout = process.getInputStream();
		    Thread outThread = new Thread(() -> {
		    	boolean modelLoaded = false;
		        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stdout))) {
		            // Read stream here
		        	while (stdout == null) {
		        		//wait 
			        	System.out.println(stdout);
		        	}
		        	System.out.println(stdout);
		        	//spin until we receive notification that the model has loaded and then 
		        	while(!modelLoaded) {
		        		//try to read from output
		        		String output = "";
		        		if (output.equals(modelLoaded)) {
		        			modelLoaded = true;
		        		}
		        	}
		        	boolean systemRunning = true;
		        	boolean notified = false;
		        	while(systemRunning) {
		        		//wait for notification to call one of the python methods
		        		if (notified) {
		        			systemRunning = false;
		        		}
		        	}
		        } catch (Exception e) {
		        }
		    });
		    outThread.start();

			
			
			
			Scanner scanner = new Scanner(stdout);
			System.out.println("launched");
			boolean waitingForModel = true;
			while (waitingForModel) {
				System.out.println("Waiting for input");
				String nextLine = scanner.nextLine();
				System.out.println("next line: " + nextLine);
				if (nextLine.equals("model loaded")) {
					waitingForModel = false;
					BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(stdin));
					writer.write("categorize dog");
					writer.flush();
					writer.close();
				} else {
					//BufferedReader reader = new BufferedReader(new InputStreamReader(stdout));
					System.out.println(nextLine);
				}
			}
			System.out.println("out of while loop");
			scanner.close();
		}
		// PythonWrapper pyWrap = new PythonWrapper();
		// Open a Jetty Websocket for the client to connect to
		// Server server = new Server(8000); // 8080 for localhost
		// WebSocketHandler wsHandler = new WebSocketHandler() {
		// @Override
		// public void configure(WebSocketServletFactory factory) {
		// factory.register(AMyWebSocket.class);
		// }
		// };
		// server.setHandler(wsHandler);
		// try {
		// server.start();
		// server.join();
		// } catch (Exception e) {
		// e.printStackTrace();
		// }
		catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
