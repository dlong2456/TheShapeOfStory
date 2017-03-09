package story;

import frameComponents.FrameComponent;

public class ARelationship implements Relationship {

	private RelationshipType relationshipType;
	private Intimacy intimacy;
	private Positivity positivity;
	private FrameComponent agent1;
	private FrameComponent agent2;

	public enum Intimacy {
		INTIMATE, NON_INTIMATE, NEUTRAL
	}

	public enum Positivity {
		POSITIVE, NEGATIVE, NEUTRAL
	}

	public enum RelationshipType {
		DOMINANT, EQUAL
	}

	public RelationshipType getRelationshipType() {
		return relationshipType;
	}

	public void setRelationshipType(RelationshipType relType) {
		relationshipType = relType;
	}

	public Intimacy getIntimacy() {
		return intimacy;
	}

	public void setIntimacy(Intimacy newIntimacy) {
		intimacy = newIntimacy;
	}

	public Positivity getPositivity() {
		return positivity;
	}

	public void setPositivity(Positivity newPositivity) {
		positivity = newPositivity;
	}

	// for equal relationships, just ignore primary vs secondary labels
	public FrameComponent getPrimaryAgent() {
		return agent1;
	}

	public void setPrimaryAgent(FrameComponent newAgent1) {
		agent1 = newAgent1;
	}

	public FrameComponent getSecondaryAgent() {
		return agent2;
	}

	public void setSecondaryAgent(FrameComponent newAgent2) {
		agent2 = newAgent2;
	}

}
