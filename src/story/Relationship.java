package story;

import frameComponents.FrameComponent;
import story.ARelationship.Intimacy;
import story.ARelationship.Positivity;
import story.ARelationship.RelationshipType;

public interface Relationship {
	public RelationshipType getRelationshipType();

	public void setRelationshipType(RelationshipType relType);

	public Intimacy getIntimacy();

	public void setIntimacy(Intimacy newIntimacy);

	public Positivity getPositivity();

	public void setPositivity(Positivity newPositivity);

	// for equal relationships, just ignore primary vs secondary labels
	public FrameComponent getPrimaryAgent();

	public void setPrimaryAgent(FrameComponent newAgent1);

	public FrameComponent getSecondaryAgent();

	public void setSecondaryAgent(FrameComponent newAgent2);
}