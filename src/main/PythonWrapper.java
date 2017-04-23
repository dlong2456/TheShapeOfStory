package main;

public class PythonWrapper {
	
	static {
		System.load("/Users/Duri/TheRoadNotTaken/src/pythonCWrapper.dylib");
	}

	private native String categorize(String word);

	private native int loadModel();

	public PythonWrapper() {
		loadModel();
		categorize("dog");
	}

}
