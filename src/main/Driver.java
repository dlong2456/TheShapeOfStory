package main;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.websocket.server.WebSocketHandler;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;

public class Driver {

	public static void main(String[] args) {
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
		// Make NLP pipeline here because it takes awhile
		// Properties props = new Properties();
		// props.put("annotators", "tokenize, ssplit, pos, lemma, ner, parse,
		// mention, dcoref");
		//
		// StanfordCoreNLP pipeline = new StanfordCoreNLP(props);
		// Annotation document = new Annotation(
		// "The first time I ever had sushi was when I was about ten years old.
		// I was visiting my now late grandmother (or Khun Yai, as I called her
		// in Thai) in Bangkok, where she and my mother's family lived. I picked
		// at it, unsure of whether or not I wanted to eat this decidedly raw
		// fish in its spongy sleeve of rice. I was, after all, American, and
		// was used to food served through a car window. All of a sudden, I
		// spotted something familiar on my plate: a small but appetizing lump
		// of green guacamole. I scraped all of it up and plopped it in my
		// mouth, noticing an amused glint in my grandmother's eyes far too
		// late. Fire swept my mouth in a painful, sinus-clearing swell. As I
		// wailed, experiencing the zing of wasabi for the first time, my
		// grandmother laughed the heartiest, most earnest laugh I've ever heard
		// to this day.");
		// Annotation document = new Annotation(
		// "I brought a dog to Annie. Annie has a Toyota. She and I went to
		// Texas together. I took a drink from Annie. Annie has a nice dog. I
		// pulled Annie's dog. We all walked to the grocery store together.");
		// pipeline.annotate(document);
		// Make each sentence into a frame
		// FrameMaker frameMaker = new AFrameMaker(pipeline);
		// ArrayList<Frame> frames = frameMaker.makeFrame(document);
		// // PApplet.main("eliza.ElizaInterface");
	}

}
