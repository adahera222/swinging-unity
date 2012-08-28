#pragma strict


var swingForceScalar : float = 10;
var swingDistance : float = 1;
var flyingScalar : float = 2;
var jumpBoostScalar : float = 5;
var grabbingDrag : float = 1;
var climbingMovement : float = 0.1;
var ropeSegmentLength : float = 4;
var flyingRotationVelocity : float = 0.1;
var flyingDecay : float = 0.1;
var minFlyingVelocity : float = 1;


private var touchingTriggers : Array = []; // of Collider
private var movementController : Component;


function Start () 
{
	StartFlyingControl();
}


function FixedUpdate () 
{
	if(Input.GetKey("space"))
	{
		var touchingTrigger : Collider = touchingTriggers.length > 0 ? touchingTriggers[0] : null;		
		if(!(movementController instanceof FlyingControl) || !touchingTrigger) return;
		
		if(touchingTrigger.tag == "pole")
		{
			var poleControl : PoleControl = gameObject.AddComponent("PoleControl");
			poleControl.pole = touchingTrigger;
			poleControl.swingDistance = swingDistance;
			poleControl.swingForceScalar = swingForceScalar;
			poleControl.jumpBoostScalar = jumpBoostScalar;
			
			SetMovementController(poleControl);
		}
		else if(touchingTrigger.tag == "rope")
		{
			var ropeControl : RopeControl = gameObject.AddComponent("RopeControl");
			ropeControl.ropeSegment = touchingTrigger;
			ropeControl.swingForceScalar = swingForceScalar;
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
	Utility.AddToSet(touchingTriggers, other);
}


function OnTriggerExit (other : Collider) 
{
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
	flyingControl.grabbingDrag = grabbingDrag;
	flyingControl.flyingScalar = flyingScalar;
	flyingControl.flyingRotationVelocity = flyingRotationVelocity;
	flyingControl.flyingDecay = flyingDecay;
	flyingControl.minFlyingVelocity = minFlyingVelocity;

	SetMovementController(flyingControl);
}