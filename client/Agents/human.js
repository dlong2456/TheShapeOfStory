function human (sex){
	this.type = "human";
	this.sex = sex;
    if(this.sex === "female") 
    {
    	this.shape = "circle";
    }
    if(this.sex === "male")
    {
    	this.shape = "triangle";
    }
	
};