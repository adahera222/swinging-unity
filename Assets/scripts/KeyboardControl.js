#pragma strict


var swingDistance : float = 1;
var swingMaxForce : float = 10;
var swingVelocity : float = 50;
var flyingScalar : float = 2;
var flyingDrag : float = 0.1;
var flyingTime : float = 3;
var timeBetweenBoosts : float = 4;
var jumpBoostScalar : float = 5;
var climbingMovement : float = 0.1;
var ropeSegmentLength : float = 4;


private var touchingTriggers : Array = []; // of Collider
private var movementController : Component;


function Start () 
{
	StartFlyingControl();
}


function FixedUpdate () 
{
	if(Time.timeScale == 0) return;

	if(Input.GetMouseButton(0) || Input.GetKey("space"))
	{
		var touchingTrigger : Collider = touchingTriggers.length > 0 ? touchingTriggers[0] : null;		
		if(!(movementController instanceof FlyingControl) || !touchingTrigger) return;
		
		if(touchingTrigger.tag == "pole")
		{
			var poleControl : PoleControl = gameObject.AddComponent("PoleControl");
			poleControl.pole = touchingTrigger;
			poleControl.swingDistance = swingDistance;
			poleControl.swingMaxForce = swingMaxForce;
			poleControl.swingVelocity = swingVelocity;
			
			SetMovementController(poleControl);
		}
		else if(touchingTrigger.tag == "rope")
		{
			var ropeControl : RopeControl = gameObject.AddComponent("RopeControl");
			ropeControl.ropeSegment = touchingTrigger;
			ropeControl.jumpBoostScalar = jumpBoostScalar;
			ropeControl.ropeSegmentLength = ropeSegmentLength;
			ropeControl.climbingMovement = climbingMovement;

			SetMovementController(ropeControl);
		}		
	}
	else if(!(movementController instanceof FlyingControl))
	{
		StartFlyingControl();
	}
}


function OnTriggerEnter (other : Collider) 
{
	if(other.tag != "pole" && other.tag != "rope") return; 
	
	Utility.AddToSet(touchingTriggers, other);
}


function OnTriggerExit (other : Collider) 
{
	if(other.tag != "pole" && other.tag != "rope") return; 

	Utility.RemoveFromSet(touchingTriggers, other);
}


function SetMovementController(script : Component) : void
{
	if(movementController) Destroy(movementController);

	movementController = script;
}


function StartFlyingControl() : void
{
	var flyingControl : FlyingControl = gameObject.AddComponent("FlyingControl");
	flyingControl.flyingScalar = flyingScalar;
	flyingControl.flyingTime = flyingTime;
	flyingControl.flyingDrag = flyingDrag;
	flyingControl.timeBetweenBoosts = timeBetweenBoosts;

	SetMovementController(flyingControl);
}