package frameComponents;

import frameComponents.AnAgent.AgentType;
import frameComponents.AnAgent.Gender;

public interface Agent extends Entity {

	public AgentType getAgentType();

	public void setAgentType(AgentType newAgentType);

	public Gender getGender();

	public void setGender(Gender newGender);
}
