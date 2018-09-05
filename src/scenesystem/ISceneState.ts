abstract class ISceneState{
	/**
	 * call before setting as a state of scene
	 */
	public initial(){}
	/**
	 * call by every frame
	 */
    public update(){}
	/**
	 * call before changing into other state and 
	 * scene release
	 */
	public release(){};
}