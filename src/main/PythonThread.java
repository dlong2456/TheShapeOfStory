package main;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class PythonThread implements Runnable {
	
	private OutputStream stdin;
	private InputStream stdout;
	private Process process;

	public PythonThread() {
		try {
			ProcessBuilder pb = new ProcessBuilder("/Users/Duri/virtualenvironment/jython_app/venv/bin/python",
					"launcher.py", "run");
			pb.inheritIO();
			pb.directory(new File("/Users/Duri/TheRoadNotTaken/python/main"));
			process = pb.start();
			stdin = process.getOutputStream();
			stdout = process.getInputStream();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@Override
	public void run() {
		// TODO Auto-generated method stub

	}

	public String categorize(String noun) {
		String category = "";
		return category;
	}

	public String findAction(String verb) {
		String primitiveAction = "";
		return primitiveAction;
	}

	public String findEmotion(String emotion) {
		String basicEmotion = "";
		return basicEmotion;
	}

	public String findGender(String person) {
		String gender = "";
		return gender;
	}

}
