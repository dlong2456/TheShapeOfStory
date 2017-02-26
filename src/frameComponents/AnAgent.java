package frameComponents;

public class AnAgent extends AnEntity {
	
	public enum AgentType {
		HUMAN, ANIMAL
	}
	
	public enum Gender {
		MALE, FEMALE, NEUTRAL
	}

	private AgentType agentType;
	private Gender gender;
	
	public AgentType getAgentType() {
		return agentType;
	}

	public void setAgentType(AgentType newAgentType) {
		agentType = newAgentType;
	}

	public Gender getGender() {
		return gender;
	}

	public void setGender(Gender newGender) {
		gender = newGender;
	}


}
