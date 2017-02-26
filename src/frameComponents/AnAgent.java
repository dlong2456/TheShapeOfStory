package frameComponents;

public class AnAgent extends AnEntity {
	
	public enum AgentType {
		HUMAN, ANIMAL
	}
	
	public enum Gender {
		MALE, FEMALE
	}
	
	//default to male humans
	private AgentType agentType = AgentType.HUMAN;
	private Gender gender = Gender.MALE;
	
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
	
	//TODO: add agent name and number


}
