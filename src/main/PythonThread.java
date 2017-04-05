package main;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;

public class PythonThread extends Thread {

	private OutputStream stdin;
	private InputStream stdout;
	private InputStream stderr;
	private Process process;
	private BufferedReader errReader;
	private BufferedReader reader;
	private BufferedWriter writer;
	private boolean ready = false;
	private boolean reading = true;
	private final Object lock;
	private String input = null;
	private String response;

	public PythonThread(Object lock) {
		this.lock = lock;
		try {
			System.out.println("thread started");
			ProcessBuilder pb = new ProcessBuilder("/Users/Duri/virtualenvironment/jython_app/venv/bin/python",
					"launcher.py", "run");
			pb.directory(new File("/Users/Duri/TheRoadNotTaken/python/main"));
			process = pb.start();
			stdout = process.getInputStream();
			stdin = process.getOutputStream();
			stderr =  process.getErrorStream();
			reader = new BufferedReader(new InputStreamReader(stdout));
			errReader = new BufferedReader(new InputStreamReader(stderr));
			writer = new BufferedWriter(new OutputStreamWriter(stdin));
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (Exception e) {
		}
	}

	@Override
	public void run() {
		// listen for input from Python program
		try {
			// don't notify until we receive notification that the model has
			// loaded
			while (reader.readLine() == null) {
				// spin
			}
			System.out.println("done waiting");
			synchronized (lock) {
				ready = true;
				// notify waiter
				System.out.println("Notifying");
				lock.notifyAll();
			}
			// Start a new while loop to listen for answers to function
			// calls here
			System.out.println("waiting for input...");
			while (reading) {
				// Listen to input from Java main thread
				if (input != null) {
					if (input.startsWith("categorize") || input.startsWith("gender") || input.startsWith("verb")
							|| input.startsWith("emotion")) {
						System.out.println("sending input to python");
						writer.write(input);
						writer.flush();
						input = null;
					}
				}
				// Listen to input from Python program
				if (reader.ready()) {
					response = reader.readLine();
					if (response != null) {
						System.out.println("input from python: " + response);
						synchronized (lock) {
							ready = true;
							// notify waiter that Python has returned it
							lock.notifyAll();
						}
					}
				}
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public boolean isReady() {
		return ready;
	}

	public void setReady(boolean ready) {
		this.ready = ready;
	}

	public void setInput(String input) {
		this.input = input;
	}
	
	public String getReturnVal() {
		return response;
	}

}
