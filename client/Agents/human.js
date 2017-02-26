function human (sex){
	this.type2 = "human";
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